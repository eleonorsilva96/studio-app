import Link from "next/link";
import { Orbit, Check } from "lucide-react";
export function AuthShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="grid min-h-screen lg:grid-cols-[1fr_1fr]">
      <section className="flex flex-col px-7 py-8 sm:px-14">
        <Link
          href="/login"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight"
        >
          <Orbit size={24} /> studio<span className="text-neutral-400">/</span>
        </Link>
        <div className="mx-auto my-auto w-full max-w-[360px] py-16">
          <p className="mb-4 text-xs font-medium uppercase tracking-[.18em] text-neutral-400">
            O teu estúdio, em sintonia
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mb-8 mt-3 text-sm leading-6 text-neutral-500">
            {description}
          </p>
          {children}
        </div>
        <p className="text-xs text-neutral-400">
          Mais espaço para ensinar. Mais tempo para acompanhar.
        </p>
      </section>
      <aside className="hidden flex-col justify-center border-l bg-[#f7f7f5] p-16 lg:flex">
        <p className="mb-6 text-xs uppercase tracking-widest text-neutral-500">
          Feito para pequenos estúdios
        </p>
        <h2 className="max-w-lg text-5xl font-medium leading-[1.12] tracking-[-.045em]">
          Cada aula conta.
          <br />
          <span className="text-neutral-400">Cada pessoa também.</span>
        </h2>
        <p className="mt-6 max-w-sm text-base leading-7 text-neutral-500">
          Um lugar para organizar as aulas, aproximar a equipa e acompanhar os
          teus alunos.
        </p>
        <div className="mt-12 max-w-sm border-t border-neutral-200">
          {[
            "Uma agenda partilhada",
            "Planos e créditos organizados",
            "Gestor, professor e aluno em sintonia",
          ].map((x) => (
            <div
              key={x}
              className="flex items-center gap-3 border-b border-neutral-200 py-4 text-sm"
            >
              <Check size={15} className="text-neutral-400" />
              {x}
            </div>
          ))}
        </div>
      </aside>
    </main>
  );
}
