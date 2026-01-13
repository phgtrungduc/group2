# API Documentation - Backend Endpoints

Base URL: `http://localhost:3000/api`

All endpoints (except `/auth/login` and `/auth/register`) require JWT authentication header:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication

### POST /auth/login
Login to get JWT token
```json
Request:
{
  "username": "SV001",
  "password": "123456"
}

Response:
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "username": "SV001",
      "code": "SV001",
      "role": 2,
      "name": "Nguyễn Văn A",
      "email": "student@example.com"
    },
    "profile": { ... }
  }
}
```

### POST /auth/register
Register new user (requires authentication for role-based authorization)

---

## 👨‍🎓 Students

### GET /students
Get all students

### GET /students/:id
Get student by ID (with full user info)

### PUT /students/:id
Update student
```json
{
  "year_level": 2
}
```

### DELETE /students/:id
Delete student

---

## 📊 Scores

### GET /scores/student/:studentId
Get all scores of a student

### POST /scores
Create or update score
```json
{
  "student_id": "uuid",
  "subject_id": "uuid",
  "semester": 1,
  "year_level": 1,
  "midterm_score": 8.5,
  "final_score": 9.0
}
```

---

## 📝 Tests

### GET /tests/student/:studentId
Get all tests of a student

### POST /tests
Create new test
```json
{
  "student_id": "uuid",
  "subject_id": "uuid",
  "test_type": "midterm",
  "test_date": "2026-01-15",
  "score": 8.5,
  "max_score": 10,
  "weight": 1,
  "remarks": "Good performance"
}
```

---

## 💰 Tuition

### GET /tuition/student/:studentId
Get all tuition records of a student

### POST /tuition/payment
Add payment for tuition
```json
{
  "tuition_id": "uuid",
  "payment_amount": 400000000,
  "payment_method": "cash",
  "transaction_id": "TXN123",
  "remarks": "First payment"
}
```

---

## 📅 Schedules

### GET /schedules
Get all schedules

### GET /schedules/year-level/:yearLevel?semester=1&academic_year=2024-2025
Get schedules by year level with optional filters

---

## 💬 Feedbacks

### GET /feedbacks?student_id=uuid&status=pending
Get all feedbacks (with optional filters)

### GET /feedbacks/student/:studentId
Get feedbacks by student

### POST /feedbacks
Create new feedback
```json
{
  "student_id": "uuid",
  "subject_id": "uuid",
  "message": "Need help with calculus"
}
```

### PUT /feedbacks/:id/reply
Reply to feedback
```json
{
  "reply": "I will help you in the next class"
}
```

---

## 📱 Frontend Integration

### Import API Service
```javascript
import { apiService } from '../services/apiService';
```

### Usage Examples

**Get scores:**
```javascript
const scores = await apiService.getScoresByStudent(studentId);
```

**Create feedback:**
```javascript
await apiService.createFeedback({
  student_id: 'uuid',
  subject_id: 'uuid',
  message: 'Need help'
});
```

**Add tuition payment:**
```javascript
await apiService.addPayment({
  tuition_id: 'uuid',
  payment_amount: 400000000
});
```

---

## 🔄 Migration from data.json

Replace these dataService calls:

| Old (dataService.js) | New (apiService.js) |
|---------------------|---------------------|
| `getStudents()` | `apiService.getAllStudents()` |
| `getScores(studentId)` | `apiService.getScoresByStudent(studentId)` |
| `getTests(studentId)` | `apiService.getTestsByStudent(studentId)` |
| `getTuition(studentId)` | `apiService.getTuitionByStudent(studentId)` |
| `getSchedule(studentId)` | `apiService.getSchedulesByYearLevel(yearLevel)` |
| `getFeedbacks()` | `apiService.getAllFeedbacks()` |
| `addTest(studentId, test)` | `apiService.createTest({ student_id: studentId, ... })` |
| `addFeedback(feedback)` | `apiService.createFeedback(feedback)` |
| `replyFeedback(id, reply)` | `apiService.replyFeedback(id, reply)` |
| `updateTuition(studentId, year, amount)` | `apiService.addPayment({ tuition_id, payment_amount })` |

---

## ✅ Next Steps

1. Update FE components to use `apiService` instead of `dataService`
2. Test all API endpoints with Postman
3. Handle loading states and errors in FE
4. Remove dependency on `data.json`
