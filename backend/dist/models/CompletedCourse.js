"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompletedCourseModel = void 0;
const mongoose_1 = require("mongoose");
const CompletedCourseSchema = new mongoose_1.Schema({
    studentId: { type: String, required: true, index: true },
    courseId: { type: String, required: true },
    courseName: { type: String, required: true },
    category: { type: String, required: true }, // ต้องตรงกับ plan.categories.name
    credits: { type: Number, required: true },
    grade: { type: String, required: true },
    term: { type: String, required: true },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });
exports.CompletedCourseModel = (0, mongoose_1.model)("completed_courses", CompletedCourseSchema);
