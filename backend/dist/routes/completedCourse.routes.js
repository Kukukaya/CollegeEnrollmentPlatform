"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.completedCourseRouter = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const CompletedCourse_1 = require("../models/CompletedCourse");
exports.completedCourseRouter = (0, express_1.Router)();
const addSchema = zod_1.z.object({
    studentId: zod_1.z.string().min(1),
    courseId: zod_1.z.string().min(1),
    courseName: zod_1.z.string().min(1),
    category: zod_1.z.string().min(1),
    credits: zod_1.z.number().positive(),
    grade: zod_1.z.string().min(1),
    term: zod_1.z.string().min(1)
});
// ADD completed course
exports.completedCourseRouter.post("/", async (req, res) => {
    const parsed = addSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json(parsed.error);
    const doc = await CompletedCourse_1.CompletedCourseModel.create(parsed.data);
    res.status(201).json(doc);
});
// Update grade
exports.completedCourseRouter.put("/:id/grade", async (req, res) => {
    const parsed = zod_1.z.object({ grade: zod_1.z.string().min(1) }).safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json(parsed.error);
    const updated = await CompletedCourse_1.CompletedCourseModel.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { $set: { grade: parsed.data.grade } }, { new: true });
    if (!updated)
        return res.status(404).json({ message: "Completed course not found" });
    res.json(updated);
});
// Soft delete
exports.completedCourseRouter.delete("/:id", async (req, res) => {
    const updated = await CompletedCourse_1.CompletedCourseModel.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { $set: { isDeleted: true } }, { new: true });
    if (!updated)
        return res.status(404).json({ message: "Completed course not found" });
    res.json({ message: "Deleted (soft)", id: req.params.id });
});
// (ช่วยเดโม) list ของ student
exports.completedCourseRouter.get("/by-student/:studentId", async (req, res) => {
    const docs = await CompletedCourse_1.CompletedCourseModel.find({
        studentId: req.params.studentId,
        isDeleted: false
    }).lean();
    res.json(docs);
});
