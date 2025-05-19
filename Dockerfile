FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json* pnpm-lock.yaml* .npmrc ./
RUN \
  if [ -f pnpm-lock.yaml ]; then \
    npm install -g pnpm && \
    SKIP_BUILD_ICONS=true pnpm i --no-frozen-lockfile; \
  elif [ -f package-lock.json ]; then \
    SKIP_BUILD_ICONS=true npm ci; \
  else \
    SKIP_BUILD_ICONS=true npm install; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy node modules and all source files
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Ensure the iconify directory exists and create placeholder files
RUN mkdir -p src/assets/iconify-icons
RUN echo "// This file is auto-generated\nimport './generated-icons.css';\nexport default {};" > src/assets/iconify-icons/bundle-icons-css.ts
RUN echo "/* Generated Iconify Icons CSS */\n.iconify { display: inline-block; width: 1em; height: 1em; }" > src/assets/iconify-icons/generated-icons.css

# Create a script to handle environment-based build
RUN echo '#!/bin/sh\n\
if [ "$ENVIRONMENT" = "dev" ]; then\n\
  echo "Running in development mode"\n\
  npm run dev\n\
else\n\
  echo "Running in production mode"\n\
  npm run build:no-lint\n\
fi' > /app/start.sh && chmod +x /app/start.sh

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy full app directory including src and node_modules
COPY --from=builder --chown=nextjs:nodejs /app .

# If in production, copy the standalone build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

# Use the start script to determine the run mode
CMD ["/app/start.sh"]
