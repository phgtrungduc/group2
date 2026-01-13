import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

function TuitionView({ studentId }) {
  const [tuitionList, setTuitionList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedTuition, setSelectedTuition] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');

  useEffect(() => {
    loadTuition();
  }, [studentId]);

  const loadTuition = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getTuitionByStudent(studentId);
      setTuitionList(data || []);
    } catch (err) {
      setError(err.message || 'Không thể tải thông tin học phí');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const yearLabels = {
    1: 'Năm học 1 (Luỹ 1)',
    2: 'Năm học 2 (Luỹ 2)',
    3: 'Năm học 3 (Luỹ 3)'
  };

  const canPayYear = (tuitionData) => {
    // Chỉ cho phép đóng năm đang active hoặc năm chưa hoàn thành
    return tuitionData.is_active || tuitionData.status !== 'completed';
  };

  const handleOpenPayment = (tuitionData) => {
    if (!canPayYear(tuitionData)) {
      alert('Không thể đóng học phí cho năm này');
      return;
    }
    setSelectedTuition(tuitionData);
    setPaymentAmount(tuitionData.remaining.toString());
    setShowPaymentModal(true);
  };

  const handlePayment = () => {
    const amount = parseFloat(paymentAmount.replace(/[^\d]/g, ''));
    if (isNaN(amount) || amount <= 0) {
      alert('Vui lòng nhập số tiền hợp lệ');
      return;
    }

    if (amount > selectedTuition.remaining) {
      alert('Số tiền không được vượt quá số còn lại');
      return;
    }

    // Chỉ đóng modal - chưa xử lý thanh toán thực tế
    alert('Đóng học phí thành công! (Demo)');
    setShowPaymentModal(false);
    setPaymentAmount('');
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

  if (loading) {
    return <div className="tuition-view"><p>Đang tải thông tin học phí...</p></div>;
  }

  if (error) {
    return <div className="tuition-view"><p className="error-message">Lỗi: {error}</p></div>;
  }

  return (
    <div className="tuition-view">
      <h2>Học phí theo năm học</h2>
      <div className="tuition-overview">
        <p className="tuition-info-text">
          Học phí được tính theo từng năm học. Bạn cần hoàn thành đóng học phí năm trước để có thể đóng năm tiếp theo.
        </p>
      </div>
      {tuitionList.length === 0 ? (
        <p>Chưa có thông tin học phí</p>
      ) : (
        <div className="tuition-list">
          {tuitionList.map(tuitionData => {
            const canPay = canPayYear(tuitionData);
            const isCompleted = tuitionData.status === 'completed';
            
            return (
              <div key={tuitionData.id} className={`tuition-card ${tuitionData.status}`}>
                <div className="tuition-card-header">
                  <h3>{yearLabels[tuitionData.year]}</h3>
                  {getStatusBadge(tuitionData.status)}
                  {tuitionData.is_active && <span className="active-badge">Năm hiện tại</span>}
                </div>
                <div className="tuition-details">
                  <div className="tuition-row">
                    <span>Mức học phí/tháng:</span>
                    <strong>{formatCurrency(tuitionData.amount)}</strong>
                  </div>
                  <div className="tuition-row">
                    <span>Số tháng:</span>
                    <strong>{tuitionData.months} tháng</strong>
                  </div>
                  <div className="tuition-row highlight">
                    <span>Tổng học phí:</span>
                    <strong>{formatCurrency(tuitionData.total)}</strong>
                  </div>
                  <div className="tuition-row">
                    <span>Đã đóng:</span>
                    <strong className="paid">{formatCurrency(tuitionData.paid)}</strong>
                  </div>
                  <div className="tuition-row">
                    <span>Còn lại:</span>
                    <strong className={tuitionData.remaining > 0 ? 'remaining' : 'paid'}>
                      {formatCurrency(tuitionData.remaining)}
                    </strong>
                  </div>
                  <div className="tuition-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${(tuitionData.paid / tuitionData.total) * 100}%` }}
                      ></div>
                    </div>
                    <span>{Math.round((tuitionData.paid / tuitionData.total) * 100)}% đã đóng</span>
                  </div>
                  {!isCompleted && (
                    <button 
                      onClick={() => handleOpenPayment(tuitionData)}
                      className={`payment-button ${canPay ? '' : 'disabled'}`}
                      disabled={!canPay}
                    >
                      {canPay ? 'Đóng học phí' : 'Không thể đóng'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showPaymentModal && selectedTuition && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal-content payment-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Đóng học phí {yearLabels[selectedTuition.year]}</h3>
            <div className="form-group">
              <label>Số tiền còn lại</label>
              <div className="remaining-amount">
                {formatCurrency(selectedTuition.remaining)}
              </div>
            </div>
            <div className="form-group">
              <label>Số tiền muốn đóng (VND)</label>
              <input
                type="text"
                value={paymentAmount}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d]/g, '');
                  setPaymentAmount(value);
                }}
                placeholder="Nhập số tiền"
              />
              <div className="payment-options">
                <button 
                  onClick={() => setPaymentAmount(selectedTuition.remaining.toString())}
                  className="option-button"
                >
                  Đóng toàn bộ
                </button>
                <button 
                  onClick={() => setPaymentAmount(selectedTuition.amount.toString())}
                  className="option-button"
                >
                  Đóng 1 tháng
                </button>
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={handlePayment} className="save-button">Xác nhận đóng</button>
              <button onClick={() => setShowPaymentModal(false)} className="cancel-button">Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TuitionView;
