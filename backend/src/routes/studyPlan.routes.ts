import { Router, Request, Response } from "express";
import { z } from "zod";
import { StudyPlanModel } from "../models/StudyPlan";

export const studyPlanRouter = Router();

const categorySchema = z.object({
  name: z.string().min(1),
  requiredCredits: z.number().nonnegative()
});

const planSchema = z.object({
  studentId: z.string().min(1),
  program: z.string().min(1),
  version: z.string().min(1),
  categories: z.array(categorySchema).default([])
});

studyPlanRouter.post("/", async (req: Request, res: Response) => {
  const parsed = planSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error);
  }

  try {
    const existing = await StudyPlanModel.findOne({
      studentId: parsed.data.studentId
    });

    if (existing) {
      existing.program = parsed.data.program;
      existing.version = parsed.data.version;
      existing.categories = parsed.data.categories;
      existing.isDeleted = false;

      await existing.save();
      return res.json(existing);
    }

    const created = await StudyPlanModel.create({
      ...parsed.data,
      isDeleted: false
    });

    return res.status(201).json(created);

  } catch (err: any) {
    console.error("Create/Update error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

studyPlanRouter.put("/:id", async (req: Request, res: Response) => {
  const parsed = planSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error);
  }

  try {
    const updated = await StudyPlanModel.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { $set: parsed.data },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Study plan not found" });
    }

    return res.json(updated);

  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

studyPlanRouter.post(
  "/:studentId/category",
  async (req: Request, res: Response) => {
    const parsed = categorySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }

    try {
      const updated = await StudyPlanModel.findOneAndUpdate(
        { studentId: req.params.studentId, isDeleted: false },
        { $push: { categories: parsed.data } },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ message: "Study plan not found" });
      }

      return res.json(updated);

    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }
);

studyPlanRouter.delete(
  "/:studentId/category/:categoryId",
  async (req: Request, res: Response) => {
    try {
      const { studentId, categoryId } = req.params;

      const updated = await StudyPlanModel.findOneAndUpdate(
        { studentId, isDeleted: false },
        { $pull: { categories: { _id: categoryId } } },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ message: "Study plan not found" });
      }

      return res.json({
        message: "Category deleted",
        categoryId
      });

    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }
);


studyPlanRouter.delete(
  "/student/:studentId",
  async (req: Request, res: Response) => {
    try {
      const updated = await StudyPlanModel.findOneAndUpdate(
        {
          studentId: req.params.studentId,
          isDeleted: false
        },
        {
          $set: { isDeleted: true }
        },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ message: "Study plan not found" });
      }

      return res.json({
        message: "Study plan soft deleted",
        studentId: req.params.studentId
      });

    } catch (err: any) {
      console.error("Soft delete error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

studyPlanRouter.get("/:studentId", async (req: Request, res: Response) => {
  try {
    const doc = await StudyPlanModel.findOne({
      studentId: req.params.studentId,
      isDeleted: false
    }).lean();

    if (!doc) {
      return res.status(404).json({ message: "Study plan not found" });
    }

    return res.json(doc);

  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});
