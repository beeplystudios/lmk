FROM oven/bun:1.2.23

WORKDIR /app
COPY . .

# add busybox for sh command
RUN apt update && apt install -y busybox

RUN bun install --production

EXPOSE 3000
ENV NODE_ENV=production
ENV DO_INGEST=true

CMD ["sh", "-c", "cd server && bun run start"]