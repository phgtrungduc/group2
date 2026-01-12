import { useState, useEffect } from 'react';
import { getScores, getData } from '../utils/dataService';

function ScoreView({ studentId }) {
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadScores = () => {
      const data = getData();
      if (data) {
        const studentScores = getScores(studentId);
        setScores(studentScores);
        setLoading(false);
      } else {
        setTimeout(loadScores, 100);
      }
    };
    loadScores();
  }, [studentId]);

  const subjects = Object.keys(scores);
  const average = subjects.length > 0 
    ? (subjects.reduce((sum, sub) => sum + scores[sub], 0) / subjects.length).toFixed(2)
    : 0;

  if (loading) {
    return (
      <div className="score-view">
        <h2>Điểm số các môn học</h2>
        <p className="loading">Đang tải dữ liệu...</p>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 8.5) return 'score-excellent';
    if (score >= 7.0) return 'score-good';
    if (score >= 5.0) return 'score-average';
    return 'score-poor';
  };

  if (subjects.length === 0) {
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
      <div className="scores-table">
        <table>
          <thead>
            <tr>
              <th>Môn học</th>
              <th>Điểm số</th>
              <th>Xếp loại</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map(subject => (
              <tr key={subject}>
                <td>{subject}</td>
                <td className={getScoreColor(scores[subject])}>{scores[subject]}</td>
                <td>
                  {scores[subject] >= 8.5 ? 'Xuất sắc' :
                   scores[subject] >= 7.0 ? 'Giỏi' :
                   scores[subject] >= 5.0 ? 'Khá' : 'Trung bình'}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td><strong>Điểm trung bình</strong></td>
              <td className={getScoreColor(parseFloat(average))}><strong>{average}</strong></td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default ScoreView;

