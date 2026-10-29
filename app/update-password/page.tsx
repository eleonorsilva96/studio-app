import { AuthShell } from "@/components/auth/shell";
import { AuthForm } from "@/components/auth/form";
import { isConfigured } from "@/lib/supabase/server";
export default async function Page({ searchParams }: { searchParams: Promise<{error?: string}> }) { const params = await searchParams; return <AuthShell title="Uma nova palavra-passe" description="Escolhe uma palavra-passe com pelo menos 8 caracteres.">{params.error && <p role="alert" className="mb-4 text-sm text-red-700">O link é inválido ou expirou. Pede um novo email.</p>}<AuthForm mode="update" configured={isConfigured()} /></AuthShell>; }
