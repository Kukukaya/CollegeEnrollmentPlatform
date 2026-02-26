import React from 'react';

export default function Sidebar({ studentId, version, currentView, setCurrentView, doLogout }) {
  return (
    <aside className="sidebar">
      <div className="profile">
        <div className="name">นิสิต: <span>{studentId}</span></div>
        <div className="meta">หลักสูตร <span>{version}</span></div>
      </div>

      <div className="nav">
        <button className={currentView === 'dashboard' ? 'active' : ''} onClick={() => setCurrentView('dashboard')}>
          Dashboard <small>สรุปหน่วยกิต</small>
        </button>
        <button className={currentView === 'addCourse' ? 'active' : ''} onClick={() => setCurrentView('addCourse')}>
          เพิ่มวิชาที่เรียน <small>Completed</small>
        </button>
        <button className={currentView === 'remaining' ? 'active' : ''} onClick={() => setCurrentView('remaining')}>
          ดูวิชาที่เหลือ <small>Remaining</small>
        </button>
        <button className={currentView === 'studyPlan' ? 'active' : ''} onClick={() => setCurrentView('studyPlan')}>
          จัดการ Study Plan <small>CRUD</small>
        </button>
      </div>

      <div style={{ marginTop: '12px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button className="btn danger" onClick={doLogout}>ออกจากระบบ</button>
      </div>
    </aside>
  );
}
