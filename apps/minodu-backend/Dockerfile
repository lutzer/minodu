# Étape de construction
FROM node:18-alpine AS builder

WORKDIR /app

# copy files
COPY . .

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

# Étape d'exécution
FROM node:18-alpine

RUN apt-get update -y && apt upgrade -y && apt-get clean -y
RUN apt-get install curl -y

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist/src ./dist

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "dist/main.js"]