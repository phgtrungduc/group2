let appData = null;

export const loadData = async () => {
  if (appData) {
    return appData;
  }
  
  try {
    const response = await fetch('/data.json');
    appData = await response.json();
    return appData;
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu:', error);
    return null;
  }
};

export const getUsers = () => {
  return appData?.users || [];
};

export const getStudents = () => {
  return appData?.students || [];
};

export const getScores = (studentId) => {
  return appData?.scores?.[studentId] || {};
};

export const getTests = (studentId) => {
  return appData?.tests?.[studentId] || [];
};

export const getTuition = (studentId) => {
  return appData?.tuition?.[studentId] || {};
};

export const getSchedule = (studentId) => {
  return appData?.schedule?.[studentId] || {};
};

export const getFeedbacks = () => {
  return appData?.feedbacks || [];
};

export const updateData = (updates) => {
  if (!appData) return;
  
  Object.keys(updates).forEach(key => {
    if (appData[key] !== undefined) {
      if (typeof updates[key] === 'object' && !Array.isArray(updates[key])) {
        appData[key] = { ...appData[key], ...updates[key] };
      } else {
        appData[key] = updates[key];
      }
    }
  });
};

export const addStudent = (student) => {
  if (!appData) return;
  
  const newStudent = {
    id: student.id,
    name: student.name,
    studentId: student.studentId,
    email: student.email,
    year: student.year || 1
  };
  
  appData.students.push(newStudent);
  appData.users.push({
    id: student.id,
    username: student.id,
    password: student.password || "123456",
    role: "student",
    name: student.name,
    studentId: student.studentId,
    email: student.email
  });
  
  appData.scores[student.id] = {
    "Toán": 0,
    "Lý": 0,
    "Hóa": 0,
    "Văn": 0,
    "Anh": 0
  };
  
  appData.tests[student.id] = [];
  appData.tuition[student.id] = {};
  appData.schedule[student.id] = {
    "Monday": [],
    "Tuesday": [],
    "Wednesday": [],
    "Thursday": [],
    "Friday": [],
    "Saturday": []
  };
};

export const updateStudent = (studentId, updates) => {
  if (!appData) return;
  
  const studentIndex = appData.students.findIndex(s => s.id === studentId);
  if (studentIndex !== -1) {
    appData.students[studentIndex] = { ...appData.students[studentIndex], ...updates };
  }
  
  const userIndex = appData.users.findIndex(u => u.id === studentId);
  if (userIndex !== -1) {
    appData.users[userIndex] = { ...appData.users[userIndex], ...updates };
  }
};

export const deleteStudent = (studentId) => {
  if (!appData) return;
  
  appData.students = appData.students.filter(s => s.id !== studentId);
  appData.users = appData.users.filter(u => u.id !== studentId);
  delete appData.scores[studentId];
  delete appData.tests[studentId];
  delete appData.tuition[studentId];
  delete appData.schedule[studentId];
};

export const updateScore = (studentId, subject, score) => {
  if (!appData) return;
  
  if (!appData.scores[studentId]) {
    appData.scores[studentId] = {};
  }
  appData.scores[studentId][subject] = score;
};

export const addTest = (studentId, test) => {
  if (!appData) return;
  
  if (!appData.tests[studentId]) {
    appData.tests[studentId] = [];
  }
  appData.tests[studentId].push(test);
};

export const addFeedback = (feedback) => {
  if (!appData) return;
  
  appData.feedbacks.push(feedback);
};

export const replyFeedback = (feedbackId, reply) => {
  if (!appData) return;
  
  const feedback = appData.feedbacks.find(fb => fb.id === feedbackId);
  if (feedback) {
    feedback.reply = reply;
    feedback.replyDate = new Date().toISOString().split('T')[0];
    feedback.status = 'replied';
  }
};

export const getFeedbackById = (feedbackId) => {
  return appData?.feedbacks?.find(fb => fb.id === feedbackId);
};

export const updateTuition = (studentId, year, amount) => {
  if (!appData) return;
  
  if (!appData.tuition[studentId]) {
    appData.tuition[studentId] = {};
  }
  
  if (!appData.tuition[studentId][year]) {
    return;
  }
  
  const yearData = appData.tuition[studentId][year];
  const newPaid = Math.min(yearData.paid + amount, yearData.total);
  yearData.paid = newPaid;
  yearData.remaining = yearData.total - newPaid;
  
  if (yearData.remaining === 0) {
    yearData.status = 'completed';
  } else if (yearData.paid > 0) {
    yearData.status = 'partial';
  }
};

export const getData = () => {
  return appData;
};

