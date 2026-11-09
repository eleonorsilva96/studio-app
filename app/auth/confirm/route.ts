import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const client = await supabaseServer();
  const token_hash = params.get("token_hash");
  const type = params.get("type");
  const code = params.get("code");
  if (
    token_hash &&
    (type === "signup" || type === "recovery" || type === "email")
  ) {
    const { error } = await client.auth.verifyOtp({
      token_hash,
      type: type as EmailOtpType,
    });
    if (!error)
      return NextResponse.redirect(
        new URL(
          type === "recovery" ? "/update-password" : "/onboarding",
          request.url,
        ),
      );
  }
  if (code) {
    const { error } = await client.auth.exchangeCodeForSession(code);
    if (!error)
      return NextResponse.redirect(new URL("/onboarding", request.url));
  }
  return NextResponse.redirect(
    new URL("/login?error=confirmation", request.url),
  );
}
