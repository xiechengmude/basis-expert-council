"""
阿里云 SMS 短信验证码模块
1:1 对应原 frontend/src/lib/sms.ts 逻辑
"""

import json
import logging
import os
import random
import time

logger = logging.getLogger("basis.sms")

# ---------------------------------------------------------------------------
# In-memory verification code store
# ---------------------------------------------------------------------------

_code_store: dict[str, dict] = {}  # phone -> {code, expires_at, sent_at}


def _generate_code() -> str:
    return str(random.randint(100000, 999999))


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------


async def send_code(phone: str) -> None:
    """Send SMS verification code. Raises on failure."""
    now = time.time()
    existing = _code_store.get(phone)

    # 60s resend limit
    if existing and now - existing["sent_at"] < 60:
        raise RateLimitError("请等待 60 秒后再次发送")

    code = _generate_code()
    _code_store[phone] = {
        "code": code,
        "expires_at": now + 5 * 60,  # 5 minutes
        "sent_at": now,
    }

    try:
        from alibabacloud_dysmsapi20170525.client import Client
        from alibabacloud_dysmsapi20170525.models import SendSmsRequest
        from alibabacloud_tea_openapi.models import Config
        from alibabacloud_tea_util.models import RuntimeOptions

        config = Config(
            type="access_key",
            access_key_id=os.environ.get("ALIYUN_ACCESS_KEY_ID", ""),
            access_key_secret=os.environ.get("ALIYUN_ACCESS_KEY_SECRET", ""),
            endpoint="dysmsapi.aliyuncs.com",
        )
        client = Client(config)

        request = SendSmsRequest(
            phone_numbers=phone,
            sign_name=os.environ.get("ALIYUN_SMS_SIGN_NAME", ""),
            template_code=os.environ.get("ALIYUN_SMS_TEMPLATE_CODE", ""),
            template_param=json.dumps({"code": code}),
        )
        runtime = RuntimeOptions()

        response = client.send_sms_with_options(request, runtime)
        if response.body.code != "OK":
            _code_store.pop(phone, None)
            raise SmsError(response.body.message or "短信发送失败")

    except (RateLimitError, SmsError):
        raise
    except Exception as e:
        _code_store.pop(phone, None)
        logger.error(f"SMS send failed: {e}")
        raise SmsError(f"短信发送失败: {e}")


def verify_code(phone: str, code: str) -> bool:
    """Verify code. Returns True on success, consuming the code."""
    stored = _code_store.get(phone)
    if not stored:
        return False

    if time.time() > stored["expires_at"]:
        _code_store.pop(phone, None)
        return False

    if stored["code"] != code:
        return False

    # Consume after successful verification
    _code_store.pop(phone, None)
    return True


# ---------------------------------------------------------------------------
# Exceptions
# ---------------------------------------------------------------------------


class RateLimitError(Exception):
    pass


class SmsError(Exception):
    pass
