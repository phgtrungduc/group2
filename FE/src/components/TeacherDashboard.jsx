import { useState, useEffect } from 'react';
import StudentList from './StudentList';
import StudentManagement from './StudentManagement';
import { apiService } from '../services/apiService';

function TeacherDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('management');
  const [students, setStudents] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load students with scores
  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getAllStudentsWithScores();
        setStudents(data);
      } catch (err) {
        console.error('Error loading students:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'management' || activeTab === 'list') {
      loadStudents();
    }
  }, [activeTab]);

  // Load feedbacks
  useEffect(() => {
    const loadFeedbacks = async () => {
      if (activeTab === 'feedbacks') {
        try {
          setLoading(true);
          setError(null);
          const data = await apiService.getAllFeedbacks();
          setFeedbacks(data);
        } catch (err) {
          console.error('Error loading feedbacks:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    loadFeedbacks();
  }, [activeTab]);

  const tabs = [
    { id: 'management', label: 'Quản lý học sinh' },
    { id: 'list', label: 'Danh sách học sinh' },
    { id: 'feedbacks', label: 'Phản ánh từ học sinh' }
  ];

  const handleReply = async (feedbackId) => {
    if (!replyText.trim()) {
      alert('Vui lòng nhập nội dung trả lời');
      return;
    }

    try {
      await apiService.replyFeedback(feedbackId, replyText.trim());
      // Reload feedbacks
      const data = await apiService.getAllFeedbacks();
      setFeedbacks(data);
      setReplyingTo(null);
      setReplyText('');
    } catch (err) {
      console.error('Error replying to feedback:', err);
      alert('Có lỗi xảy ra khi gửi trả lời');
    }
  };

  const renderContent = () => {
    if (loading) {
      return <div className="loading">Đang tải dữ liệu...</div>;
    }

    if (error) {
      return <div className="error">Lỗi: {error}</div>;
    }

    switch (activeTab) {
      case 'management':
        return <StudentManagement students={students} onUpdate={() => setActiveTab('management')} />;
      case 'list':
        return <StudentList students={students} />;
      case 'feedbacks':
        return (
          <div className="feedbacks-view">
            <h2>Phản ánh từ học sinh</h2>
            {feedbacks.length === 0 ? (
              <p className="no-data">Chưa có phản ánh nào</p>
            ) : (
              <div className="feedbacks-list">
                {feedbacks.map(feedback => (
                  <div key={feedback.id} className="feedback-card">
                    <div className="feedback-header">
                      <div>
                        <h3>{feedback.studentName}</h3>
                        <p className="feedback-meta">
                          <span>Môn: {feedback.subject}</span>
                          <span>Ngày: {new Date(feedback.date).toLocaleDateString('vi-VN')}</span>
                        </p>
                      </div>
                    </div>
                    <p className="feedback-message">{feedback.message}</p>

                    {feedback.reply && (
                      <div className="feedback-reply">
                        <h4>Trả lời của bạn:</h4>
                        <p className="reply-text">{feedback.reply}</p>
                        <span className="reply-date">Ngày trả lời: {new Date(feedback.replyDate).toLocaleDateString('vi-VN')}</span>
                      </div>
                    )}

                    {feedback.status === 'pending' && replyingTo !== feedback.id && (
                      <button 
                        className="reply-button"
                        onClick={() => setReplyingTo(feedback.id)}
                      >
                        Trả lời phản ánh
                      </button>
                    )}

                    {replyingTo === feedback.id && (
                      <div className="reply-form">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Nhập nội dung trả lời của bạn..."
                          rows="3"
                        ></textarea>
                        <div className="reply-buttons">
                          <button 
                            className="submit-button"
                            onClick={() => handleReply(feedback.id)}
                            style={{ flex: 1 }}
                          >
                            Gửi trả lời
                          </button>
                          <button 
                            className="cancel-button"
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText('');
                            }}
                          >
                            Hủy
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      default:
        return <StudentManagement />;
    }
  };

  return (
    <div className="dashboard teacher-dashboard">
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

export default TeacherDashboard;

