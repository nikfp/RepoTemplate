FROM node:latest

WORKDIR /app

COPY . .

RUN npm install -g pnpm

RUN pnpm install

ENV DATABASE_URL=file:./prisma/test.db
RUN DATABASE_URL=${DATABASE_URL} pnpm exec prisma migrate dev

RUN pnpm generate

EXPOSE 3000

CMD DATABASE_URL=${DATABASE_URL} pnpm start --host
