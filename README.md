# sveltekit project template

This is designed as a starting point to get a usable project running quickly. This uses simple auth and makes the assumptions that Sveltekit will be used in an SSR scenario in either a serverless function or long running in a server.

## Assumptions

- PNPM is the primary package manager for this project. Other package managers can be used but aren't tested.
- Prisma is used as the ORM. The database URL needs to be set as an environment variable
  - In development, use "file:./test.db" and a local test database will be set up

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
