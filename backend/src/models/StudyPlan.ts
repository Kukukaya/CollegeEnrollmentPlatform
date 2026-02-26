import { Schema, model, Document } from "mongoose";

export interface Category {
  name: string;
  requiredCredits: number;
}

export interface StudyPlan extends Document {
  studentId: string;
  program: string;
  version: string;
  categories: Category[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<Category>(
  {
    name: { type: String, required: true },
    requiredCredits: { type: Number, required: true }
  },
  { _id: true }
);

const StudyPlanSchema = new Schema<StudyPlan>(
  {
    studentId: { type: String, required: true, unique: true, index: true },
    program: { type: String, required: true },
    version: { type: String, required: true },
    categories: { type: [CategorySchema], default: [] },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const StudyPlanModel = model<StudyPlan>(
  "study_plans",
  StudyPlanSchema
);
