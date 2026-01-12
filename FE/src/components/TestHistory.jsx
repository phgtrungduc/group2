import { useState, useEffect } from 'react';
import { getTests, getData } from '../utils/dataService';

function TestHistory({ studentId }) {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTests = () => {
      const data = getData();
      if (data) {
        const studentTests = getTests(studentId);
        const sortedTests = [...studentTests].sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });
        setTests(sortedTests);
        setLoading(false);
      } else {
        setTimeout(loadTests, 100);
      }
    };
    loadTests();
  }, [studentId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      weekday: 'long'
    };
    return date.toLocaleDateString('vi-VN', options);
  };

  const formatShortDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const getScoreGrade = (score) => {
    if (score >= 9.0) return { grade: 'A+', label: 'Xuất sắc', color: '#27ae60' };
    if (score >= 8.5) return { grade: 'A', label: 'Giỏi', color: '#27ae60' };
    if (score >= 8.0) return { grade: 'B+', label: 'Khá giỏi', color: '#3498db' };
    if (score >= 7.0) return { grade: 'B', label: 'Khá', color: '#3498db' };
    if (score >= 6.0) return { grade: 'C+', label: 'Trung bình khá', color: '#f39c12' };
    if (score >= 5.0) return { grade: 'C', label: 'Trung bình', color: '#f39c12' };
    return { grade: 'D', label: 'Yếu', color: '#e74c3c' };
  };

  if (loading) {
    return (
      <div className="test-history">
        <h2>Lịch sử bài kiểm tra</h2>
        <p className="loading">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (tests.length === 0) {
    return (
      <div className="test-history">
        <h2>Lịch sử bài kiểm tra</h2>
        <p className="no-data">Chưa có bài kiểm tra nào</p>
      </div>
    );
  }

  return (
    <div className="test-history">
      <div className="test-history-header">
        <h2>Lịch sử bài kiểm tra</h2>
        <div className="test-summary">
          <span className="summary-item">
            <strong>{tests.length}</strong> bài kiểm tra
          </span>
          <span className="summary-item">
            Điểm TB: <strong>{(tests.reduce((sum, t) => sum + t.score, 0) / tests.length).toFixed(2)}</strong>
          </span>
        </div>
      </div>
      
      <div className="tests-timeline">
        {tests.map((test, index) => {
          const gradeInfo = getScoreGrade(test.score);
          const isLast = index === tests.length - 1;
          
          return (
            <div key={test.id} className="test-timeline-item">
              <div className="timeline-marker">
                <div className="marker-dot"></div>
                {!isLast && <div className="marker-line"></div>}
              </div>
              
              <div className="test-card-european">
                <div className="test-card-header-european">
                  <div className="test-subject-section">
                    <div className="subject-icon">
                      <span>{test.subject.charAt(0)}</span>
                    </div>
                    <div className="subject-info">
                      <h3 className="subject-name">{test.subject}</h3>
                      <span className="test-date-full">{formatDate(test.date)}</span>
                    </div>
                  </div>
                  
                  <div className="test-badges">
                    <span 
                      className="test-type-badge"
                      style={{ 
                        backgroundColor: test.type === 'Cuối kỳ' ? '#e74c3c' : '#3498db'
                      }}
                    >
                      {test.type}
                    </span>
                  </div>
                </div>
                
                <div className="test-card-body-european">
                  <div className="test-score-section">
                    <div className="score-display">
                      <span className="score-value" style={{ color: gradeInfo.color }}>
                        {test.score}
                      </span>
                      <span className="score-max">/ 10</span>
                    </div>
                    <div className="grade-badge" style={{ backgroundColor: gradeInfo.color }}>
                      <span className="grade-letter">{gradeInfo.grade}</span>
                      <span className="grade-label">{gradeInfo.label}</span>
                    </div>
                  </div>
                  
                  <div className="test-meta-info">
                    <div className="meta-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <span>{formatShortDate(test.date)}</span>
                    </div>
                    <div className="meta-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <span>Phòng thi</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TestHistory;
