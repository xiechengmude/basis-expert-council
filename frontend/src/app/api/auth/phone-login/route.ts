import { NextRequest, NextResponse } from "next/server";
import { verifyCode } from "@/lib/sms";
import { createAdminClient } from "@/lib/supabase/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { phone, code } = await request.json();

    if (!phone || !code) {
      return NextResponse.json(
        { error: "手机号和验证码不能为空" },
        { status: 400 }
      );
    }

    if (!verifyCode(phone, code)) {
      return NextResponse.json(
        { error: "验证码无效或已过期" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const email = `${phone}@sms.basis.edu`;
    const password = crypto.randomUUID() + "Aa1!";

    // Try to create user; if already exists, update password
    const { data: createData, error: createError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        phone,
        phone_confirm: true,
        email_confirm: true,
        user_metadata: { phone, phone_verified_by: "backend_sms" },
      });

    let userId: string;
    let isNewUser = true;

    if (createError) {
      // User already exists — find and update password
      const { data: listData } = await supabase.auth.admin.listUsers({
        perPage: 1,
      });

      const existingUser = listData?.users?.find((u) => u.phone === phone);
      if (!existingUser) {
        // Try finding by email
        const { data: listData2 } = await supabase.auth.admin.listUsers({
          perPage: 50,
        });
        const byEmail = listData2?.users?.find((u) => u.email === email);
        if (!byEmail) {
          return NextResponse.json(
            { error: "用户创建失败，请重试" },
            { status: 500 }
          );
        }
        userId = byEmail.id;
      } else {
        userId = existingUser.id;
      }

      isNewUser = false;

      await supabase.auth.admin.updateUserById(userId, { password });
    } else {
      userId = createData.user.id;
    }

    // Sign in to get session tokens
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({ email, password });

    if (signInError || !signInData.session) {
      return NextResponse.json(
        { error: "登录失败，请重试" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      accessToken: signInData.session.access_token,
      refreshToken: signInData.session.refresh_token,
      userId,
      isNewUser,
    });
  } catch (error) {
    console.error("Phone login error:", error);
    return NextResponse.json({ error: "登录失败" }, { status: 500 });
  }
}
