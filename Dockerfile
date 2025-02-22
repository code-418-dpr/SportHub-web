ARG NODE_VERSION=22.5-alpine
FROM node:${NODE_VERSION} AS base
WORKDIR /usr/src/far-backend

FROM base AS deps
COPY package.json package-lock.json ./
COPY src/prisma ./src/prisma/
RUN npm install

FROM deps AS final
COPY . ./
RUN npm run build
EXPOSE 3000

CMD npx prisma db push && npm run start