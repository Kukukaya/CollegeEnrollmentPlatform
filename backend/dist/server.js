"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = require("./app");
const mongo_1 = require("./config/mongo");
dotenv_1.default.config();
const PORT = Number(process.env.PORT || 8080);
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ku_credit_demo";
async function main() {
    await (0, mongo_1.connectMongo)(MONGO_URI);
    app_1.app.listen(PORT, () => console.log(`✅ API on http://localhost:${PORT}`));
}
main().catch(err => {
    console.error("❌ Server error:", err);
    process.exit(1);
});
