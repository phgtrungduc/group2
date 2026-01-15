import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import { authService } from './authService';

// Helper function để gọi API với authentication
const fetchAPI = async (url, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...authService.getAuthHeader(),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || 'API request failed');
  }

  return result.data;
};

export const apiService = {
  // Auth
  async register(data) {
    return fetchAPI(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Students
  async getAllStudents() {
    return fetchAPI(API_ENDPOINTS.STUDENTS);
  },

  async getAllStudentsWithScores() {
    return fetchAPI(API_ENDPOINTS.STUDENTS_WITH_SCORES);
  },

  async getStudentById(id) {
    return fetchAPI(API_ENDPOINTS.STUDENT_BY_ID(id));
  },

  async updateStudent(id, data) {
    return fetchAPI(API_ENDPOINTS.STUDENT_BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteStudent(id) {
    return fetchAPI(API_ENDPOINTS.STUDENT_BY_ID(id), {
      method: 'DELETE',
    });
  },

  // Scores
  async getScoresByStudent(studentId) {
    return fetchAPI(API_ENDPOINTS.SCORES_BY_STUDENT(studentId));
  },

  async upsertScore(data) {
    return fetchAPI(API_ENDPOINTS.SCORES, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateScore(studentId, data) {
    return fetchAPI(API_ENDPOINTS.SCORES, {
      method: 'POST',
      body: JSON.stringify({
        student_id: studentId,
        subject_id: data.subject_id, // Keep as string (UUID)
        type: parseInt(data.type), // Only type is integer
        score: data.score
      }),
    });
  },

  // Subjects
  async getAllSubjects() {
    return fetchAPI(API_ENDPOINTS.SUBJECTS);
  },

  async getSubjectById(id) {
    return fetchAPI(API_ENDPOINTS.SUBJECT_BY_ID(id));
  },

  // Tests
  async getTestsByStudent(studentId) {
    return fetchAPI(API_ENDPOINTS.TESTS_BY_STUDENT(studentId));
  },

  async createTest(data) {
    return fetchAPI(API_ENDPOINTS.TESTS, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Tuition
  async getTuitionByStudent(studentId) {
    return fetchAPI(API_ENDPOINTS.TUITION_BY_STUDENT(studentId));
  },

  async addPayment(data) {
    return fetchAPI(API_ENDPOINTS.TUITION_PAYMENT, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Schedules
  async getAllSchedules() {
    return fetchAPI(API_ENDPOINTS.SCHEDULES);
  },

  async getSchedulesByYearLevel(yearLevel, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_ENDPOINTS.SCHEDULES_BY_YEAR(yearLevel)}${queryString ? `?${queryString}` : ''}`;
    return fetchAPI(url);
  },

  // Feedbacks
  async getAllFeedbacks(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_ENDPOINTS.FEEDBACKS}${queryString ? `?${queryString}` : ''}`;
    return fetchAPI(url);
  },

  async getTeachers() {
    return fetchAPI(API_ENDPOINTS.TEACHERS);
  },

  async getFeedbacksByStudent(studentId) {
    return fetchAPI(API_ENDPOINTS.FEEDBACKS_BY_STUDENT(studentId));
  },

  async getFeedbacksByTeacher(teacherId) {
    return fetchAPI(API_ENDPOINTS.FEEDBACKS_BY_TEACHER(teacherId));
  },

  async createFeedback(data) {
    return fetchAPI(API_ENDPOINTS.FEEDBACKS, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async replyFeedback(id, reply) {
    return fetchAPI(API_ENDPOINTS.FEEDBACK_REPLY(id), {
      method: 'PUT',
      body: JSON.stringify({ reply }),
    });
  },
};
