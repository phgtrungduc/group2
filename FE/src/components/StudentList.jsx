import { useState } from 'react';

function StudentList({ students = [] }) {
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
  };

  const getStudentAverage = (student) => {
    if (!student.scores || student.scores.length === 0) return 0;
    
    // Calculate average by subject
    const subjectScores = {};
    student.scores.forEach(score => {
      if (!subjectScores[score.subject_id]) {
        subjectScores[score.subject_id] = [];
      }
      subjectScores[score.subject_id].push(score.score);
    });
    
    // Average of all subjects
    const subjectAverages = Object.values(subjectScores).map(scores => {
      return scores.reduce((sum, s) => sum + s, 0) / scores.length;
    });
    
    if (subjectAverages.length === 0) return 0;
    const average = subjectAverages.reduce((sum, avg) => sum + avg, 0) / subjectAverages.length;
    return average.toFixed(2);
  };

  const getScoresBySubject = (student) => {
    if (!student.scores || student.scores.length === 0) return {};
    
    const scoresBySubject = {};
    student.scores.forEach(score => {
      if (!scoresBySubject[score.subject_name]) {
        scoresBySubject[score.subject_name] = [];
      }
      scoresBySubject[score.subject_name].push(score);
    });
    
    return scoresBySubject;
  };

  return (
    <div className="student-list">
      <h2>Danh sách học sinh</h2>
      {students.length === 0 ? (
        <p className="no-data">Chưa có học sinh nào</p>
      ) : (
        <div className="students-grid">
          {students.map(student => (
            <div key={student.id} className="student-card">
              <div className="student-info">
                <h3>{student.name}</h3>
                <p><strong>Mã SV:</strong> {student.code}</p>
                <p><strong>Email:</strong> {student.email}</p>
                <p><strong>Năm học:</strong> Năm {student.year_level}</p>
                <p><strong>Điểm TB:</strong> {getStudentAverage(student)}</p>
              </div>
              <button onClick={() => handleViewDetails(student)} className="view-details-btn">
                Xem chi tiết
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedStudent && (
        <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
          <div className="modal-content student-details" onClick={(e) => e.stopPropagation()}>
            <h3>Thông tin chi tiết</h3>
            <div className="details-content">
              <p><strong>Họ tên:</strong> {selectedStudent.name}</p>
              <p><strong>Mã sinh viên:</strong> {selectedStudent.code}</p>
              <p><strong>Email:</strong> {selectedStudent.email}</p>
              <p><strong>Năm học:</strong> Năm {selectedStudent.year_level}</p>
              <p><strong>Điểm trung bình:</strong> {getStudentAverage(selectedStudent)}</p>
              
              <h4>Điểm số chi tiết:</h4>
              {Object.entries(getScoresBySubject(selectedStudent)).length === 0 ? (
                <p>Chưa có điểm</p>
              ) : (
                Object.entries(getScoresBySubject(selectedStudent)).map(([subject, scores]) => (
                  <div key={subject} className="subject-scores">
                    <strong>{subject}:</strong>
                    <ul>
                      {scores.map((score, idx) => (
                        <li key={idx}>
                          {score.type === 1 ? 'Giữa kỳ' : 
                           score.type === 2 ? 'Cuối kỳ' : 
                           score.type === 3 ? 'Kiểm tra' : 
                           score.type === 4 ? 'Bài tập' : 'Khác'}: {score.score}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </div>
            <button onClick={() => setSelectedStudent(null)} className="close-modal-btn">
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentList;