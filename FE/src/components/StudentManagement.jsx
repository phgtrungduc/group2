import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

function StudentManagement({ students = [], onUpdate }) {
  const [localStudents, setLocalStudents] = useState(students);
  const [subjects, setSubjects] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [editStudent, setEditStudent] = useState({});
  const [scoreData, setScoreData] = useState({ subject: '', type: '', score: '' });
  const [newStudent, setNewStudent] = useState({
    role: 2, // Default: student
    username: '',
    password: '',
    code: '',
    name: '',
    email: '',
    year_level: 1
  });
  const [loading, setLoading] = useState(false);

  // Sync with parent students prop
  useEffect(() => {
    setLocalStudents(students);
  }, [students]);

  // Fetch subjects from API
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const subjectsData = await apiService.getAllSubjects();
        setSubjects(subjectsData);
      } catch (err) {
        console.error('Error fetching subjects:', err);
      }
    };

    fetchSubjects();
  }, []);

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

  const openScoreModal = (student) => {
    setSelectedStudent(student);
    const defaultSubject = subjects.length > 0 ? subjects[0].id : '';
    setScoreData({ subject: defaultSubject, type: '1', score: '' }); // Default to midterm (1)
    setShowScoreModal(true);
  };

  const handleAddClick = () => {
    setNewStudent({
      role: 2,
      username: '',
      password: '',
      code: '',
      name: '',
      email: '',
      year_level: 1
    });
    setShowAddModal(true);
  };

  const handleAddStudent = async () => {
    if (!newStudent.username || !newStudent.password || !newStudent.code || !newStudent.name || !newStudent.email) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Validate year_level for students
    if (newStudent.role === 2 && !newStudent.year_level) {
      alert('Vui lòng chọn năm học cho sinh viên');
      return;
    }

    try {
      setLoading(true);
      
      // Prepare data for register API
      const registerData = {
        username: newStudent.username,
        password: newStudent.password,
        code: newStudent.code,
        name: newStudent.name,
        email: newStudent.email,
        role: newStudent.role,
        ...(newStudent.role === 2 && { year_level: newStudent.year_level })
      };

      await apiService.register(registerData);
      
      alert(`Thêm ${newStudent.role === 2 ? 'sinh viên' : 'giáo viên'} thành công!`);
      setShowAddModal(false);
      if (onUpdate) onUpdate(); // Trigger parent refresh
    } catch (err) {
      console.error('Error creating user:', err);
      alert(err.message || `Có lỗi xảy ra khi thêm ${newStudent.role === 2 ? 'sinh viên' : 'giáo viên'}`);
    } finally {
      setLoading(false);
    }
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

  const handleUpdateScore = async () => {
    if (!scoreData.subject || !scoreData.type || !scoreData.score) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const score = parseFloat(scoreData.score);
    if (isNaN(score) || score < 0 || score > 10) {
      alert('Điểm số phải từ 0 đến 10');
      return;
    }

    try {
      setLoading(true);
      // Call API to update score with integer type
      await apiService.updateScore(selectedStudent.id, {
        subject_id: scoreData.subject, // Keep as string (UUID)
        type: parseInt(scoreData.type), // Send as integer
        score: score
      });
      
      setShowScoreModal(false);
      setScoreData({ subject: '', type: '', score: '' });
      alert('Cập nhật điểm thành công!');
      if (onUpdate) onUpdate(); // Trigger parent refresh
    } catch (err) {
      console.error('Error updating score:', err);
      alert('Có lỗi xảy ra khi cập nhật điểm');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-management">
      <div className="management-header">
        <h2>Quản lý người dùng</h2>
        <button onClick={handleAddClick} className="add-student-btn">
          + Thêm người dùng
        </button>
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
                        onClick={() => openScoreModal(student)} 
                        className="action-btn score-btn"
                        title="Chấm điểm"
                      >
                        Điểm
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

      {showScoreModal && selectedStudent && (
        <div className="modal-overlay" onClick={() => setShowScoreModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Chấm điểm - {selectedStudent.name}</h3>
            <div className="form-group">
              <label>Môn học</label>
              <select
                value={scoreData.subject}
                onChange={(e) => setScoreData({ ...scoreData, subject: e.target.value })}
              >
                <option value="">-- Chọn môn học --</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>{subject.subject_name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Loại điểm</label>
              <select
                value={scoreData.type}
                onChange={(e) => setScoreData({ ...scoreData, type: e.target.value })}
              >
                <option value="">-- Chọn loại điểm --</option>
                <option value="1">Giữa kỳ</option>
                <option value="2">Cuối kỳ</option>
                <option value="3">Kiểm tra</option>
                <option value="4">Bài tập</option>
                <option value="5">Khác</option>
              </select>
            </div>
            <div className="form-group">
              <label>Điểm số (0-10)</label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={scoreData.score}
                onChange={(e) => setScoreData({ ...scoreData, score: e.target.value })}
                placeholder="8.5"
              />
            </div>
            <div className="modal-actions">
              <button onClick={handleUpdateScore} className="save-button" disabled={loading}>
                {loading ? 'Đang lưu...' : 'Lưu điểm'}
              </button>
              <button onClick={() => setShowScoreModal(false)} className="cancel-button">Hủy</button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Thêm người dùng mới</h3>
            <div className="form-group">
              <label>Loại tài khoản</label>
              <select
                value={newStudent.role}
                onChange={(e) => {
                  const role = parseInt(e.target.value);
                  setNewStudent({ 
                    ...newStudent, 
                    role,
                    code: role === 2 ? 'SV' : 'GV',
                    username: role === 2 ? 'SV' : 'GV'
                  });
                }}
              >
                <option value={2}>Sinh viên</option>
                <option value={3}>Giáo viên</option>
              </select>
            </div>
            <div className="form-group">
              <label>Tên đăng nhập (username)</label>
              <input
                type="text"
                value={newStudent.username}
                onChange={(e) => setNewStudent({ ...newStudent, username: e.target.value })}
                placeholder={newStudent.role === 2 ? "VD: SV006" : "VD: GV006"}
              />
            </div>
            <div className="form-group">
              <label>Mật khẩu</label>
              <input
                type="password"
                value={newStudent.password}
                onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                placeholder="Nhập mật khẩu"
              />
            </div>
            <div className="form-group">
              <label>Mã {newStudent.role === 2 ? 'sinh viên' : 'giáo viên'}</label>
              <input
                type="text"
                value={newStudent.code}
                onChange={(e) => setNewStudent({ ...newStudent, code: e.target.value })}
                placeholder={newStudent.role === 2 ? "VD: SV006" : "VD: GV006"}
              />
            </div>
            <div className="form-group">
              <label>Họ tên</label>
              <input
                type="text"
                value={newStudent.name}
                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                placeholder="Họ và tên đầy đủ"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={newStudent.email}
                onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                placeholder={newStudent.role === 2 ? "email@student.edu.vn" : "email@teacher.edu.vn"}
              />
            </div>
            {newStudent.role === 2 && (
              <div className="form-group">
                <label>Năm học</label>
                <select
                  value={newStudent.year_level}
                  onChange={(e) => setNewStudent({ ...newStudent, year_level: parseInt(e.target.value) })}
                >
                  <option value={1}>Năm 1</option>
                  <option value={2}>Năm 2</option>
                  <option value={3}>Năm 3</option>
                </select>
              </div>
            )}
            <div className="modal-actions">
              <button onClick={handleAddStudent} className="save-button" disabled={loading}>
                {loading ? 'Đang thêm...' : `Thêm ${newStudent.role === 2 ? 'sinh viên' : 'giáo viên'}`}
              </button>
              <button onClick={() => setShowAddModal(false)} className="cancel-button">Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentManagement;

