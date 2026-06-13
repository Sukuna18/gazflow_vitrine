FROM node:22-alpine AS app

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm prisma generate && pnpm build

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV UPLOAD_DIR=/app/public/uploads/products
ENV PUBLIC_UPLOAD_PATH=/uploads/products

RUN mkdir -p /app/public/uploads/products

EXPOSE 3000

CMD ["pnpm", "start"]
