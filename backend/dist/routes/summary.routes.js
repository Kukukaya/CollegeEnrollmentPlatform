"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.summaryRouter = void 0;
const express_1 = require("express");
const summary_service_1 = require("../services/summary.service");
exports.summaryRouter = (0, express_1.Router)();
exports.summaryRouter.get("/:studentId", async (req, res) => {
    const summary = await (0, summary_service_1.buildSummary)(req.params.studentId);
    res.json(summary);
});
