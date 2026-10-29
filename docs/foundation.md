# Entrega 1 — Fundação

## Modelo

O schema `auth` é gerido pelo Supabase. `auth.users` guarda a identidade e a autenticação. Nunca guardamos palavras-passe nas tabelas da aplicação.

O schema `public` contém:

- `profiles`: 1:1 com `auth.users`; nome da pessoa. Criado quando se cria o primeiro estúdio. O fluxo futuro de convites deverá criar a ficha antes da associação.
- `organizations`: estúdio, fuso horário e passo inicial do onboarding. Nesta entrega, uma pessoa cria no máximo um estúdio.
- `memberships`: relação entre pessoa e estúdio, única por par. Permite evolução para várias associações, embora a interface atual use uma.
- `membership_roles`: relação 1:N com a associação. O mesmo membro pode ser `manager` e `teacher`, por exemplo. Papéis válidos: manager, teacher, student.

Não existem ainda modelos de aulas, alunos, professores ou créditos: pertencem às entregas seguintes. A identidade autenticada não substituirá as fichas de domínio importáveis.

## Isolamento

Todas as tabelas têm RLS. Uma pessoa lê apenas o próprio perfil, as próprias associações e papéis, e estúdios aos quais pertence. As políticas têm uma cadeia sem recursão: organizações/papéis → memberships → auth.uid().

As tabelas não aceitam INSERT/UPDATE/DELETE do cliente. A criação passa exclusivamente por `create_studio`, uma transação que cria perfil, estúdio, associação e papel de gestor. A identidade vem de auth.uid(), nunca de um user_id enviado pelo browser. Pedidos repetidos retornam o estúdio existente. O bloqueio transacional impede duplicação concorrente.

A função usa SECURITY DEFINER com search_path vazio, nomes qualificados e execução limitada a authenticated. É uma exceção deliberada às políticas, limitada à criação do próprio estúdio. Nenhuma service-role key é usada na aplicação.

Os acessos futuros a equipas exigirão políticas adicionais para gestores. Não demos acesso geral a perfis de outros membros. As futuras tabelas terão organization_id e relações que garantam coerência entre organizações.

## Configuração Supabase

1. Criar um projeto Supabase e aplicar `supabase/migrations/202610220001_foundation.sql` no SQL Editor (ou via CLI/migrações).
2. Copiar `.env.example` para `.env.local` e preencher URL e publishable key. Não usar service_role.
3. Configurar Site URL como http://localhost:3000 e os redirects /auth/confirm e /update-password. Na publicação, substituir pela origem HTTPS.
4. Ativar confirmação de email. Template de confirmação: `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup`.
5. Template de recuperação: `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery`. Este fluxo funciona também ao abrir o email noutro browser.
6. Executar `pnpm install --frozen-lockfile` e `pnpm dev`. Criar conta, confirmar email, criar estúdio. A criação conduz ao início do onboarding; os restantes passos ainda não estão implementados.

Em produção, configurar SMTP, limites de autenticação e URLs de produção no Supabase. O servidor usa a sessão do utilizador. O proxy renova cookies; as páginas e ações voltam a validar a identidade.

## Verificação antes de aceitar dados reais

Executar `supabase/tests/isolation.sql` num projeto de teste, após a migração. O teste corre numa transação e faz rollback. Testar também registo/confirmar email, login inválido/válido, recuperação/alteração de palavra-passe, logout e acesso direto ao onboarding sem sessão.

O build e a verificação TypeScript não substituem os testes da base de dados nem de entrega de emails. Estes precisam de um Supabase configurado.
