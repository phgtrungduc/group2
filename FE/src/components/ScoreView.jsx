import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

function ScoreView({ studentId }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadScores = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getScoresByStudent(studentId);
        setScores(data);
      } catch (err) {
        console.error('Error loading scores:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      loadScores();
    }
  }, [studentId]);

  const getScoreTypeName = (type) => {
    switch (type) {
      case 1: return 'Giữa kỳ';
      case 2: return 'Cuối kỳ';
      case 3: return 'Kiểm tra';
      case 4: return 'Bài tập';
      case 5: return 'Khác';
      default: return 'Không xác định';
    }
  };

  // Group scores by subject
  const scoresBySubject = scores.reduce((acc, score) => {
    const subjectName = score.subject_name || 'N/A';
    if (!acc[subjectName]) {
      acc[subjectName] = [];
    }
    acc[subjectName].push(score);
    return acc;
  }, {});

  // Calculate average for each subject
  const subjectAverages = Object.entries(scoresBySubject).map(([subject, subjectScores]) => {
    const avg = subjectScores.reduce((sum, s) => sum + parseFloat(s.score), 0) / subjectScores.length;
    return { subject, average: avg, scores: subjectScores };
  });

  // Calculate overall average
  const overallAverage = subjectAverages.length > 0
    ? (subjectAverages.reduce((sum, s) => sum + s.average, 0) / subjectAverages.length).toFixed(2)
    : 0;

  if (loading) {
    return (
      <div className="score-view">
        <h2>Điểm số các môn học</h2>
        <p className="loading">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="score-view">
        <h2>Điểm số các môn học</h2>
        <p className="error">Lỗi: {error}</p>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 8.5) return 'score-excellent';
    if (score >= 7.0) return 'score-good';
    if (score >= 5.0) return 'score-average';
    return 'score-poor';
  };

  const getScoreRating = (score) => {
    if (score >= 8.5) return 'Xuất sắc';
    if (score >= 7.0) return 'Giỏi';
    if (score >= 5.0) return 'Khá';
    return 'Trung bình';
  };

  if (scores.length === 0) {
    return (
      <div className="score-view">
        <h2>Điểm số các môn học</h2>
        <p className="no-data">Chưa có điểm số nào</p>
      </div>
    );
  }

  return (
    <div className="score-view">
      <h2>Điểm số các môn học</h2>
      
      {subjectAverages.map(({ subject, average, scores: subjectScores }) => (
        <div key={subject} className="subject-score-section">
          <h3>{subject} - Điểm TB: <span className={getScoreColor(average)}>{average.toFixed(2)}</span></h3>
          <div className="scores-table">
            <table>
              <thead>
                <tr>
                  <th>Loại điểm</th>
                  <th>Điểm số</th>
                  <th>Xếp loại</th>
                </tr>
              </thead>
              <tbody>
                {subjectScores.map((score, idx) => (
                  <tr key={idx}>
                    <td>{getScoreTypeName(score.type)}</td>
                    <td className={getScoreColor(parseFloat(score.score))}>{score.score}</td>
                    <td>{getScoreRating(parseFloat(score.score))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <div className="overall-average">
        <h3>Điểm trung bình tất cả các môn: <span className={getScoreColor(parseFloat(overallAverage))}>{overallAverage}</span></h3>
      </div>
    </div>
  );
}

export default ScoreView;