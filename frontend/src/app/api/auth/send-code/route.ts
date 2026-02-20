import { NextRequest, NextResponse } from "next/server";
import { sendCode } from "@/lib/sms";

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone || !/^1\d{10}$/.test(phone)) {
      return NextResponse.json(
        { error: "请输入有效的 11 位手机号" },
        { status: 400 }
      );
    }

    await sendCode(phone);

    return NextResponse.json({ success: true, expiresIn: 300 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "发送验证码失败";
    return NextResponse.json({ error: message }, { status: 429 });
  }
}
