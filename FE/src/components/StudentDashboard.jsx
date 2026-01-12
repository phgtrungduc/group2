import { useState } from 'react';
import ScoreView from './ScoreView';
import TuitionView from './TuitionView';
import TeacherFeedback from './TeacherFeedback';

function StudentDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('scores');
  const studentId = user.id;

  const tabs = [
    { id: 'scores', label: 'Xem điểm' },
    { id: 'tuition', label: 'Học phí' },
    { id: 'feedback', label: 'Phản ánh giáo viên' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'scores':
        return <ScoreView studentId={studentId} />;
      case 'tuition':
        return <TuitionView studentId={studentId} />;
      case 'feedback':
        return <TeacherFeedback studentId={studentId} studentName={user.name} />;
      default:
        return <ScoreView studentId={studentId} />;
    }
  };

  return (
    <div className="dashboard student-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>University of Technology and Management</h1>
          <div className="user-info">
            <span>Xin chào, {user.name}</span>
            <button onClick={onLogout} className="logout-button">Đăng xuất</button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="main-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default StudentDashboard;

