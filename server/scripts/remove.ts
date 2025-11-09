import { db } from "@/src/db";
import { lmk, post } from "@/src/db/schema";
import { INDEX_NAME, pc } from "@/src/pinecone";
import chalk from "chalk";
import { eq } from "drizzle-orm";

console.log(
  chalk.blue(
    "notify-example: this script is used to remove a record (post/lmk) from pinecone + postgresql"
  )
);

const recordType = Bun.argv[2];
if (recordType !== "post" && recordType !== "lmk") {
  console.error(
    `notify-example: invalid record type "${recordType}", must be "post" or "lmk"`
  );
  process.exit(1);
}

const recordId = Bun.argv[3];
if (!recordId) {
  console.error(`notify-example: must provide record id as second argument`);
  process.exit(1);
}

if (recordType === "post") {
  await db.transaction(async (tx) => {
    await pc.index(INDEX_NAME).namespace("posts").deleteMany([recordId]);
    await tx.delete(post).where(eq(post.id, recordId));
    console.log(
      chalk.green(
        `notify-example: removed post with id=${recordId} from postgresql and pinecone!`
      )
    );
  });
} else if (recordType === "lmk") {
  await db.transaction(async (tx) => {
    await pc.index(INDEX_NAME).namespace("lmks").deleteMany([recordId]);
    await tx.delete(lmk).where(eq(lmk.id, recordId));
    console.log(
      chalk.green(
        `notify-example: removed lmk with id=${recordId} from postgresql and pinecone!`
      )
    );
  });
}

process.exit(0);
