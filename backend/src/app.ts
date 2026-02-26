// backend/src/app.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { registerRouter } from "./routes/register.routes";
import { studyPlanRouter } from "./routes/studyPlan.routes";
import { completedCourseRouter } from "./routes/completedCourse.routes";
import { summaryRouter } from "./routes/summary.routes";
import { demoRouter } from "./routes/demo.routes";
import usersRouter from "./routes/users";
import coursesRouter from "./routes/courses";
import enrollmentsRouter from "./routes/enrollments";

dotenv.config();

export const app = express();

// allow JSON body parsing
app.use(express.json());

// CORS - allow configurable frontend origin (and allow credentials if needed)
const FRONTEND = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
app.use(
  cors({
    origin: Array.isArray(process.env.FRONTEND_ORIGIN)
      ? (process.env.FRONTEND_ORIGIN as unknown as string[] )
      : FRONTEND,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

// sanity health
app.get("/health", (_, res) => res.json({ ok: true }));

// Mount routers (both forms for study plan to be resilient)
app.use("/api/study-plan", studyPlanRouter);
app.use("/api/studyplan", studyPlanRouter);

app.use("/api/completed-courses", completedCourseRouter);
app.use("/api/summary", summaryRouter);
app.use("/api/demo", demoRouter);

app.use("/api/users", usersRouter);
app.use("/api/register", registerRouter);
app.use("/api/courses", coursesRouter);
app.use("/api/enrollments", enrollmentsRouter);

// catch-all 404
app.use((req, res) => res.status(404).json({ error: "Not found" }));
