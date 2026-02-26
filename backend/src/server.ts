// backend/src/server.ts
import dotenv from "dotenv";
import { app } from "./app";
import { connectMongo } from "./config/mongo";

dotenv.config();

const PORT = Number(process.env.PORT ?? 3000);
const MONGO_URI = process.env.MONGO_URI!;

async function main() {
  // connect to Mongo Atlas (or local) first
  await connectMongo(MONGO_URI);

  app.listen(PORT, () => {
    console.log(`✅ API on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error("❌ Server error:", err);
  process.exit(1);
});
