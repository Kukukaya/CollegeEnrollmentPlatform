import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, "กรุณากรอกชื่อผู้ใช้"),   
  password: z
    .string()
    .min(1, "กรุณากรอกรหัสผ่าน"),
  fullName: z
    .string()
    .min(1, "กรุณากรอกชื่อ")
    .optional()
});

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "กรุณากรอกชื่อผู้ใช้"),
  password: z
    .string()
    .min(1, "กรุณากรอกรหัสผ่าน")
});