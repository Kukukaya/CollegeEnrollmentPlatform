import { Request, Response } from "express";

interface User {
  username: string;
  password: string;
}

const users: User[] = [];

export const registerUser = (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "กรอกข้อมูลไม่ครบ" });
  }

  const exist = users.find(u => u.username === username);
  if (exist) {
    return res.status(409).json({ message: "Username นี้ถูกใช้แล้ว" });
  }

  users.push({ username, password });

  return res.status(201).json({ message: "สมัครสมาชิกสำเร็จ" });
};

export const loginUser = (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Username หรือ Password ไม่ถูกต้อง" });
  }

  return res.json({ message: "เข้าสู่ระบบสำเร็จ" });
};
