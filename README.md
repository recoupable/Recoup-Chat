# Recoup | AI Agents Made for the Music Industry

This is a [Next.js](https://nextjs.org) project made with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Description

Recoup is an AI agent platform fueling smarter song rollouts, unforgettable fan experiences and lasting artist growth -- Empowering music executives with actionable insights and next-gen tools to elevate every artist and engage every fan.

## Features

- AI-powered chatbot
- Real-time streaming responses
- Artist Mode for roster analytics
- User authentication with Privy
- Integration with Supabase for data storage
- Tailwind CSS for styling
- TypeScript for type safety

## Getting Started

First, install dependencies:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Project Structure

- `app/`: Contains the main application pages and layout
- `components/`: Reusable React components
- `lib/`: Utility functions and services
- `providers/`: React context providers
- `hooks/`: Custom React hooks
- `types/`: TypeScript type definitions
- `packages/`: Custom packages for shared functionality

## Key Components

- `LandingPage`: The main landing page component
- `Chat`: The core chat interface component
- `Suggestions`: Provides chat suggestions to users

## Configuration

This project uses various configuration files:

- `next.config.mjs`: Next.js configuration
- `tailwind.config.ts`: Tailwind CSS configuration
- `tsconfig.json`: TypeScript configuration
- `.eslintrc.json`: ESLint configuration

## Evals

This project includes OpenAI Evals for testing and evaluating the AI components. Evals help ensure the quality and reliability of our AI responses across different use cases in the music industry.

To run the evals:

```bash
oaieval gpt-3.5-turbo recoup
```

## Migration Error

If you see this error

```
ERROR: there is no unique constraint matching given keys for referenced table "artists" (SQLSTATE 42830)
At statement 2:
create table if not exists "public"."artist_social_links" (
    "id" uuid not null default gen_random_uuid(),
    "link" text,
    "type" social_type,
    "artistId" uuid not null,
    CONSTRAINT "artist_social_links_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "artist_social_links_artistId_fkey"
    FOREIGN KEY ("artistId")
    REFERENCES "public"."artists" ("id")
    ON DELETE CASCADE
)
```

Fix it by modifying `supabase/migrations/20241121201709_aritst_social_links_table.sql`

1. add `drop table "public"."artists";`
2. push your changes
3. once migrations pass, revert the changes

### Example of modified `supabase/migrations/20241121201709_aritst_social_links_table.sql`

```
create type "public"."social_type" as enum ('TIKTOK', 'YOUTUBE', 'INSTAGRAM', 'TWITTER', 'SPOTIFY', 'APPLE');
-- FIX IS LINE 3
drop table "public"."artists";
create table if not exists "public"."artists" (
    "id" uuid not null default gen_random_uuid(),
    "name" text,
    PRIMARY KEY ("id")
);
create table if not exists "public"."artist_social_links" (
    "id" uuid not null default gen_random_uuid(),
    "link" text,
    "type" social_type,
    "artistId" uuid not null,
    primary key ("id"),
    CONSTRAINT "artist_social_links_artistId_fkey"
    foreign key ("artistId")
    references "public"."artists" ("id")
    on delete cascade
);
```

## Learn More

To learn more about the technologies used in this project, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Supabase Documentation](https://supabase.io/docs) - learn about Supabase features and API.
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - learn about Tailwind CSS features.
- [TypeScript Documentation](https://www.typescriptlang.org/docs/) - learn about TypeScript.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.
