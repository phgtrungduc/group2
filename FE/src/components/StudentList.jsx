import { useState, useEffect } from 'react';
import { getStudents, getScores } from '../utils/dataService';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    setStudents(getStudents());
  }, []);

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
  };

  const getStudentScores = (studentId) => {
    const scores = getScores(studentId);
    const subjects = Object.keys(scores);
    if (subjects.length === 0) return 0;
    const average = subjects.reduce((sum, sub) => sum + scores[sub], 0) / subjects.length;
    return average.toFixed(2);
  };

  return (
    <div className="student-list">
      <h2>Danh sách học sinh</h2>
      <div className="students-grid">
        {students.map(student => (
          <div key={student.id} className="student-card">
            <div className="student-info">
              <h3>{student.name}</h3>
              <p><strong>Mã SV:</strong> {student.studentId}</p>
              <p><strong>Email:</strong> {student.email}</p>
              <p><strong>Năm học:</strong> Năm {student.year}</p>
              <p><strong>Điểm TB:</strong> {getStudentScores(student.id)}</p>
            </div>
            <button onClick={() => handleViewDetails(student)} className="view-details-btn">
              Xem chi tiết
            </button>
          </div>
        ))}
      </div>

      {selectedStudent && (
        <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
          <div className="modal-content student-details" onClick={(e) => e.stopPropagation()}>
            <h3>Thông tin chi tiết</h3>
            <div className="details-content">
              <p><strong>Họ tên:</strong> {selectedStudent.name}</p>
              <p><strong>Mã sinh viên:</strong> {selectedStudent.studentId}</p>
              <p><strong>Email:</strong> {selectedStudent.email}</p>
              <p><strong>Năm học:</strong> Năm {selectedStudent.year}</p>
              <div className="scores-section">
                <h4>Điểm số các môn:</h4>
                <div className="scores-grid">
                  {Object.entries(getScores(selectedStudent.id)).map(([subject, score]) => (
                    <div key={subject} className="score-item">
                      <span>{subject}:</span>
                      <strong>{score}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={() => setSelectedStudent(null)} className="close-button">Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentList;

