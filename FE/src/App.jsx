import { useState, useEffect } from 'react';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { loadData } from './utils/dataService';
import './App.css';

function AppContent() {
  const { user, logout, loading: authLoading } = useAuth();
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      await loadData();
      setDataLoading(false);
    };
    initializeApp();
  }, []);

  if (authLoading || dataLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#667eea'
      }}>
        Đang tải dữ liệu...
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  // role: 1=admin, 2=student, 3=teacher
  if (user.role === 1) {
    // Admin thì hiển thị tất cả - có thể chọn view student hoặc teacher
    return (
      <div>
        <div style={{ padding: '20px', borderBottom: '1px solid #ddd' }}>
          <h2>Admin Dashboard</h2>
          <button onClick={logout} style={{ marginLeft: '20px' }}>Đăng xuất</button>
        </div>
        <TeacherDashboard user={user} onLogout={logout} />
      </div>
    );
  }

  if (user.role === 2) {
    return <StudentDashboard user={user} onLogout={logout} />;
  }

  if (user.role === 3) {
    return <TeacherDashboard user={user} onLogout={logout} />;
  }

  return null;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
