import React from 'react';

export default function Remaining({ summary }) {
  const categoriesList = summary?.categories || [];
  const notDone = categoriesList.filter(c => !c.completed);

  return (
    <section className="card">
      <h2>ดูสิ่งที่เหลือ (Remaining)</h2>
      <p className="sub">แสดงหมวดยังไม่ครบ + หน่วยกิตที่ต้องเพิ่ม</p>

      <div id="remainingBox">
        {categoriesList.length === 0 ? (
          <div className="card" style={{ boxShadow: 'none', textAlign: 'center', color: 'var(--muted)' }}>
            <b>ยังไม่มีข้อมูล กรุณาสร้าง Study Plan ก่อน</b>
          </div>
        ) : notDone.length === 0 ? (
          <div className="card" style={{ boxShadow: 'none', background: 'linear-gradient(180deg, rgba(0,106,78,.08), #fff)' }}>
            <b>ครบตามแผนทุกหมวดแล้ว 🎉</b>
          </div>
        ) : (
          notDone.map((c, idx) => (
            <div key={idx} className="card" style={{ boxShadow: 'none', marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', alignItems: 'center' }}>
                <div><b>{c.category}</b><div className="mini">ได้ {c.earned} / ต้อง {c.required}</div></div>
                <span className="pill warn">เหลือ {c.remaining} หน่วยกิต</span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
