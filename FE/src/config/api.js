export const API_BASE_URL = 'http://localhost:3000/api';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  
  // Students
  STUDENTS: '/students',
  STUDENTS_WITH_SCORES: '/students/with-scores',
  STUDENT_BY_ID: (id) => `/students/${id}`,
  
  // Scores
  SCORES_BY_STUDENT: (studentId) => `/scores/student/${studentId}`,
  SCORES: '/scores',
  
  // Tests
  TESTS_BY_STUDENT: (studentId) => `/tests/student/${studentId}`,
  TESTS: '/tests',
  
  // Tuition
  TUITION_BY_STUDENT: (studentId) => `/tuition/student/${studentId}`,
  TUITION_PAYMENT: '/tuition/payment',
  
  // Schedules
  SCHEDULES: '/schedules',
  SCHEDULES_BY_YEAR: (yearLevel) => `/schedules/year-level/${yearLevel}`,
  
  // Feedbacks
  FEEDBACKS: '/feedbacks',
  TEACHERS: '/feedbacks/teachers',
  FEEDBACKS_BY_STUDENT: (studentId) => `/feedbacks/student/${studentId}`,
  FEEDBACK_REPLY: (id) => `/feedbacks/${id}/reply`,
};
