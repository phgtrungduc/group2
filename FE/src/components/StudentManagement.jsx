import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

function StudentManagement({ students = [], onUpdate }) {
  const [localStudents, setLocalStudents] = useState(students);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editStudent, setEditStudent] = useState({});
  const [loading, setLoading] = useState(false);

  // Sync with parent students prop
  useEffect(() => {
    setLocalStudents(students);
  }, [students]);

  const getStudentAverage = (student) => {
    if (!student.scores || student.scores.length === 0) return 0;
    
    const subjectScores = {};
    student.scores.forEach(score => {
      if (!subjectScores[score.subject_id]) {
        subjectScores[score.subject_id] = [];
      }
      subjectScores[score.subject_id].push(score.score);
    });
    
    const subjectAverages = Object.values(subjectScores).map(scores => {
      return scores.reduce((sum, s) => sum + s, 0) / scores.length;
    });
    
    if (subjectAverages.length === 0) return 0;
    const average = subjectAverages.reduce((sum, avg) => sum + avg, 0) / subjectAverages.length;
    return average.toFixed(2);
  };

  const handleEditClick = (student) => {
    setSelectedStudent(student);
    setEditStudent({
      name: student.name,
      email: student.email,
      year_level: student.year_level
    });
    setShowEditModal(true);
  };

  const handleEditStudent = async () => {
    if (!editStudent.name || !editStudent.email) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      setLoading(true);
      const updatedStudent = await apiService.updateStudent(selectedStudent.id, editStudent);
      
      // Update local state with new data
      setLocalStudents(prevStudents => 
        prevStudents.map(s => 
          s.id === selectedStudent.id 
            ? { ...s, ...updatedStudent, scores: s.scores } // Keep existing scores
            : s
        )
      );
      
      setShowEditModal(false);
      setSelectedStudent(null);
      alert('Cập nhật thông tin thành công!');
      if (onUpdate) onUpdate(); // Trigger parent refresh
    } catch (err) {
      console.error('Error updating student:', err);
      alert('Có lỗi xảy ra khi cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa học sinh này?')) {
      try {
        setLoading(true);
        await apiService.deleteStudent(studentId);
        
        // Remove student from local state
        setLocalStudents(prevStudents => 
          prevStudents.filter(s => s.id !== studentId)
        );
        
        if (selectedStudent && selectedStudent.id === studentId) {
          setSelectedStudent(null);
        }
        alert('Xóa học sinh thành công!');
        if (onUpdate) onUpdate(); // Trigger parent refresh
      } catch (err) {
        console.error('Error deleting student:', err);
        alert('Có lỗi xảy ra khi xóa học sinh');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="student-management">
      <div className="management-header">
        <h2>Quản lý học sinh</h2>
      </div>

      {loading && <div className="loading">Đang xử lý...</div>}

      <div className="students-table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th>Mã SV</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Năm học</th>
              <th>Điểm TB</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {localStudents.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>Chưa có học sinh nào</td>
              </tr>
            ) : (
              localStudents.map(student => (
                <tr key={student.id}>
                  <td>{student.code}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>Năm {student.year_level}</td>
                  <td>{getStudentAverage(student)}</td>
                  <td>
                    <div className="action-buttons-group">
                      <button 
                        onClick={() => handleEditClick(student)} 
                        className="action-btn edit-btn"
                        title="Sửa thông tin"
                      >
                        Sửa
                      </button>
                      <button 
                        onClick={() => handleDeleteStudent(student.id)} 
                        className="action-btn delete-btn"
                        title="Xóa học sinh"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showEditModal && selectedStudent && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Sửa thông tin học sinh</h3>
            <div className="form-group">
              <label>Họ tên</label>
              <input
                type="text"
                value={editStudent.name || ''}
                onChange={(e) => setEditStudent({ ...editStudent, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={editStudent.email || ''}
                onChange={(e) => setEditStudent({ ...editStudent, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Năm học</label>
              <input
                type="number"
                min="1"
                max="3"
                value={editStudent.year_level || 1}
                onChange={(e) => setEditStudent({ ...editStudent, year_level: parseInt(e.target.value) || 1 })}
                placeholder="1"
              />
            </div>
            <div className="modal-actions">
              <button onClick={handleEditStudent} className="save-button" disabled={loading}>
                {loading ? 'Đang lưu...' : 'Lưu'}
              </button>
              <button onClick={() => setShowEditModal(false)} className="cancel-button">Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentManagement;

