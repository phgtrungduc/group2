import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

function TeacherFeedback({ studentId, studentName }) {
  const [teacherId, setTeacherId] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [myFeedbacks, setMyFeedbacks] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    loadTeachers();
    loadFeedbacks();
  }, [studentId]);

  const loadTeachers = async () => {
    try {
      const data = await apiService.getTeachers();
      setTeachers(data || []);
    } catch (err) {
      console.error('Không thể tải danh sách giáo viên:', err);
    }
  };

  const loadFeedbacks = async () => {
    try {
      const data = await apiService.getFeedbacksByStudent(studentId);
      setMyFeedbacks(data || []);
    } catch (err) {
      console.error('Không thể tải danh sách phản ánh:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!teacherId || !message.trim()) {
      alert('Vui lòng chọn giáo viên và nhập nội dung đánh giá');
      return;
    }

    try {
      setLoading(true);
      await apiService.createFeedback({
        student_id: studentId,
        teacher_id: teacherId,
        message: message.trim()
      });
      
      setSubmitted(true);
      setTeacherId('');
      setMessage('');
      loadFeedbacks(); // Reload feedbacks
      
      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    } catch (err) {
      alert(err.message || 'Không thể gửi đánh giá');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (feedbackId) => {
    if (!replyText.trim()) {
      alert('Vui lòng nhập nội dung trả lời');
      return;
    }

    try {
      await apiService.replyFeedback(feedbackId, replyText.trim());
      loadFeedbacks(); // Reload feedbacks
      setReplyingTo(null);
      setReplyText('');
    } catch (err) {
      alert(err.message || 'Không thể gửi trả lời');
    }
  };

  return (
    <div className="teacher-feedback">
      <h2>Phản ánh giáo viên</h2>
      
      <div className="feedback-form-section">
        <h3>Đánh giá giáo viên</h3>
        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="form-group">
            <label>Chọn giáo viên</label>
            <select value={teacherId} onChange={(e) => setTeacherId(e.target.value)} disabled={loading}>
              <option value="">-- Chọn giáo viên --</option>
              {teachers.map(teacher => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name} ({teacher.code})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Nội dung đánh giá</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập nội dung đánh giá của bạn về giáo viên..."
              rows="5"
              disabled={loading}
            ></textarea>
          </div>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
          </button>
          {submitted && <div className="success-message">Đã gửi đánh giá thành công!</div>}
        </form>
      </div>

      <div className="feedback-history-section">
        <h3>Lịch sử đánh giá</h3>
        {myFeedbacks.length === 0 ? (
          <p className="no-data">Chưa có đánh giá nào</p>
        ) : (
          <div className="feedbacks-list">
            {myFeedbacks.map(feedback => {
              const teacher = teachers.find(t => t.id === feedback.teacher_id);
              return (
              <div key={feedback.id} className="feedback-card">
                <div className="feedback-header">
                  <span className="feedback-subject">
                    Giáo viên: {teacher ? `${teacher.name} (${teacher.code})` : 'N/A'}
                  </span>
                  <span className={`status-badge ${feedback.status}`}>
                    {feedback.status === 'pending' ? 'Chờ trả lời' : 
                     feedback.status === 'replied' ? 'Đã trả lời' : feedback.status}
                  </span>
                </div>
                <p className="feedback-message">{feedback.message}</p>
                <div className="feedback-footer">
                  <span>Ngày gửi: {new Date(feedback.created_at).toLocaleDateString('vi-VN')}</span>
                </div>

                {feedback.reply && (
                  <div className="feedback-reply">
                    <h4>Trả lời từ giáo viên:</h4>
                    <p className="reply-text">{feedback.reply}</p>
                    <span className="reply-date">Ngày trả lời: {new Date(feedback.replied_at).toLocaleDateString('vi-VN')}</span>
                  </div>
                )}

                {feedback.status === 'pending' && replyingTo !== feedback.id && (
                  <button 
                    className="reply-button"
                    onClick={() => setReplyingTo(feedback.id)}
                  >
                    Trả lời
                  </button>
                )}

                {feedback.status === 'replied' && replyingTo !== feedback.id && (
                  <button 
                    className="reply-button"
                    onClick={() => setReplyingTo(feedback.id)}
                  >
                    Trả lời
                  </button>
                )}

                {replyingTo === feedback.id && (
                  <div className="reply-form">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Nhập nội dung trả lời..."
                      rows="3"
                    ></textarea>
                    <div className="reply-buttons">
                      <button 
                        className="submit-button"
                        onClick={() => handleReply(feedback.id)}
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
            );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherFeedback;

