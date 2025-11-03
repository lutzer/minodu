# Étape de construction
FROM node:18-alpine AS builder

WORKDIR /app

# copy files --- fix later
COPY ./minodu_backend ./

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Étape d'exécuti
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/temp ./temp


ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "dist/main.js"]