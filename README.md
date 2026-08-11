# Grace Teaches

A simple, self-hosted CMS for **Grace Teaches**, a Bible-based ministry blog and podcast. Built with Next.js 16, Drizzle ORM, and Better Auth — designed to run on Vercel with a Supabase Postgres database.

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack, React 19)
- **Database:** PostgreSQL via [Supabase](https://supabase.com), queried with [Drizzle ORM](https://orm.drizzle.team)
- **Auth:** [Better Auth](https://www.better-auth.com) (email + password, session cookies)
- **Styling:** Tailwind CSS v4, self-hosted Playfair + Playwrite + Public Sans variable fonts
- **Linting/formatting:** [Biome](https://biomejs.dev)
- **Hosting:** [Vercel](https://vercel.com)

## Features

- Public blog with Markdown posts, scripture references, and cover images
- Public podcast with an HTML5 audio player, show notes, season/episode numbering
- Password-protected `/admin` CMS: dashboard, full post CRUD, full episode CRUD, draft/publish workflow
- No public sign-up screen — admin/editor accounts are created via a seed script or by an existing admin
- Route protection via `proxy.ts` (Next.js 16's renamed `middleware.ts`)

## Project structure

```
app/
  (public)/            Public site — home, /blog, /podcast, /about
  admin/
    login/              Public login page (outside the protected group)
    (dashboard)/        Protected admin area — dashboard, posts, episodes
  api/auth/[...all]/    Better Auth route handler
components/
  site/                 Public-facing UI (header, footer, cards)
  admin/                Admin UI (forms, shell, delete button)
  ui/                   Small shared primitives (button, badge, container)
db/
  schema/               Drizzle schema (auth tables + posts + episodes)
  index.ts              Drizzle client
  seed.ts               Creates the first admin user + sample content
lib/
  auth/                 Better Auth server config, client, session helper
  actions/              Server actions for post/episode CRUD
  content.ts            Public content queries
  utils.ts              Shared helpers (slugify, formatDate, cn, ...)
assets/fonts/            Self-hosted Playfair + Public Sans (OFL licensed)
proxy.ts                Route protection for /admin/*
drizzle.config.ts        Drizzle Kit config
```

## Local setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Supabase project

1. Create a free project at supabase.com.
2. Go to **Project Settings -> Database -> Connection string -> URI**.
3. Copy the **Transaction pooler** connection string (port `6543`) -- this works well with Vercel's serverless functions. Direct connections (port `5432`) also work for local development.

### 3. Configure environment variables

```bash
cp .env.example .env
```

Fill in `.env`:

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | Your Supabase Postgres connection string |
| `BETTER_AUTH_SECRET` | A long random string -- generate with `npx @better-auth/cli@latest secret` |
| `BETTER_AUTH_URL` | The canonical URL of the app (`http://localhost:3000` locally) |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Same as above, exposed to the browser |
| `NEXT_PUBLIC_SITE_URL` | Used for metadata / Open Graph |
| `NEXT_PUBLIC_SITE_NAME` | Defaults to "Grace Teaches" |
| `SEED_ADMIN_NAME` / `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Used only once, by `npm run db:seed` |

### 4. Push the schema and seed an admin account

```bash
npm run db:generate   # generates SQL migration files into /drizzle
npm run db:migrate    # applies them to your database
npm run db:seed       # creates your first admin user + one sample post/episode
```

### 5. Run the dev server

```bash
npm run dev
```

- Public site: `http://localhost:3000`
- Admin: `http://localhost:3000/admin/login` -- sign in with the `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` you set in `.env`

## Adding more team accounts

There's intentionally no public "create account" page. To add another editor or admin, either:

- Adjust `SEED_ADMIN_*` in `.env` and extend `db/seed.ts`, or
- Call `auth.api.signUpEmail({ body: { name, email, password } })` from a one-off script (same pattern as the seed script), then set their `role` with a direct Drizzle update if they should be `"admin"` instead of the default `"editor"`.

## Deploying to Vercel

1. Push this repo to GitHub (or GitLab/Bitbucket).
2. In Vercel, **Add New Project** -> import the repo.
3. Add the environment variables from `.env` to the Vercel project (**Settings -> Environment Variables**). Use your real production values -- in particular:
   - `BETTER_AUTH_URL` and `NEXT_PUBLIC_BETTER_AUTH_URL` should be your production domain (e.g. `https://graceteaches.org`)
   - `DATABASE_URL` should be the Supabase **pooled** connection string
4. Deploy. Vercel will run `next build` automatically.
5. After the first deploy, run the migration + seed **once** against production, either:
   - Locally, by temporarily pointing your `.env`'s `DATABASE_URL` at the production Supabase database and running `npm run db:migrate` and `npm run db:seed`, or
   - Via Supabase's SQL editor, pasting the contents of the generated file(s) in `/drizzle`.
6. Visit `https://yourdomain.com/admin/login` and sign in.

### Custom domain

Add your domain in Vercel's project settings, then update `BETTER_AUTH_URL`, `NEXT_PUBLIC_BETTER_AUTH_URL`, and `NEXT_PUBLIC_SITE_URL` to match before redeploying.

## Content model

**Posts** -- title, slug, excerpt, Markdown content, optional scripture reference, optional cover image URL, status (`draft`/`published`), publish date.

**Episodes** -- title, slug, description/show notes, optional scripture reference, audio URL (host your MP3s on Supabase Storage or anywhere else public), optional cover image, season/episode number, duration in seconds, status, publish date.

Cover images and audio files are referenced by URL rather than uploaded directly -- point them at Supabase Storage, an existing podcast host (Spotify for Podcasts, Anchor, etc.), or any public file host.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start the production server |
| `npm run lint` | Check formatting/lint with Biome |
| `npm run lint:fix` | Auto-fix Biome issues |
| `npm run db:generate` | Generate SQL migrations from the Drizzle schema |
| `npm run db:migrate` | Apply migrations |
| `npm run db:push` | Push schema directly without migration files (dev convenience) |
| `npm run db:studio` | Open Drizzle Studio to browse your database |
| `npm run db:seed` | Create the first admin user + sample content |

## Notes on Next.js 16

This project targets Next.js 16, which has a few breaking changes from earlier versions worth knowing about if you extend it:

- `middleware.ts` is renamed to `proxy.ts` (this project already uses the new name).
- Route `params` and `searchParams` are always `Promise`s -- always `await` them, and prefer the generated `PageProps<'/route/path'>` / `LayoutProps<'/route/path'>` helper types over hand-written ones.
- `next lint` has been removed in favor of running a linter directly -- this project uses Biome (`npm run lint`).
