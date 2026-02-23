import React, { useEffect, useMemo, useState } from "react";
import { MYSQL_API } from "../config";
import { GraduationCap, Leaf, PieChart } from "lucide-react";

type Summary = {
  totalCourses: number;
  totalCredits: number;
  byCategory: Record<string, { courses: number; credits: number }>;
};

type Course = {
  id: number;
  code: string;
  name: string;
  category: string;
  credits: number;
  isDeleted: boolean;
};

const TOTAL_REQUIRED_CREDITS = 120;

// กำหนดลำดับหมวดให้สวย + คุมชื่อหมวดที่อยากให้โชว์
const CATEGORY_ORDER = ["Core", "Major", "GenEd", "Free"];
const CATEGORY_LABEL: Record<string, string> = {
  Core: "Core",
  Major: "Major",
  GenEd: "GenEd",
  Free: "Free",
};

export default function Dashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string>("");

  // --- Add Course form ---
  const [form, setForm] = useState({
    code: "",
    name: "",
    category: "Major",
    credits: 3,
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string>("");

  async function refreshSummary() {
    const res = await fetch(`${MYSQL_API}/api/curriculum-progress`);
    if (!res.ok) throw new Error(`Summary HTTP ${res.status}`);
    const data = await res.json();
    setSummary(data);
  }

  async function refreshCourses() {
    const res = await fetch(`${MYSQL_API}/api/courses`);
    if (!res.ok) throw new Error(`Courses HTTP ${res.status}`);
    const data = await res.json();
    setCourses(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    // โหลด summary + courses พร้อมกัน
    Promise.all([refreshSummary(), refreshCourses()]).catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const progress = useMemo(() => {
    const credits = summary?.totalCredits ?? 0;
    const percent = Math.min(100, Math.round((credits / TOTAL_REQUIRED_CREDITS) * 100));
    const remaining = Math.max(0, TOTAL_REQUIRED_CREDITS - credits);
    return { credits, percent, remaining };
  }, [summary]);

  // หมวดที่โชว์ใน UI: เอาเฉพาะ 4 หมวดหลัก + เรียงตาม CATEGORY_ORDER
  const categories = useMemo(() => {
    const by = summary?.byCategory ?? {};
    return CATEGORY_ORDER.map((k) => [k, by[k] ?? { courses: 0, credits: 0 }] as const);
  }, [summary]);

  const majorCourses = useMemo(() => {
    return courses
      .filter((c) => !c.isDeleted && c.category === "Major")
      .sort((a, b) => a.code.localeCompare(b.code));
  }, [courses]);

  async function handleAddCourse(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setSaving(true);

    try {
      const res = await fetch(`${MYSQL_API}/api/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code.trim(),
          name: form.name.trim(),
          category: form.category,
          credits: Number(form.credits),
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Add course failed: HTTP ${res.status} ${text}`);
      }

      setMsg("✅ เพิ่มวิชาเรียบร้อย");
      setForm({ code: "", name: "", category: "Major", credits: 3 });

      // รีเฟรช summary + รายวิชา
      await Promise.all([refreshSummary(), refreshCourses()]);
    } catch (err: any) {
      setMsg(`❌ ${err.message ?? String(err)}`);
    } finally {
      setSaving(false);
    }
  }

  if (error) {
    return (
      <div className="container">
        <div className="card">
          <h2>เกิดข้อผิดพลาด</h2>
          <div className="small">{error}</div>
          <div className="small">เช็คว่า MySQL API เปิดอยู่ที่ {MYSQL_API} และ backend เปิด CORS แล้ว</div>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="container">
        <div className="card">
          <h2>Loading...</h2>
          <div className="small">กำลังดึงข้อมูลจากระบบ</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <div className="brand">
          <Leaf size={28} />
          <div>
            <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-0.02em" }}>KU Credit System</div>
            <div className="small">Dashboard สรุปหน่วยกิต (Demo)</div>
          </div>
        </div>
        <div className="badge">MySQL API: {MYSQL_API}</div>
      </div>

      {/* Top grid */}
      <div className="grid">
        <div className="card">
          <h2>Progress to Graduation</h2>

          <div className="kpi">
            <div className="kpiBox">
              <div className="kpiValue">{summary.totalCredits}</div>
              <div className="kpiLabel">Total Credits (สะสม)</div>
            </div>
            <div className="kpiBox">
              <div className="kpiValue">{summary.totalCourses}</div>
              <div className="kpiLabel">Total Courses (วิชาที่มีข้อมูล)</div>
            </div>
          </div>

          <div className="progressWrap">
            <div className="progressRow">
              <span>
                {progress.credits} / {TOTAL_REQUIRED_CREDITS} credits
              </span>
              <span>{progress.percent}%</span>
            </div>

            <div className="progressBar" aria-label="progress bar">
              <div className="progressFill" style={{ width: `${progress.percent}%` }} />
            </div>

            <div className="small" style={{ marginTop: 10 }}>
              เหลืออีกประมาณ <b>{progress.remaining}</b> หน่วยกิตเพื่อครบ {TOTAL_REQUIRED_CREDITS} หน่วยกิต (สมมติ)
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Quick Summary</h2>
          <div className="small" style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <GraduationCap size={18} />
            ระบบนี้เป็นเดโมเพื่อแสดงการใช้งานฐานข้อมูล + การคำนวณสรุปผล
          </div>
          <div className="small" style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center" }}>
            <PieChart size={18} />
            แยกตามหมวด (Core / Major / GenEd / Free) จากข้อมูลใน MySQL
          </div>

          <div className="small" style={{ marginTop: 14 }}>
            Tip: เพิ่มวิชาหรือแก้ credits แล้วกลับมาหน้านี้ จะเห็น progress เปลี่ยนทันที
          </div>
        </div>
      </div>

      <div style={{ height: 14 }} />

      {/* Categories */}
      <div className="card">
        <h2>Credits by Category</h2>

        <div className="pills">
          {categories.map(([name, v]) => {
            const pct = Math.min(100, Math.round((v.credits / TOTAL_REQUIRED_CREDITS) * 100));
            return (
              <div className="pill" key={name}>
                <div className="pillTop">
                  <div className="pillName">{CATEGORY_LABEL[name] ?? name}</div>
                  <div className="pillMeta">{v.courses} courses</div>
                </div>

                <div style={{ fontSize: 24, fontWeight: 900 }}>{v.credits} credits</div>

                <div className="progressWrap" style={{ marginTop: 10 }}>
                  <div className="progressBar">
                    <div className="progressFill" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="small" style={{ marginTop: 8 }}>
                    คิดเป็น {pct}% ของ 120 หน่วยกิต
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ height: 14 }} />

      {/* Major course list */}
      <div className="card">
        <h2>Major Courses</h2>
        <div className="small" style={{ marginBottom: 10 }}>
          แสดงเฉพาะวิชาที่ category = <b>Major</b>
        </div>

        {majorCourses.length === 0 ? (
          <div className="small">ยังไม่มีวิชา Major</div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {majorCourses.map((c) => (
              <div
                key={c.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: 12,
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(0,0,0,0.18)",
                }}
              >
                <div>
                  <div style={{ fontWeight: 800 }}>{c.code} — {c.name}</div>
                  <div className="small">Category: {c.category}</div>
                </div>
                <div style={{ fontWeight: 900 }}>{c.credits} cr</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ height: 14 }} />

      {/* Add course */}
      <div className="card">
        <h2>Add Course (MySQL)</h2>

        <form onSubmit={handleAddCourse} style={{ display: "grid", gap: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <input
              placeholder="Code เช่น CS300"
              value={form.code}
              onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))}
              style={inputStyle}
              required
            />
            <input
              placeholder="ชื่อวิชา เช่น AI"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              style={inputStyle}
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <select
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              style={inputStyle}
            >
              <option value="Core">Core</option>
              <option value="Major">Major</option>
              <option value="GenEd">GenEd</option>
              <option value="Free">Free</option>
            </select>

            <input
              type="number"
              min={1}
              max={10}
              value={form.credits}
              onChange={(e) => setForm((p) => ({ ...p, credits: Number(e.target.value) }))}
              style={inputStyle}
            />
          </div>

          <button type="submit" disabled={saving} style={btnStyle}>
            {saving ? "Adding..." : "Add Course"}
          </button>

          {msg && <div className="small">{msg}</div>}
        </form>
      </div>

      <div className="small" style={{ marginTop: 14, textAlign: "center" }}>
        © Demo KU Credit System — Frontend (React) + Backend (MySQL/Mongo)
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.10)",
  outline: "none",
  background: "rgba(0,0,0,0.18)",
  color: "white",
};

const btnStyle: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "linear-gradient(90deg, rgba(0,122,51,0.9), rgba(0,160,70,0.9))",
  color: "white",
  fontWeight: 900,
  cursor: "pointer",
};