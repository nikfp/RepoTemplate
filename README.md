# sveltekit project template

This is designed as a starting point to get a usable project running quickly. This uses simple auth and makes the assumptions that Sveltekit will be used in an SSR scenario in either a serverless function or long running in a server.

## Assumptions

- PNPM is the primary package manager for this project. Other package managers can be used but aren't tested.
- Prisma is used as the ORM. The database URL needs to be set as an environment variable
  - In development, use "file:./test.db" and a local test database will be set up
  - In production, change the provider to your dB of choice
 
## Setting up

Once you've cloned the repo, you need to do the following steps to get the dev environment set up:

Install dependencies: `pnpm install`

Create generated files: `pnpm generate`

Migrate dev database to current version:
`pnpm exec prisma migrate dev`


## Developing 

The dev server is set up to run on localhost:3000

Start the dev server and the file watcher for graphql:
`pnpm dev`

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
