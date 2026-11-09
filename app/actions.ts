"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { isConfigured, supabaseServer } from "@/lib/supabase/server";

export type FormState = { error?: string; message?: string };

export async function authenticate(
  mode: string,
  previous: FormState,
  form: FormData,
): Promise<FormState> {
  if (!isConfigured())
    return {
      error: "A ligação ao serviço de autenticação ainda não está configurada.",
    };
  const client = await supabaseServer();
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  if (mode !== "update" && !z.email().safeParse(email).success)
    return { error: "Introduz um email válido." };
  if (mode !== "forgot" && password.length < (mode === "login" ? 1 : 8))
    return { error: "Usa uma palavra-passe com pelo menos 8 caracteres." };
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  if (mode === "forgot") {
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/update-password`,
    });
    return error
      ? {
          error:
            "Não foi possível enviar o pedido. Tenta novamente mais tarde.",
        }
      : {
          message:
            "Se existir uma conta com este email, receberás instruções para recuperar o acesso.",
        };
  }
  if (mode === "register") {
    const name = String(form.get("name") ?? "").trim();
    if (!name || name.length > 100)
      return { error: "Indica o teu nome (até 100 caracteres)." };
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${origin}/auth/confirm`,
      },
    });
    if (error)
      return {
        error:
          "Não foi possível criar a conta. Verifica os dados ou tenta recuperar o acesso.",
      };
    if (!data.session)
      return {
        message: "Consulta o teu email para confirmar a conta e continuar.",
      };
  } else if (mode === "login") {
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error)
      return {
        error:
          "Não foi possível entrar. Verifica o email, a palavra-passe e a confirmação da conta.",
      };
  } else if (mode === "update") {
    const {
      data: { user },
    } = await client.auth.getUser();
    if (!user)
      return { error: "O link expirou. Pede um novo email de recuperação." };
    const { error } = await client.auth.updateUser({ password });
    if (error) return { error: "Não foi possível atualizar a palavra-passe." };
  } else return { error: "Operação inválida." };
  redirect("/onboarding");
}
export async function signOut() {
  const client = await supabaseServer();
  await client.auth.signOut();
  redirect("/login");
}
export async function createStudio(
  previous: FormState,
  form: FormData,
): Promise<FormState> {
  const parsed = z
    .object({
      name: z.string().trim().min(2).max(100),
      timezone: z.enum(["Europe/Lisbon", "Atlantic/Azores", "Europe/Madrid"]),
    })
    .safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: "Verifica o nome e o fuso horário." };
  const client = await supabaseServer();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) redirect("/login");
  const { error } = await client.rpc("create_studio", {
    studio_name: parsed.data.name,
    studio_timezone: parsed.data.timezone,
  });
  if (error)
    return {
      error:
        "Não foi possível criar o estúdio. Verifica a configuração da base de dados e tenta novamente.",
    };
  redirect("/onboarding");
}
