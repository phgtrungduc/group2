import { useState, useEffect } from 'react';
import { addFeedback, getFeedbacks, replyFeedback } from '../utils/dataService';

function TeacherFeedback({ studentId, studentName }) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [myFeedbacks, setMyFeedbacks] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    const feedbacks = getFeedbacks().filter(fb => fb.studentId === studentId);
    setMyFeedbacks(feedbacks);
  }, [studentId, submitted]);

  const subjects = ['Toán', 'Lý', 'Hóa', 'Văn', 'Anh'];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!subject || !message.trim()) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const newFeedback = {
      id: `fb${Date.now()}`,
      studentId: studentId,
      studentName: studentName,
      teacherId: 'teacher1',
      subject: subject,
      message: message.trim(),
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    addFeedback(newFeedback);
    const feedbacks = getFeedbacks().filter(fb => fb.studentId === studentId);
    setMyFeedbacks(feedbacks);
    setSubmitted(true);
    setSubject('');
    setMessage('');
    
    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };

  const handleReply = (feedbackId) => {
    if (!replyText.trim()) {
      alert('Vui lòng nhập nội dung trả lời');
      return;
    }

    replyFeedback(feedbackId, replyText.trim());
    const feedbacks = getFeedbacks().filter(fb => fb.studentId === studentId);
    setMyFeedbacks(feedbacks);
    setReplyingTo(null);
    setReplyText('');
  };

  return (
    <div className="teacher-feedback">
      <h2>Phản ánh giáo viên</h2>
      
      <div className="feedback-form-section">
        <h3>Gửi phản ánh mới</h3>
        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="form-group">
            <label>Môn học</label>
            <select value={subject} onChange={(e) => setSubject(e.target.value)}>
              <option value="">Chọn môn học</option>
              {subjects.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Nội dung phản ánh</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập nội dung phản ánh của bạn..."
              rows="5"
            ></textarea>
          </div>
          <button type="submit" className="submit-button">Gửi phản ánh</button>
          {submitted && <div className="success-message">Đã gửi phản ánh thành công!</div>}
        </form>
      </div>

      <div className="feedback-history-section">
        <h3>Lịch sử phản ánh</h3>
        {myFeedbacks.length === 0 ? (
          <p className="no-data">Chưa có phản ánh nào</p>
        ) : (
          <div className="feedbacks-list">
            {myFeedbacks.map(feedback => (
              <div key={feedback.id} className="feedback-card">
                <div className="feedback-header">
                  <span className="feedback-subject">{feedback.subject}</span>
                </div>
                <p className="feedback-message">{feedback.message}</p>
                <div className="feedback-footer">
                  <span>Ngày gửi: {new Date(feedback.date).toLocaleDateString('vi-VN')}</span>
                </div>

                {feedback.reply && (
                  <div className="feedback-reply">
                    <h4>Trả lời từ giáo viên:</h4>
                    <p className="reply-text">{feedback.reply}</p>
                    <span className="reply-date">Ngày trả lời: {new Date(feedback.replyDate).toLocaleDateString('vi-VN')}</span>
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherFeedback;

