"use client";
import { useActionState } from "react";
import Link from "next/link";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authenticate, createStudio, type FormState } from "@/app/actions";
const input = "mt-2 h-11 w-full rounded-md border bg-white px-3 text-sm outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-100";
export function AuthForm({ mode, configured = true }: { mode: string; configured?: boolean }) {
 const [state, action, pending] = useActionState(authenticate.bind(null, mode), {} as FormState);
 const label = mode === "login" ? "Entrar" : mode === "register" ? "Criar conta" : mode === "forgot" ? "Enviar instruções" : "Guardar palavra-passe";
 return <form action={action} className="space-y-5">
 {mode === "register" && <label className="block text-sm font-medium">O teu nome<input className={input} name="name" autoComplete="name" required maxLength={100} placeholder="Nome completo" /></label>}
 {mode !== "update" && <label className="block text-sm font-medium">Email<input className={input} name="email" type="email" autoComplete="email" placeholder="nome@estudio.pt" required /></label>}
 {mode !== "forgot" && <label className="block text-sm font-medium">Palavra-passe<input className={input} name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={mode === "login" ? 1 : 8} required placeholder={mode === "login" ? "A tua palavra-passe" : "Pelo menos 8 caracteres"} /></label>}
 {mode === "login" && <Link href="/forgot-password" className="block text-right text-xs text-neutral-500 hover:text-black">Esqueceste-te da palavra-passe?</Link>}
 {!configured && <p className="rounded-md border bg-neutral-50 p-3 text-xs text-neutral-600">Configuração inicial: liga o projeto ao Supabase para ativar o acesso.</p>}
 {state.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
 {state.message && <p role="status" className="rounded-md bg-neutral-100 p-3 text-sm">{state.message}</p>}
 <Button className="h-11 w-full" disabled={pending || !configured}>{pending ? <LoaderCircle className="animate-spin" /> : <>{label}<ArrowRight /></>}</Button>
 <p className="text-center text-sm text-neutral-500">{mode === "login" ? <>Ainda não tens conta? <Link className="text-black underline underline-offset-4" href="/register">Começar</Link></> : <Link href="/login" className="underline underline-offset-4">Voltar ao início de sessão</Link>}</p>
 </form>;
}
export function StudioForm() {
 const [state, action, pending] = useActionState(createStudio, {} as FormState);
 return <form action={action} className="max-w-md space-y-6"><label className="block text-sm font-medium">Nome do estúdio<input className={input} name="name" required minLength={2} maxLength={100} placeholder="Ex.: Estúdio Movimento" /></label><label className="block text-sm font-medium">Fuso horário<select className={input} name="timezone" defaultValue="Europe/Lisbon"><option value="Europe/Lisbon">Lisboa / Madeira</option><option value="Atlantic/Azores">Açores</option><option value="Europe/Madrid">Madrid</option></select></label>{state.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}<Button className="h-10" disabled={pending}>{pending ? "A criar…" : "Criar o meu estúdio"}<ArrowRight /></Button></form>;
}
