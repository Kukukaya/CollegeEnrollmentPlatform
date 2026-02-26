import { Request, Response } from 'express';
import * as service from '../services/usersService';
import { registerSchema, loginSchema } from '../utils/validation';
import { comparePassword, signToken } from '../utils/auth';

export async function register(req: Request, res: Response) {
  try {
    const parsed = registerSchema.parse(req.body);

    const existing = await service.findUserByEmail(parsed.email);
    if (existing) {
      return res.status(409).json({ error: "อีเมลนี้ถูกใช้แล้ว" });
    }

    const user = await service.createUser(parsed);
    res.status(201).json(user);

  } catch (err: any) {

    // กรณี Zod validation error
    if (err.errors && err.errors.length > 0) {
      return res.status(400).json({ error: err.errors[0].message });
    }

    res.status(400).json({ error: "ข้อมูลไม่ถูกต้อง" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const parsed = loginSchema.parse(req.body);

    const user = await service.findUserByEmail(parsed.email);
    if (!user) {
      return res.status(401).json({ error: "ยังไม่ได้สมัครสมาชิก" });
    }

    const ok = await comparePassword(parsed.password, (user as any).passwordHash);
    if (!ok) {
      return res.status(401).json({ error: "รหัสผ่านไม่ถูกต้อง" });
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    const safe = await service.getUserSafeById(user.id);

    res.json({ token, user: safe });

  } catch (err: any) {

    if (err.errors && err.errors.length > 0) {
      return res.status(400).json({ error: err.errors[0].message });
    }

    res.status(400).json({ error: "เข้าสู่ระบบไม่สำเร็จ" });
  }
}