FROM node:18 as build

ENV PORT=8080
WORKDIR /src

# Check if we have 'corepack' available; if none, we
# install corepack@0.10.0.
RUN which corepack || npm install -g --force corepack@0.10.0
RUN corepack enable

COPY . .
COPY pnpm-lock.yaml* .
RUN pnpm install

# Build if we can build it
RUN pnpm build --filter web

FROM scratch as output
COPY --from=build /src/apps/web /