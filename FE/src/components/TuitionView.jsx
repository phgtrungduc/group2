import { useState, useEffect } from 'react';
import { getTuition, updateTuition, getData } from '../utils/dataService';

function TuitionView({ studentId }) {
  const [tuition, setTuition] = useState({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const data = getTuition(studentId);
    setTuition(data);
  }, [studentId, refresh]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const years = ['year1', 'year2', 'year3'];
  const yearLabels = {
    'year1': { number: 1, label: 'Năm học 1 (Luỹ 1)' },
    'year2': { number: 2, label: 'Năm học 2 (Luỹ 2)' },
    'year3': { number: 3, label: 'Năm học 3 (Luỹ 3)' }
  };

  const getYearData = (year) => {
    return tuition[year] || {
      amount: year === 'year1' ? 400000000 : year === 'year2' ? 450000000 : 500000000,
      months: 12,
      total: (year === 'year1' ? 400000000 : year === 'year2' ? 450000000 : 500000000) * 12,
      paid: 0,
      remaining: (year === 'year1' ? 400000000 : year === 'year2' ? 450000000 : 500000000) * 12,
      status: 'pending'
    };
  };

  const canPayYear = (year) => {
    if (year === 'year1') return true;
    const prevYear = `year${parseInt(year.replace('year', '')) - 1}`;
    const prevData = tuition[prevYear];
    return prevData && prevData.status === 'completed';
  };

  const handleOpenPayment = (year) => {
    if (!canPayYear(year)) {
      alert(`Bạn cần hoàn thành đóng học phí năm ${parseInt(year.replace('year', '')) - 1} trước khi đóng năm ${year.replace('year', '')}`);
      return;
    }
    setSelectedYear(year);
    const yearData = getYearData(year);
    setPaymentAmount(yearData.remaining.toString());
    setShowPaymentModal(true);
  };

  const handlePayment = () => {
    const amount = parseFloat(paymentAmount.replace(/[^\d]/g, ''));
    if (isNaN(amount) || amount <= 0) {
      alert('Vui lòng nhập số tiền hợp lệ');
      return;
    }

    const yearData = getYearData(selectedYear);
    if (amount > yearData.remaining) {
      alert('Số tiền không được vượt quá số còn lại');
      return;
    }

    updateTuition(studentId, selectedYear, amount);
    setRefresh(prev => prev + 1);
    setShowPaymentModal(false);
    setPaymentAmount('');
    alert('Đóng học phí thành công!');
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
    <div className="tuition-view">
      <h2>Học phí theo năm học</h2>
      <div className="tuition-overview">
        <p className="tuition-info-text">
          Học phí được tính theo từng năm học. Bạn cần hoàn thành đóng học phí năm trước để có thể đóng năm tiếp theo.
        </p>
      </div>
      <div className="tuition-list">
        {years.map(year => {
          const yearData = getYearData(year);
          const yearInfo = yearLabels[year];
          const canPay = canPayYear(year);
          const isCompleted = yearData.status === 'completed';
          
          return (
            <div key={year} className={`tuition-card ${yearData.status}`}>
              <div className="tuition-card-header">
                <h3>{yearInfo.label}</h3>
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
                {!isCompleted && (
                  <button 
                    onClick={() => handleOpenPayment(year)}
                    className={`payment-button ${canPay ? '' : 'disabled'}`}
                    disabled={!canPay}
                  >
                    {canPay ? 'Đóng học phí' : 'Cần hoàn thành năm trước'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showPaymentModal && selectedYear && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal-content payment-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Đóng học phí {yearLabels[selectedYear].label}</h3>
            <div className="form-group">
              <label>Số tiền còn lại</label>
              <div className="remaining-amount">
                {formatCurrency(getYearData(selectedYear).remaining)}
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
                  onClick={() => setPaymentAmount(getYearData(selectedYear).remaining.toString())}
                  className="option-button"
                >
                  Đóng toàn bộ
                </button>
                <button 
                  onClick={() => {
                    const monthly = getYearData(selectedYear).amount;
                    setPaymentAmount(monthly.toString());
                  }}
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
