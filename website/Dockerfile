FROM node:16-slim AS runner
RUN apt update && apt install -y curl tree

WORKDIR /app


# install prisma
ENV PRISMA_FILE=./.next/schema.prisma
ENV PRISMA_VERSION=4.4.0
RUN apt update && apt install openssl ca-certificates -y
RUN npm i -g prisma@$PRISMA_VERSION prisma-generator-kysely-mysql@latest prisma-json-schema-generator
RUN npm init -y && npm install @prisma/client@$PRISMA_VERSION
COPY $PRISMA_FILE ./schema.prisma
RUN prisma generate --schema ./schema.prisma

ENV FOLDER website
ENV NODE_ENV production

ADD ./.next/standalone ./

WORKDIR /app/$FOLDER


COPY ./.next/static ./.next/static
COPY ./next.config.js ./
COPY ./public ./public
COPY ./package.json ./

EXPOSE 3000

ENV PORT 3000

# CMD tree ./
CMD node server.js
