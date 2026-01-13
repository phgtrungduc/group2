import { useState, useEffect } from 'react';
import { getStudents, getScores, getFeedbacks, addStudent, updateStudent, deleteStudent, updateScore, addTest, getTuition } from '../utils/dataService';

function StudentManagement() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    setStudents(getStudents());
  }, []);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [showTuitionModal, setShowTuitionModal] = useState(false);
  const [studentTuition, setStudentTuition] = useState({});
  const [newStudent, setNewStudent] = useState({
    id: '',
    name: '',
    studentId: '',
    email: '',
    year: 1,
    password: '123456',
    role: 'student'
  });
  const [editStudent, setEditStudent] = useState({});
  const [scoreData, setScoreData] = useState({ subject: '', score: '' });
  const [testData, setTestData] = useState({ subject: '', date: '', score: '', type: 'Giữa kỳ' });

  const refreshStudents = () => {
    setStudents([...getStudents()]);
  };

  const handleAddStudent = () => {
    if (!newStudent.id || !newStudent.name || !newStudent.studentId || !newStudent.email) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (students.find(s => s.id === newStudent.id || s.studentId === newStudent.studentId)) {
      alert('ID hoặc mã sinh viên đã tồn tại');
      return;
    }

    addStudent(newStudent);
    refreshStudents();
    setShowAddModal(false);
    setNewStudent({ id: '', name: '', studentId: '', email: '', year: 1, password: '123456', role: 'student' });
    alert('Thêm học sinh thành công!');
  };

  const handleEditStudent = () => {
    if (!editStudent.name || !editStudent.email) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    updateStudent(selectedStudent.id, editStudent);
    refreshStudents();
    setShowEditModal(false);
    setSelectedStudent(null);
    alert('Cập nhật thông tin thành công!');
  };

  const handleDeleteStudent = (studentId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa học sinh này?')) {
      deleteStudent(studentId);
      refreshStudents();
      if (selectedStudent && selectedStudent.id === studentId) {
        setSelectedStudent(null);
      }
      alert('Xóa học sinh thành công!');
    }
  };

  const handleUpdateScore = () => {
    if (!scoreData.subject || !scoreData.score) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const score = parseFloat(scoreData.score);
    if (isNaN(score) || score < 0 || score > 10) {
      alert('Điểm số phải từ 0 đến 10');
      return;
    }

    updateScore(selectedStudent.id, scoreData.subject, score);
    setShowScoreModal(false);
    setScoreData({ subject: '', score: '' });
    alert('Cập nhật điểm thành công!');
  };

  const handleAddTest = () => {
    if (!testData.subject || !testData.date || !testData.score) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const score = parseFloat(testData.score);
    if (isNaN(score) || score < 0 || score > 10) {
      alert('Điểm số phải từ 0 đến 10');
      return;
    }

    const newTest = {
      id: `test${Date.now()}`,
      subject: testData.subject,
      date: testData.date,
      score: score,
      type: testData.type
    };

    addTest(selectedStudent.id, newTest);
    setShowTestModal(false);
    setTestData({ subject: '', date: '', score: '', type: 'Giữa kỳ' });
    alert('Thêm bài kiểm tra thành công!');
  };

  const openEditModal = (student) => {
    setSelectedStudent(student);
    setEditStudent({ name: student.name, email: student.email, year: student.year });
    setShowEditModal(true);
  };

  const openScoreModal = (student) => {
    setSelectedStudent(student);
    const scores = getScores(student.id);
    setScoreData({ subject: Object.keys(scores)[0] || 'Toán', score: '' });
    setShowScoreModal(true);
  };

  const openTestModal = (student) => {
    setSelectedStudent(student);
    setTestData({ subject: 'Toán', date: '', score: '', type: 'Giữa kỳ' });
    setShowTestModal(true);
  };

  const openTuitionModal = (student) => {
    setSelectedStudent(student);
    const tuition = getTuition(student.id);
    setStudentTuition(tuition);
    setShowTuitionModal(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const subjects = ['Toán', 'Lý', 'Hóa', 'Văn', 'Anh'];
  const allFeedbacks = getFeedbacks();
  const years = ['year1', 'year2', 'year3'];
  const yearLabels = {
    'year1': { number: 1, label: 'Năm học 1 (Luỹ 1)' },
    'year2': { number: 2, label: 'Năm học 2 (Luỹ 2)' },
    'year3': { number: 3, label: 'Năm học 3 (Luỹ 3)' }
  };

  const getYearData = (year) => {
    return studentTuition[year] || {
      amount: year === 'year1' ? 400000000 : year === 'year2' ? 450000000 : 500000000,
      months: 12,
      total: (year === 'year1' ? 400000000 : year === 'year2' ? 450000000 : 500000000) * 12,
      paid: 0,
      remaining: (year === 'year1' ? 400000000 : year === 'year2' ? 450000000 : 500000000) * 12,
      status: 'pending'
    };
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="status-badge completed">Đã hoàn thành</span>;
      case 'partial':
        return <span className="status-badge partial">Đang đóng</span>;
      default:
        return <span className="status-badge pending">Chưa đóng</span>;
    }
  };

  return (
    <div className="student-management">
      <div className="management-header">
        <h2>Quản lý học sinh</h2>
        <button onClick={() => setShowAddModal(true)} className="add-button">+ Thêm người dùng mới</button>
      </div>

      <div className="students-table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th>Mã SV</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Năm học</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id}>
                <td>{student.studentId}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>Năm {student.year}</td>
                <td>
                  <div className="action-buttons-group">
                    <div className="action-buttons-primary">
                      <button 
                        onClick={() => openEditModal(student)} 
                        className="action-btn edit-btn"
                        title="Sửa thông tin"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        <span>Sửa</span>
                      </button>
                      <button 
                        onClick={() => openScoreModal(student)} 
                        className="action-btn score-btn"
                        title="Chấm điểm"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                          <path d="M2 17l10 5 10-5"></path>
                          <path d="M2 12l10 5 10-5"></path>
                        </svg>
                        <span>Điểm</span>
                      </button>
                    </div>
                    <div className="action-buttons-secondary">
                      <button 
                        onClick={() => openTuitionModal(student)} 
                        className="action-btn tuition-btn"
                        title="Xem học phí"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="1"></circle>
                          <path d="M12 1v6m0 6v6"></path>
                          <path d="M4.22 4.22l4.24 4.24m-0.48 5.08l-4.24 4.24"></path>
                          <path d="M19.78 4.22l-4.24 4.24m0.48 5.08l4.24 4.24"></path>
                        </svg>
                        <span>Học phí</span>
                      </button>
                      <button 
                        onClick={() => handleDeleteStudent(student.id)} 
                        className="action-btn delete-btn"
                        title="Xóa học sinh"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        <span>Xóa</span>
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Thêm người dùng mới</h3>
            <div className="form-group">
              <label>Loại người dùng</label>
              <select
                value={newStudent.role}
                onChange={(e) => setNewStudent({ ...newStudent, role: e.target.value })}
              >
                <option value="student">Học sinh</option>
                <option value="teacher">Giáo viên</option>
              </select>
            </div>
            <div className="form-group">
              <label>ID đăng nhập</label>
              <input
                type="text"
                value={newStudent.id}
                onChange={(e) => setNewStudent({ ...newStudent, id: e.target.value })}
                placeholder="student5"
              />
            </div>
            <div className="form-group">
              <label>{newStudent.role === 'student' ? 'Mã sinh viên' : newStudent.role === 'teacher' ? 'Mã giáo viên' : 'Mã người dùng'}</label>
              <input
                type="text"
                value={newStudent.studentId}
                onChange={(e) => setNewStudent({ ...newStudent, studentId: e.target.value })}
                placeholder={newStudent.role === 'student' ? 'SV005' : newStudent.role === 'teacher' ? 'GV001' : 'AD001'}
              />
            </div>
            <div className="form-group">
              <label>Họ tên</label>
              <input
                type="text"
                value={newStudent.name}
                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                placeholder="Nguyễn Văn E"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={newStudent.email}
                onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                placeholder="student5@rmit.edu.vn"
              />
            </div>
            {newStudent.role === 'student' && (
              <div className="form-group">
                <label>Năm học</label>
                <input
                  type="number"
                  min="1"
                  max="3"
                  value={newStudent.year}
                  onChange={(e) => setNewStudent({ ...newStudent, year: parseInt(e.target.value) || 1 })}
                  placeholder="1"
                />
              </div>
            )}
            <div className="modal-actions">
              <button onClick={handleAddStudent} className="save-button">Thêm</button>
              <button onClick={() => setShowAddModal(false)} className="cancel-button">Hủy</button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && selectedStudent && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Sửa thông tin học sinh</h3>
            <div className="form-group">
              <label>Họ tên</label>
              <input
                type="text"
                value={editStudent.name}
                onChange={(e) => setEditStudent({ ...editStudent, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={editStudent.email}
                onChange={(e) => setEditStudent({ ...editStudent, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Năm học</label>
              <input
                type="number"
                min="1"
                max="3"
                value={editStudent.year}
                onChange={(e) => setEditStudent({ ...editStudent, year: parseInt(e.target.value) || 1 })}
                placeholder="1"
              />
            </div>
            <div className="modal-actions">
              <button onClick={handleEditStudent} className="save-button">Lưu</button>
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
                {subjects.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
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
              <button onClick={handleUpdateScore} className="save-button">Lưu điểm</button>
              <button onClick={() => setShowScoreModal(false)} className="cancel-button">Hủy</button>
            </div>
          </div>
        </div>
      )}

      {showTestModal && selectedStudent && (
        <div className="modal-overlay" onClick={() => setShowTestModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Thêm bài kiểm tra - {selectedStudent.name}</h3>
            <div className="form-group">
              <label>Môn học</label>
              <select
                value={testData.subject}
                onChange={(e) => setTestData({ ...testData, subject: e.target.value })}
              >
                {subjects.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Ngày thi</label>
              <input
                type="date"
                value={testData.date}
                onChange={(e) => setTestData({ ...testData, date: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Điểm số (0-10)</label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={testData.score}
                onChange={(e) => setTestData({ ...testData, score: e.target.value })}
                placeholder="8.5"
              />
            </div>
            <div className="form-group">
              <label>Loại bài kiểm tra</label>
              <select
                value={testData.type}
                onChange={(e) => setTestData({ ...testData, type: e.target.value })}
              >
                <option value="Giữa kỳ">Giữa kỳ</option>
                <option value="Cuối kỳ">Cuối kỳ</option>
              </select>
            </div>
            <div className="modal-actions">
              <button onClick={handleAddTest} className="save-button">Thêm</button>
              <button onClick={() => setShowTestModal(false)} className="cancel-button">Hủy</button>
            </div>
          </div>
        </div>
      )}

      {showTuitionModal && selectedStudent && (
        <div className="modal-overlay" onClick={() => setShowTuitionModal(false)}>
          <div className="modal-content tuition-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Học phí - {selectedStudent.name}</h3>
            <div className="tuition-list">
              {years.map(year => {
                const yearData = getYearData(year);
                const yearInfo = yearLabels[year];
                
                return (
                  <div key={year} className={`tuition-card ${yearData.status}`}>
                    <div className="tuition-card-header">
                      <h4>{yearInfo.label}</h4>
                      {getStatusBadge(yearData.status)}
                    </div>
                    <div className="tuition-details">
                      <div className="tuition-row">
                        <span>Mức học phí/tháng:</span>
                        <strong>{formatCurrency(yearData.amount)}</strong>
                      </div>
                      <div className="tuition-row">
                        <span>Số tháng:</span>
                        <strong>{yearData.months} tháng</strong>
                      </div>
                      <div className="tuition-row highlight">
                        <span>Tổng học phí:</span>
                        <strong>{formatCurrency(yearData.total)}</strong>
                      </div>
                      <div className="tuition-row">
                        <span>Đã đóng:</span>
                        <strong className="paid">{formatCurrency(yearData.paid)}</strong>
                      </div>
                      <div className="tuition-row">
                        <span>Còn lại:</span>
                        <strong className={yearData.remaining > 0 ? 'remaining' : 'paid'}>
                          {formatCurrency(yearData.remaining)}
                        </strong>
                      </div>
                      <div className="tuition-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${(yearData.paid / yearData.total) * 100}%` }}
                          ></div>
                        </div>
                        <span>{Math.round((yearData.paid / yearData.total) * 100)}% đã đóng</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowTuitionModal(false)} className="cancel-button">Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentManagement;

