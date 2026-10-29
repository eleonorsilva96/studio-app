import { redirect } from "next/navigation";
import { Orbit, CheckCircle2, Circle } from "lucide-react";
import { isConfigured, supabaseServer } from "@/lib/supabase/server";
import { StudioForm } from "@/components/auth/form";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/actions";
export const dynamic = "force-dynamic";
export default async function Onboarding() {
 if (!isConfigured()) redirect("/login");
 const client = await supabaseServer();
 const { data: { user } } = await client.auth.getUser();
 if (!user) redirect("/login");
 const { data: memberships, error } = await client.from("memberships").select("id, organizations(id,name), membership_roles(role)").eq("user_id", user.id);
 if (error) return <main className="p-12"><h1 className="text-xl font-semibold">Configuração da base de dados pendente</h1><p className="mt-3">Aplica a migração inicial do projeto para continuar.</p></main>;
 const membership = memberships?.[0];
 const studio = membership?.organizations;
 const studioName = Array.isArray(studio) ? studio[0]?.name : (studio as {name: string} | null)?.name;
 const manager = !membership || membership.membership_roles.some(r => r.role === "manager");
 return <main className="min-h-screen bg-neutral-50"><header className="flex items-center justify-between border-b bg-white px-6 py-4"><span className="flex items-center gap-2 font-semibold"><Orbit size={22} />studio /</span><form action={signOut}><Button variant="ghost">Sair</Button></form></header><div className="mx-auto grid max-w-5xl gap-12 px-6 py-14 md:grid-cols-[220px_1fr]"><aside><p className="mb-6 text-xs uppercase tracking-widest text-neutral-400">Primeiros passos</p>{["O teu estúdio", "Espaços e modalidades", "Professores", "Planos", "Alunos", "Revisão"].map((step,i)=><div key={step} className={`flex items-center gap-3 py-3 text-sm ${i ? "text-neutral-400" : "font-medium"}`}>{i === 0 && studioName ? <CheckCircle2 size={16}/> : <Circle size={16}/>} {step}</div>)}</aside><section className="rounded-xl border bg-white p-7 sm:p-10"><p className="text-xs font-medium uppercase tracking-widest text-neutral-400">Configuração inicial · 01</p><h1 className="mt-4 text-3xl font-semibold tracking-tight">{studioName ? `Bem-vindo a ${studioName}` : "Vamos dar espaço ao teu estúdio."}</h1><p className="mb-8 mt-3 text-sm leading-6 text-neutral-500">{studioName ? "O estúdio está criado e a tua conta está associada." : "Começa pelo nome e pelo fuso horário. Esta será a base da tua agenda."}</p>{!membership ? <StudioForm/> : <div className="rounded-lg border bg-neutral-50 p-5 text-sm leading-6">{manager ? "Configuração base concluída. Os passos de modalidades, equipa e planos serão disponibilizados na próxima entrega." : "O teu acesso está ativo. A tua área de aulas será disponibilizada numa próxima entrega."}</div>}</section></div></main>;
}
