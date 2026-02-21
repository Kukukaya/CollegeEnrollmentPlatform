import express from "express";
import dotenv from "dotenv";
import { studyPlanRouter } from "./routes/studyPlan.routes";
import { completedCourseRouter } from "./routes/completedCourse.routes";
import { summaryRouter } from "./routes/summary.routes";
import { demoRouter } from "./routes/demo.routes";
import cors from "cors";
dotenv.config();

export const app = express();
app.use(express.json());
app.use(cors()); 
app.get("/health", (_, res) => res.json({ ok: true }));

app.use("/api/study-plan", studyPlanRouter);
app.use("/api/completed-courses", completedCourseRouter);
app.use("/api/summary", summaryRouter);
app.use("/api/demo", demoRouter);
