import type { UploadedFile } from "@/app/types/types";
import { getBasisToken, getApiBaseUrl } from "@/app/hooks/useUser";

export async function uploadFile(file: File): Promise<UploadedFile> {
  const baseUrl = getApiBaseUrl();
  const token = getBasisToken();

  const formData = new FormData();
  formData.append("file", file);

  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  // Do NOT set Content-Type — let browser add multipart boundary automatically

  const resp = await fetch(`${baseUrl}/api/files/upload`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ error: "上传失败" }));
    throw new Error(err.error || "上传失败");
  }

  const data = await resp.json();
  const previewUrl = URL.createObjectURL(file);

  return {
    file_id: String(data.file_id),
    url: data.url,
    filename: data.filename || file.name,
    content_type: file.type,
    preview_url: previewUrl,
  };
}
