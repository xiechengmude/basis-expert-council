"""
SMS 登录路由 e2e 测试
测试 POST /api/auth/send-code 和 POST /api/auth/phone-login
使用 FastAPI TestClient，mock 阿里云 SMS 和 Supabase GoTrue API。
"""

import time
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from fastapi.testclient import TestClient

from basis_expert_council.sms import _code_store, verify_code


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------


@pytest.fixture(autouse=True)
def _clear_code_store():
    """Clear SMS code store before each test."""
    _code_store.clear()
    yield
    _code_store.clear()


@pytest.fixture(autouse=True)
def _set_supabase_env(monkeypatch):
    """Set Supabase env vars for phone-login tests."""
    monkeypatch.setenv("SUPABASE_URL", "http://fake-supabase:9999")
    monkeypatch.setenv("SUPABASE_SERVICE_ROLE_KEY", "fake-service-key")
    monkeypatch.setenv("SUPABASE_ANON_KEY", "fake-anon-key")
    monkeypatch.setenv("BASIS_DATABASE_URL", "")


@pytest.fixture()
def client(_set_supabase_env):
    """Create a fresh TestClient, importing server after env vars are set."""
    # Re-read env vars at module level by reloading
    import importlib

    import basis_expert_council.server as srv_mod

    importlib.reload(srv_mod)
    # Patch db.init_schema and db.close_pool so lifespan doesn't need a real DB
    with (
        patch.object(srv_mod.db, "init_schema", new_callable=AsyncMock),
        patch.object(srv_mod.db, "close_pool", new_callable=AsyncMock),
    ):
        with TestClient(srv_mod.app) as c:
            yield c


# ===========================================================================
# POST /api/auth/send-code
# ===========================================================================


class TestSendCode:
    def test_invalid_phone_short(self, client: TestClient):
        resp = client.post("/api/auth/send-code", json={"phone": "1380013"})
        assert resp.status_code == 400
        assert "有效" in resp.json()["error"]

    def test_invalid_phone_missing(self, client: TestClient):
        resp = client.post("/api/auth/send-code", json={})
        assert resp.status_code == 400

    def test_invalid_phone_letters(self, client: TestClient):
        resp = client.post("/api/auth/send-code", json={"phone": "abcdefghijk"})
        assert resp.status_code == 400

    @patch("basis_expert_council.server.send_code", new_callable=AsyncMock)
    def test_success(self, mock_send, client: TestClient):
        mock_send.return_value = None
        resp = client.post("/api/auth/send-code", json={"phone": "13800138000"})
        assert resp.status_code == 200
        data = resp.json()
        assert data["success"] is True
        assert data["expiresIn"] == 300
        mock_send.assert_called_once_with("13800138000")

    @patch("basis_expert_council.server.send_code", new_callable=AsyncMock)
    def test_rate_limit(self, mock_send, client: TestClient):
        from basis_expert_council.sms import RateLimitError

        mock_send.side_effect = RateLimitError("请等待 60 秒后再次发送")
        resp = client.post("/api/auth/send-code", json={"phone": "13800138000"})
        assert resp.status_code == 429
        assert "60" in resp.json()["error"]

    @patch("basis_expert_council.server.send_code", new_callable=AsyncMock)
    def test_sms_error(self, mock_send, client: TestClient):
        from basis_expert_council.sms import SmsError

        mock_send.side_effect = SmsError("短信发送失败")
        resp = client.post("/api/auth/send-code", json={"phone": "13800138000"})
        assert resp.status_code == 500
        assert "失败" in resp.json()["error"]


# ===========================================================================
# POST /api/auth/phone-login
# ===========================================================================


class TestPhoneLogin:
    def test_missing_fields(self, client: TestClient):
        resp = client.post("/api/auth/phone-login", json={"phone": "13800138000"})
        assert resp.status_code == 400
        assert "不能为空" in resp.json()["error"]

    def test_invalid_code(self, client: TestClient):
        resp = client.post(
            "/api/auth/phone-login", json={"phone": "13800138000", "code": "999999"}
        )
        assert resp.status_code == 400
        assert "无效" in resp.json()["error"]

    @patch("httpx.AsyncClient.post")
    @patch("httpx.AsyncClient.get")
    @patch("httpx.AsyncClient.put")
    def test_new_user_success(self, mock_put, mock_get, mock_post, client: TestClient):
        """New user: create succeeds, then sign-in succeeds."""
        phone = "13900139000"
        # Seed a valid code
        _code_store[phone] = {
            "code": "123456",
            "expires_at": time.time() + 300,
            "sent_at": time.time() - 10,
        }

        # Mock Supabase create user → 200
        create_resp = MagicMock()
        create_resp.status_code = 200
        create_resp.json.return_value = {"id": "uid-new-123"}

        # Mock Supabase sign-in → 200
        signin_resp = MagicMock()
        signin_resp.status_code = 200
        signin_resp.json.return_value = {
            "access_token": "at-xxx",
            "refresh_token": "rt-xxx",
        }

        mock_post.side_effect = [create_resp, signin_resp]

        resp = client.post(
            "/api/auth/phone-login", json={"phone": phone, "code": "123456"}
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["success"] is True
        assert data["accessToken"] == "at-xxx"
        assert data["refreshToken"] == "rt-xxx"
        assert data["userId"] == "uid-new-123"
        assert data["isNewUser"] is True

        # Code should be consumed
        assert phone not in _code_store

    @patch("httpx.AsyncClient.post")
    @patch("httpx.AsyncClient.get")
    @patch("httpx.AsyncClient.put")
    def test_existing_user_success(self, mock_put, mock_get, mock_post, client: TestClient):
        """Existing user: create fails, list finds user, update password, sign-in."""
        phone = "13900139001"
        _code_store[phone] = {
            "code": "654321",
            "expires_at": time.time() + 300,
            "sent_at": time.time() - 10,
        }

        # Mock create → 422 (already exists)
        create_resp = MagicMock()
        create_resp.status_code = 422
        create_resp.json.return_value = {"msg": "already exists"}

        # Mock list users → find by phone
        list_resp = MagicMock()
        list_resp.status_code = 200
        list_resp.json.return_value = {
            "users": [{"id": "uid-exist-456", "phone": phone, "email": f"{phone}@sms.basis.edu"}]
        }

        # Mock update password → 200
        update_resp = MagicMock()
        update_resp.status_code = 200
        update_resp.json.return_value = {}

        # Mock sign-in → 200
        signin_resp = MagicMock()
        signin_resp.status_code = 200
        signin_resp.json.return_value = {
            "access_token": "at-exist",
            "refresh_token": "rt-exist",
        }

        mock_post.side_effect = [create_resp, signin_resp]
        mock_get.return_value = list_resp
        mock_put.return_value = update_resp

        resp = client.post(
            "/api/auth/phone-login", json={"phone": phone, "code": "654321"}
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["success"] is True
        assert data["userId"] == "uid-exist-456"
        assert data["isNewUser"] is False

    @patch("httpx.AsyncClient.post")
    @patch("httpx.AsyncClient.get")
    @patch("httpx.AsyncClient.put")
    def test_signin_failure(self, mock_put, mock_get, mock_post, client: TestClient):
        """Sign-in step fails → 500."""
        phone = "13900139002"
        _code_store[phone] = {
            "code": "111111",
            "expires_at": time.time() + 300,
            "sent_at": time.time() - 10,
        }

        create_resp = MagicMock()
        create_resp.status_code = 200
        create_resp.json.return_value = {"id": "uid-789"}

        signin_resp = MagicMock()
        signin_resp.status_code = 400
        signin_resp.text = "Invalid credentials"
        signin_resp.json.return_value = {"error": "Invalid credentials"}

        mock_post.side_effect = [create_resp, signin_resp]

        resp = client.post(
            "/api/auth/phone-login", json={"phone": phone, "code": "111111"}
        )
        assert resp.status_code == 500
        assert "失败" in resp.json()["error"]


# ===========================================================================
# sms.py unit tests
# ===========================================================================


class TestSmsModule:
    def test_verify_code_success(self):
        phone = "13000000001"
        _code_store[phone] = {
            "code": "123456",
            "expires_at": time.time() + 300,
            "sent_at": time.time(),
        }
        assert verify_code(phone, "123456") is True
        assert phone not in _code_store  # consumed

    def test_verify_code_wrong(self):
        phone = "13000000002"
        _code_store[phone] = {
            "code": "123456",
            "expires_at": time.time() + 300,
            "sent_at": time.time(),
        }
        assert verify_code(phone, "000000") is False
        assert phone in _code_store  # not consumed

    def test_verify_code_expired(self):
        phone = "13000000003"
        _code_store[phone] = {
            "code": "123456",
            "expires_at": time.time() - 1,  # already expired
            "sent_at": time.time() - 400,
        }
        assert verify_code(phone, "123456") is False
        assert phone not in _code_store  # cleaned up

    def test_verify_code_not_found(self):
        assert verify_code("19999999999", "123456") is False
