import React from 'react';

export default function Dashboard({ summary }) {
  const categoriesList = summary?.categories || [];
  const totalEarned = summary?.totalCredits || 0;
  
  let totalRequired = 0;
  let remainingTotal = 0;

  categoriesList.forEach(c => {
    totalRequired += c.required;
    remainingTotal += c.remaining;
  });

  const pct = totalRequired === 0 ? 0 : Math.min(100, Math.round((totalEarned / totalRequired) * 100));
  const isSetup = categoriesList.length > 0;

  return (
    <section className="card">
      <h2>Dashboard — ภาพรวมหน่วยกิต</h2>
      <p className="sub">สรุปหน่วยกิตสะสม (ประมวลผลผ่าน API MongoDB)</p>

      <div className="stats">
        <div className="stat">
          <div className="label">หน่วยกิตสะสม (Earned)</div>
          <div className="value">{totalEarned}</div>
          <div className="hint">คำนวณจาก completed courses</div>
        </div>
        <div className="stat">
          <div className="label">หน่วยกิตที่ต้องครบ (Required)</div>
          <div className="value">{totalRequired}</div>
          <div className="hint">มาจาก Study Plan</div>
        </div>
        <div className="stat">
          <div className="label">หน่วยกิตที่เหลือ (Remaining)</div>
          <div className="value">{remainingTotal}</div>
          <div className="hint">Required - Earned (ตามหมวด)</div>
        </div>
      </div>

      <div className="progress-wrap">
        <div className="progress-top">
          <div>
            <div className="title">ความคืบหน้ารวม</div>
            <div className="mini"><span>{pct}</span>% ของเป้าหมาย</div>
          </div>
          <span className={!isSetup ? "pill warn" : (pct >= 100 ? "pill" : "pill warn")}>
            {!isSetup ? "โปรดสร้าง Study Plan ก่อน" : (pct >= 100 ? "ครบตามแผนแล้ว 🎉" : "กำลังดำเนินการ")}
          </span>
        </div>
        <div className="progress" aria-label="progress bar">
          <div className="bar" style={{ width: `${pct}%` }}></div>
        </div>

        <div className="cat-grid">
          {categoriesList.map((cat, idx) => (
            <div className="cat" key={idx}>
              <div className="row">
                <div>
                  <div style={{ fontWeight: 900 }}>{cat.category}</div>
                  <div className="mini">ได้ {cat.earned} / ต้อง {cat.required}</div>
                </div>
                {cat.completed ? <span className="pill">ครบแล้ว</span> : <span className="pill warn">เหลือ {cat.remaining}</span>}
              </div>
              <div className="progress" style={{ height: '10px' }}>
                <div className="bar" style={{ width: `${cat.required === 0 ? 0 : Math.min(100, Math.round((cat.earned / cat.required) * 100))}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
