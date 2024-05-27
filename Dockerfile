# Building stage - 1
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./

# Ensure both package.json and package-lock.json are present
RUN if [ -f package-lock.json ]; then npm ci --legacy-peer-deps; else npm install; fi

COPY . .

RUN npm run build

# stage 2 as runner
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

ENV NODE_ENV=production

# Ensure both package.json and package-lock.json are present
RUN if [ -f package-lock.json ]; then npm ci --legacy-peer-deps; else npm install; fi

COPY --from=builder /app/dist ./dist

RUN chown -R node:node /app && chmod -R 755 /app

RUN npm install pm2 -g

COPY ecosystem.config.js .

USER node

EXPOSE 4000

CMD ["pm2-runtime", "start", "ecosystem.config.js"]