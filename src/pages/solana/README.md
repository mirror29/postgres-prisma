---
name: Vercel Postgres + Prisma Next.js Starter
slug: postgres-prisma
description: 用Next.js14+Prisma+PostgreSQL+Rust的全栈Solana web3项目demo
framework: Next.js
useCase: Starter
css: daisyUI + Tailwind
database: Vercel Postgres
relatedTemplates:
  - postgres-starter
  - postgres-kysely
  - postgres-sveltekit
---
# Vercel Postgres + Prisma Next.js Starter

Simple Next.js template that uses [Vercel Postgres](https://vercel.com/postgres) as the database and [Prisma](https://prisma.io/) as the ORM.

### Clone and Deploy

Once that's done, copy the .env.example file in this directory to .env.development.local (which will be ignored by Git):

```bash
cp .env.example .env.development.local
```

Then open .env.development.local and set the environment variables to match the ones in your Vercel Storage Dashboard.

Next, run Next.js in development mode:

```bash
ni dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples) ([Documentation](https://nextjs.org/docs/deployment)).
