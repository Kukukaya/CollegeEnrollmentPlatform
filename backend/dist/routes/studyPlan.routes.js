"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studyPlanRouter = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const StudyPlan_1 = require("../models/StudyPlan");
exports.studyPlanRouter = (0, express_1.Router)();
const planSchema = zod_1.z.object({
    studentId: zod_1.z.string().min(1),
    program: zod_1.z.string().min(1),
    version: zod_1.z.string().min(1),
    categories: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string().min(1),
        requiredCredits: zod_1.z.number().nonnegative()
    })).default([])
});
// CREATE
exports.studyPlanRouter.post("/", async (req, res) => {
    const parsed = planSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json(parsed.error);
    // demo: 1 student มีได้ 1 plan (ถ้ามีอยู่แล้วให้ update แทน)
    const upserted = await StudyPlan_1.StudyPlanModel.findOneAndUpdate({ studentId: parsed.data.studentId }, { $set: { ...parsed.data, isDeleted: false } }, { upsert: true, new: true });
    res.status(201).json(upserted);
});
// READ by studentId
exports.studyPlanRouter.get("/:studentId", async (req, res) => {
    const doc = await StudyPlan_1.StudyPlanModel.findOne({
        studentId: req.params.studentId,
        isDeleted: false
    }).lean();
    if (!doc)
        return res.status(404).json({ message: "Study plan not found" });
    res.json(doc);
});
// UPDATE by id
exports.studyPlanRouter.put("/:id", async (req, res) => {
    const parsed = planSchema.partial().safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json(parsed.error);
    const updated = await StudyPlan_1.StudyPlanModel.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { $set: parsed.data }, { new: true });
    if (!updated)
        return res.status(404).json({ message: "Study plan not found" });
    res.json(updated);
});
// SOFT DELETE by id
exports.studyPlanRouter.delete("/:id", async (req, res) => {
    const updated = await StudyPlan_1.StudyPlanModel.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { $set: { isDeleted: true } }, { new: true });
    if (!updated)
        return res.status(404).json({ message: "Study plan not found" });
    res.json({ message: "Deleted (soft)", id: req.params.id });
});
