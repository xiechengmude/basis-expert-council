"""
BasisPilot — 文件存储抽象层
Supabase Storage 实现（复用已有环境变量）
"""

import os
import uuid
from abc import ABC, abstractmethod

import httpx

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
STORAGE_BUCKET = os.getenv("STORAGE_BUCKET", "homework-uploads")


class StorageBackend(ABC):
    @abstractmethod
    async def upload(self, data: bytes, filename: str, content_type: str) -> str:
        """Upload file and return public URL."""

    @abstractmethod
    async def delete(self, path: str) -> None:
        """Delete file by storage path."""

    @abstractmethod
    async def get_signed_url(self, path: str, expires_in: int = 3600) -> str:
        """Get a time-limited signed URL."""


class SupabaseStorage(StorageBackend):
    def __init__(self):
        self.base_url = SUPABASE_URL.rstrip("/")
        self.service_key = SUPABASE_SERVICE_ROLE_KEY
        self.bucket = STORAGE_BUCKET

    def _headers(self, content_type: str = "application/json") -> dict:
        return {
            "apikey": self.service_key,
            "Authorization": f"Bearer {self.service_key}",
            "Content-Type": content_type,
        }

    def _storage_path(self, filename: str) -> str:
        ext = filename.rsplit(".", 1)[-1] if "." in filename else "bin"
        return f"{uuid.uuid4().hex}.{ext}"

    async def upload(self, data: bytes, filename: str, content_type: str) -> str:
        path = self._storage_path(filename)
        url = f"{self.base_url}/storage/v1/object/{self.bucket}/{path}"
        headers = self._headers(content_type)

        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(url, content=data, headers=headers)
            resp.raise_for_status()

        # Return public URL
        return f"{self.base_url}/storage/v1/object/public/{self.bucket}/{path}"

    async def delete(self, path: str) -> None:
        url = f"{self.base_url}/storage/v1/object/{self.bucket}"
        headers = self._headers()
        async with httpx.AsyncClient(timeout=15) as client:
            await client.request("DELETE", url, headers=headers, json={"prefixes": [path]})

    async def get_signed_url(self, path: str, expires_in: int = 3600) -> str:
        url = f"{self.base_url}/storage/v1/object/sign/{self.bucket}/{path}"
        headers = self._headers()
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.post(url, headers=headers, json={"expiresIn": expires_in})
            resp.raise_for_status()
            data = resp.json()
            return f"{self.base_url}/storage/v1{data['signedURL']}"


_storage: StorageBackend | None = None


def get_storage() -> StorageBackend:
    global _storage
    if _storage is None:
        _storage = SupabaseStorage()
    return _storage
