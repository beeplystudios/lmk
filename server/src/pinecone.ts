import { Pinecone } from "@pinecone-database/pinecone";

const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
if (!PINECONE_API_KEY) throw "process.env.PINECONE_API_KEY is not set";

export const pc = new Pinecone({
  apiKey: PINECONE_API_KEY,
});

const INDEX_NAME = process.env.PINECONE_INDEX_NAME;
if (!INDEX_NAME) throw "process.env.PINECONE_INDEX_NAME is not set";

const index = await pc
  .listIndexes()
  .then((r) => r.indexes?.find((idx) => idx.name === INDEX_NAME));

if (!index) {
  console.log(`[pinecone] index "${INDEX_NAME}" not found. creating it...`);
  await pc.createIndexForModel({
    name: INDEX_NAME,
    cloud: "aws",
    region: "us-east-1",
    embed: {
      model: "llama-text-embed-v2",
      fieldMap: { text: "embed" },
    },
    waitUntilReady: true,
  });
  console.log(
    `[pinecone] index "${INDEX_NAME}" created because it does not exist`
  );
} else {
  const stat = await pc.index(index.name).describeIndexStats();
  console.log(
    `[pinecone] index "${INDEX_NAME}" found. #records=${stat.totalRecordCount}`
  );
}
