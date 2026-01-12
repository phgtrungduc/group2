import { useState, useEffect, useMemo } from 'react';
import { getSchedule, getData } from '../utils/dataService';

function ScheduleView({ studentId }) {
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSchedule = () => {
      const data = getData();
      if (data) {
        const studentSchedule = getSchedule(studentId);
        setSchedule(studentSchedule);
        setLoading(false);
      } else {
        setTimeout(loadSchedule, 100);
      }
    };
    loadSchedule();
  }, [studentId]);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayNames = {
    'Monday': 'Thứ 2',
    'Tuesday': 'Thứ 3',
    'Wednesday': 'Thứ 4',
    'Thursday': 'Thứ 5',
    'Friday': 'Thứ 6',
    'Saturday': 'Thứ 7'
  };

  const subjectColors = {
    'Toán': '#003d82',
    'Lý': '#0066cc',
    'Hóa': '#0080ff',
    'Văn': '#00a3ff',
    'Anh': '#00ccff'
  };

  const getSubjectColor = (subject) => {
    return subjectColors[subject] || '#003d82';
  };

  const parseTime = (timeString) => {
    const [start] = timeString.split('-');
    const [hours, minutes] = start.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const sortedSchedule = useMemo(() => {
    const sorted = {};
    days.forEach(day => {
      const classes = schedule[day] || [];
      sorted[day] = [...classes].sort((a, b) => {
        return parseTime(a.time) - parseTime(b.time);
      });
    });
    return sorted;
  }, [schedule]);

  if (loading) {
    return (
      <div className="schedule-view">
        <h2>Thời khóa biểu</h2>
        <p className="loading">Đang tải dữ liệu...</p>
      </div>
    );
  }

  const hasAnyClasses = days.some(day => (schedule[day] || []).length > 0);

  if (!hasAnyClasses) {
    return (
      <div className="schedule-view">
        <h2>Thời khóa biểu</h2>
        <p className="no-data">Chưa có thời khóa biểu</p>
      </div>
    );
  }

  return (
    <div className="schedule-view">
      <h2>Thời khóa biểu</h2>
      <div className="schedule-container">
        <div className="schedule-table-wrapper">
          <table className="schedule-table-main">
            <thead>
              <tr>
                <th className="time-column">Thời gian</th>
                {days.map(day => (
                  <th key={day} className="day-column">
                    {dayNames[day]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {['07:00-08:30', '08:45-10:15', '10:30-12:00', '13:00-14:30', '14:45-16:15', '16:30-18:00'].map(timeSlot => {
                const timeStart = parseTime(timeSlot);
                return (
                  <tr key={timeSlot}>
                    <td className="time-slot">{timeSlot}</td>
                    {days.map(day => {
                      const classItem = sortedSchedule[day]?.find(cls => {
                        const classTime = parseTime(cls.time);
                        return classTime === timeStart;
                      });
                      
                      if (classItem) {
                        return (
                          <td key={day} className="schedule-cell">
                            <div 
                              className="schedule-class"
                              style={{ borderLeftColor: getSubjectColor(classItem.subject) }}
                            >
                              <div className="class-subject-name">{classItem.subject}</div>
                              <div className="class-room-name">Phòng {classItem.room}</div>
                            </div>
                          </td>
                        );
                      }
                      return <td key={day} className="schedule-cell empty"></td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="schedule-legend">
          <h3>Chú thích môn học</h3>
          <div className="legend-items">
            {Object.keys(subjectColors).map(subject => (
              <div key={subject} className="legend-item">
                <span 
                  className="legend-color" 
                  style={{ backgroundColor: getSubjectColor(subject) }}
                ></span>
                <span>{subject}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScheduleView;
