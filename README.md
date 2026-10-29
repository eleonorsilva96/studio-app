This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Use pnpm 10.20.0 to install dependencies and run the development server:

```bash
pnpm install --frozen-lockfile
pnpm dev
```

The project pins pnpm in `package.json`. Commit dependency changes with
`pnpm-lock.yaml`. Use Node.js 24 (`nvm use`).

## Code checks and CI

Run these checks before opening a pull request:

```bash
pnpm lint
pnpm format:check
pnpm typecheck
pnpm build
```

Run `pnpm format` to fix formatting locally. CI only checks formatting; it does
not commit changes. Prettier handles supported source and documentation formats;
SQL and TOML are not checked by this setup.

The workflow in `.github/workflows/ci.yml` runs four independent checks (Lint,
Formatting, Typecheck, Build) on pull requests targeting `main` and pushes to
`main`. It uses the pinned pnpm version, a frozen lockfile and a dependency cache.
These checks do not exercise authentication or the database and need no Supabase
credentials.

After the workflow has run on GitHub, configure a branch ruleset for `main` in
Settings → Rules → Rulesets. Require pull requests and successful status checks,
then select Lint, Formatting, Typecheck and Build from this workflow. Availability
of branch protection depends on the repository visibility and GitHub plan.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
