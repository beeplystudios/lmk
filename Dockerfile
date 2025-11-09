FROM oven/bun:1.2.23

WORKDIR /app
COPY . .

RUN bun install --production

EXPOSE 3000
ENV NODE_ENV=production
ENV DO_INGEST=true

CMD ["cd", "server", "&&", "bun", "run", "start"]