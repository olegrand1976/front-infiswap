ARG NODE_VERSION=22.12.0

FROM node:${NODE_VERSION}-slim AS build

WORKDIR /app

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm ci

COPY . ./

COPY docker/entrypoint-dev.sh /usr/local/bin/entrypoint-dev.sh
RUN chmod +x /usr/local/bin/entrypoint-dev.sh

EXPOSE 3000

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

ENTRYPOINT ["/usr/local/bin/entrypoint-dev.sh"]
CMD ["npm", "run", "dev"]
