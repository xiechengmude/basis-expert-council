import Dysmsapi, * as $Dysmsapi from "@alicloud/dysmsapi20170525";
import * as $OpenApi from "@alicloud/openapi-client";
import * as $Util from "@alicloud/tea-util";

// In-memory store for verification codes
const codeStore = new Map<
  string,
  { code: string; expiresAt: number; sentAt: number }
>();

function createSmsClient(): Dysmsapi {
  const config = new $OpenApi.Config({
    type: "access_key",
    accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID!,
    accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET!,
    endpoint: "dysmsapi.aliyuncs.com",
  });
  return new Dysmsapi(config);
}

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendCode(phone: string): Promise<void> {
  const now = Date.now();
  const existing = codeStore.get(phone);

  // 60s resend limit
  if (existing && now - existing.sentAt < 60_000) {
    throw new Error("请等待 60 秒后再次发送");
  }

  const code = generateCode();
  codeStore.set(phone, {
    code,
    expiresAt: now + 5 * 60 * 1000, // 5 minutes
    sentAt: now,
  });

  const client = createSmsClient();
  const request = new $Dysmsapi.SendSmsRequest({
    phoneNumbers: phone,
    signName: process.env.ALIYUN_SMS_SIGN_NAME!,
    templateCode: process.env.ALIYUN_SMS_TEMPLATE_CODE!,
    templateParam: JSON.stringify({ code }),
  });
  const runtime = new $Util.RuntimeOptions({});

  const response = await client.sendSmsWithOptions(request, runtime);
  if (response.body?.code !== "OK") {
    // Clean up stored code on failure
    codeStore.delete(phone);
    throw new Error(response.body?.message || "短信发送失败");
  }
}

export function verifyCode(phone: string, code: string): boolean {
  const stored = codeStore.get(phone);
  if (!stored) return false;

  if (Date.now() > stored.expiresAt) {
    codeStore.delete(phone);
    return false;
  }

  if (stored.code !== code) return false;

  // Consume the code after successful verification
  codeStore.delete(phone);
  return true;
}
