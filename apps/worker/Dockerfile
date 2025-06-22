FROM node:22-alpine AS base
WORKDIR /app
COPY ../../package.json ../../yarn.lock ./
RUN yarn install --frozen-lockfile

FROM base AS development
WORKDIR /app
COPY ../../ ./
CMD ["yarn", "start:dev", "worker"]

FROM base AS build
WORKDIR /app
COPY ../../ ./
RUN yarn build

FROM node:22-alpine AS production
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY ../../package.json ../../yarn.lock ./
RUN yarn install --production --frozen-lockfile

CMD ["node", "dist/apps/worker/main.js"]
