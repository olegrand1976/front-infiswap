ARG NODE_VERSION=20.17.0

FROM node:${NODE_VERSION}-slim AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files to the working directory
COPY ./package.json ./
COPY ./package-lock.json ./

# Install dependencies using npm
RUN npm install

# Copy the rest of the application files to the working directory
COPY . ./

EXPOSE 3000

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

CMD [ "npm", "run", "dev" ]
