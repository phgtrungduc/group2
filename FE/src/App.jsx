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

  if (user.role === 'student') {
    return <StudentDashboard user={user} onLogout={logout} />;
  }

  if (user.role === 'teacher') {
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
