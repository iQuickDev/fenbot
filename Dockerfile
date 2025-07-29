FROM node:alpine AS base
WORKDIR /app

FROM base AS prod-deps
# Copy only manifests first to maximize cache hits
COPY package*.json ./
# If you use a private registry, also COPY .npmrc ./
RUN --mount=type=cache,id=npm-cache,target=/root/.npm \
    npm ci --omit=dev

# --- Build stage ---
FROM base AS build
COPY package*.json ./
# If you use a private registry, also COPY .npmrc ./
RUN --mount=type=cache,id=npm-cache,target=/root/.npm \
    npm ci
# Now bring in the rest of the source and build
COPY . .
RUN npm run build

# --- Runtime image ---
FROM node:alpine
WORKDIR /app
ENV NODE_ENV=production

# Install curl for health checks (optional)
RUN apk add --no-cache curl

# Bring in runtime deps and build output
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
# Keep package.json so `npm start` works
COPY package*.json ./

CMD ["npm", "start"]
