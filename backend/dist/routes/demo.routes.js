"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.demoRouter = void 0;
const express_1 = require("express");
const StudyPlan_1 = require("../models/StudyPlan");
const CompletedCourse_1 = require("../models/CompletedCourse");
exports.demoRouter = (0, express_1.Router)();
/**
 * POST /api/demo/reset
 * body: { studentId?: "S001" }
 */
exports.demoRouter.post("/reset", async (req, res) => {
    const studentId = (req.body?.studentId || "S001");
    await StudyPlan_1.StudyPlanModel.deleteMany({ studentId });
    await CompletedCourse_1.CompletedCourseModel.deleteMany({ studentId });
    const plan = await StudyPlan_1.StudyPlanModel.create({
        studentId,
        program: "Computer Science",
        version: "2026",
        categories: [
            { name: "Core", requiredCredits: 30 },
            { name: "Major", requiredCredits: 45 },
            { name: "Free", requiredCredits: 6 }
        ],
        isDeleted: false
    });
    const courses = await CompletedCourse_1.CompletedCourseModel.insertMany([
        {
            studentId,
            courseId: "CS101",
            courseName: "Programming I",
            category: "Core",
            credits: 3,
            grade: "A",
            term: "1/2026",
            isDeleted: false
        },
        {
            studentId,
            courseId: "CS201",
            courseName: "Data Structures",
            category: "Major",
            credits: 3,
            grade: "B+",
            term: "1/2026",
            isDeleted: false
        }
    ]);
    res.json({ message: "Demo reset done", plan, coursesCount: courses.length });
});
