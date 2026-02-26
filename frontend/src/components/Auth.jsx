import React, { useState } from 'react';
import { API_BASE } from '../App';

export default function Auth({ setStudentId }) {
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const toggleAuthMode = () => {
    setAuthMode(prev => prev === 'login' ? 'register' : 'login');
  };

  const handleAuthAction = async () => {
    if (authMode === 'login') await doLogin();
    else await doRegister();
  };

  const demoLogin = async () => {
    setEmail("S001");
    setPassword("demo");
    try {
      await fetch(`${API_BASE}/demo/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: "S001" })
      });
    } catch (err) { console.warn("Demo reset API warning:", err); }

    const cleanId = "S001";
    localStorage.setItem("studentId", cleanId);
    setStudentId(cleanId);
  };

  const doLogin = async () => {
  if (!email || !password) 
    return alert("กรุณากรอกอีเมลและรหัสผ่าน");

  const cleanId = email.includes('@')
    ? email.split('@')[0].toUpperCase()
    : email.toUpperCase();

  try {
    const res = await fetch(`${API_BASE}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: cleanId, password })
    });

    if (!res.ok) {
      alert("ยังไม่ได้สมัครสมาชิก หรือ รหัสผ่านไม่ถูกต้อง");
      return;  
    }

    localStorage.setItem("studentId", cleanId);
    setStudentId(cleanId);

  } catch (e) {
    alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
  }
};


  const doRegister = async () => {
  if (!email || !password) {
    return alert("กรุณากรอกอีเมลและรหัสผ่าน");
  }

  try {
    const res = await fetch(`${API_BASE}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    const data = await res.json();

    if (!res.ok) {
      return alert(data.error || "สมัครสมาชิกไม่สำเร็จ");
    }

    alert("สมัครสมาชิกสำเร็จ กรุณาเข้าสู่ระบบ");
    setAuthMode("login");

  } catch (err) {
    alert("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
  }
};

  return (
    <section className="auth-wrap">
      <div className="hero">
        <h2>ยินดีต้อนรับสู่ KU Credit Tracker</h2>
        <p>เว็บสำหรับติดตามหน่วยกิตและเช็คว่า “เรียนอะไรแล้ว / เหลืออะไร” เชื่อมต่อกับ Backend อัตโนมัติ</p>
        <ul>
          <li>Dashboard สรุปหน่วยกิต + progress bar (จากข้อมูลจริง)</li>
          <li>จัดการรายวิชาและหน่วยกิตตามโครงสร้างหลักสูตร</li>
          <li>เชื่อมต่อ API Backend 100%</li>
        </ul>
        <div className="toggle">
          <button className="btn" onClick={demoLogin}>Login (Demo Data Account)</button>
        </div>
      </div>

      <div className="card">
        <h2>{authMode === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}</h2>
        <p className="sub">จัดการแผนการเรียนและหน่วยกิตของคุณ</p>

        <div className="grid-2">
          <div>
            <label>อีเมล หรือ รหัสนิสิต</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="เช่น s65xxxxxx@ku.th" />
          </div>
          <div>
            <label>รหัสผ่าน</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
        </div>

        <div className="form-actions">
          <button className="btn" onClick={handleAuthAction}>
            {authMode === 'login' ? 'เข้าสู่ระบบ' : 'ยืนยันการสมัคร'}
          </button>
          <button className="btn ghost" onClick={toggleAuthMode}>
            {authMode === 'login' ? 'สมัครสมาชิก' : 'กลับไปเข้าสู่ระบบ'}
          </button>
        </div>
      </div>
    </section>
  );
}
