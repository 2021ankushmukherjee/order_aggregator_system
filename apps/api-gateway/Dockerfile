# Stage 1: Base image with yarn and build deps
FROM node:22-alpine AS base
WORKDIR /app
COPY ../../package.json ../../yarn.lock ./
RUN yarn install

# Stage 2: Development environment
FROM base AS development
WORKDIR /app
COPY ../../ ./
CMD ["yarn", "start:dev", "api-gateway"]

# Stage 3: Production build
FROM base AS build
WORKDIR /app
COPY ../../ ./
RUN yarn build

# Stage 4: Production runner
FROM node:22-alpine AS production
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY ../../package.json ../../yarn.lock ./
RUN yarn install --production --frozen-lockfile

CMD ["node", "dist/apps/api-gateway/main.js"]
