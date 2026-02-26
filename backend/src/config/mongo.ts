// backend/src/config/mongo.ts
import mongoose from "mongoose";

export async function connectMongo(uri: string) {
  try {
    await mongoose.connect(uri, {
      // use the unified topology and new parser options (mongoose default)
      // options can be extended here if needed
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
}
