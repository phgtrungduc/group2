# Database Design - Student Management System
## University of Technology and Management
## 🎯 **3-Table Normalized Design**

## 📐 Thiết kế tổng quan

Hệ thống sử dụng **3 bảng chính** để quản lý users:
1. **users** - Thông tin đăng nhập chung
2. **students** - Thông tin riêng của học sinh
3. **teachers** - Thông tin riêng của giáo viên

### Lý do thiết kế 3 bảng:
- ✅ **Học sinh** và **giáo viên** có thông tin khác nhau hoàn toàn
- ✅ Học sinh: `year_level`, `enrollment_date`, `student_code`, `date_of_birth`
- ✅ Giáo viên: `department`, `specialization`, `teacher_code`, `hire_date`
- ✅ Tránh nullable fields trong single table
- ✅ Dễ mở rộng thêm thông tin riêng cho từng role

## 📊 Cấu trúc bảng chính

### 1. USERS - Thông tin đăng nhập
```sql
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,    -- SV001, GV001
    password VARCHAR(255) NOT NULL,
    role INT NOT NULL,                       -- 0=admin, 1=student, 2=teacher
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
);
```

### 2. STUDENTS - Thông tin học sinh
```sql
CREATE TABLE students (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE,     -- FK -> users.id
    student_code VARCHAR(20) NOT NULL UNIQUE,
    year_level INT NOT NULL CHECK (year_level BETWEEN 1 AND 3),
    phone VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    enrollment_date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 3. TEACHERS - Thông tin giáo viên
```sql
CREATE TABLE teachers (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE,     -- FK -> users.id
    teacher_code VARCHAR(20) NOT NULL UNIQUE,
    department VARCHAR(100),
    specialization VARCHAR(100),
    phone VARCHAR(20),
    hire_date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 🔑 Role Values

| Role | Value | Description |
|------|-------|-------------|
| Admin | `0` | Quản trị viên |
| Student | `1` | Học sinh |
| Teacher | `2` | Giáo viên |

## 📝 Ví dụ dữ liệu

### Student Example:
```json
// users table
{
  "id": "student1",
  "username": "SV001",
  "password": "$2a$10$...",
  "role": 1,
  "name": "Nguyễn Văn An",
  "email": "student1@gmail.com"
}

// students table
{
  "id": "student1",
  "user_id": "student1",
  "student_code": "SV001",
  "year_level": 1,
  "phone": "0123456789",
  "address": "123 Đường ABC, Hà Nội",
  "date_of_birth": "2003-05-15",
  "enrollment_date": "2024-09-01"
}
```

### Teacher Example:
```json
// users table
{
  "id": "teacher1",
  "username": "GV001",
  "password": "$2a$10$...",
  "role": 2,
  "name": "Thầy Nguyễn Văn Giáo",
  "email": "teacher1@gmail.com"
}

// teachers table
{
  "id": "teacher1",
  "user_id": "teacher1",
  "teacher_code": "GV001",
  "department": "Khoa Công Nghệ Thông Tin",
  "specialization": "Lập trình",
  "phone": "0987654321",
  "hire_date": "2020-01-15"
}
```

## 📊 ERD (Entity Relationship Diagram)

```
                    ┌──────────────────┐
                    │      USERS       │
                    │   (Login info)   │
                    ├──────────────────┤
                    │ id (PK)          │
                    │ username         │
                    │ password         │
                    │ role (INT)       │
                    │ name             │
                    │ email            │
                    └────┬─────────────┘
                         │
                         │ 1:1
         ┌───────────────┼───────────────┐
         │                               │
         │                               │
    ┌────▼────────┐              ┌──────▼──────┐
    │  STUDENTS   │              │  TEACHERS   │
    ├─────────────┤              ├─────────────┤
    │ id (PK)     │              │ id (PK)     │
    │ user_id(FK) │              │ user_id(FK) │
    │ student_code│              │ teacher_code│
    │ year_level  │              │ department  │
    │ phone       │              │ special...  │
    │ address     │              │ phone       │
    │ birth_date  │              │ hire_date   │
    │ enroll_date │              └──────┬──────┘
    └─────┬───────┘                     │
          │                             │
          │                             │
     ┌────▼────┐   ┌──────────┐   ┌────▼────┐
     │ SCORES  │   │ SUBJECTS │   │SCHEDULES│
     ├─────────┤   └──────────┘   └─────────┘
     │student_id                   teacher_id
     │teacher_id
     │subject_id
     │scores
     └─────┬───┘
           │
      ┌────▼────┐   ┌───────────┐
      │  TESTS  │   │ FEEDBACKS │
      ├─────────┤   ├───────────┤
      │student_id   │student_id
      │teacher_id   │teacher_id
      └─────────┘   └───────────┘
      
      ┌──────────┐
      │ TUITION  │
      ├──────────┤
      │student_id
      │year_level
      │total/paid
      └────┬─────┘
           │
      ┌────▼────────┐
      │  PAYMENTS   │
      └─────────────┘
```

## 📋 Các bảng trong hệ thống

### 1. **USERS** - Đăng nhập
- Chứa thông tin chung cho tất cả users
- `role` (INT): 0=admin, 1=student, 2=teacher
- `username`: SV001 (student), GV001 (teacher)

### 2. **STUDENTS** - Học sinh
- 1:1 với users qua `user_id`
- Thông tin riêng: mã SV, năm học, ngày nhập học
- Foreign key CASCADE: Xóa user → xóa student

### 3. **TEACHERS** - Giáo viên
- 1:1 với users qua `user_id`
- Thông tin riêng: mã GV, khoa, chuyên môn, ngày thuê
- Foreign key CASCADE: Xóa user → xóa teacher

### 4. **SUBJECTS** - Môn học
- Các môn học trong chương trình
- IT101, MATH101, etc.

### 5. **SCORES** - Điểm số
- FK: `student_id` → students.id
- FK: `teacher_id` → teachers.id
- FK: `subject_id` → subjects.id
- Trigger: Tự động tính `average_score` và `grade`

### 6. **TESTS** - Bài kiểm tra
- FK: `student_id` → students.id
- FK: `teacher_id` → teachers.id
- Loại: midterm, final, quiz, project

### 7. **TUITION** - Học phí
- FK: `student_id` → students.id
- **Năm 1**: 400tr/tháng × 12 = 4.8 tỷ
- **Năm 2**: 450tr/tháng × 12 = 5.4 tỷ
- **Năm 3**: 500tr/tháng × 12 = 6 tỷ
- Status: pending, partial, completed

### 8. **TUITION_PAYMENTS** - Lịch sử đóng phí
- FK: `tuition_id` → tuition.id
- Trigger: Tự động cập nhật `paid_amount` và `status`

### 9. **FEEDBACKS** - Phản ánh
- FK: `student_id` → students.id
- FK: `teacher_id` → teachers.id
- Học sinh gửi phản ánh, giáo viên trả lời
- Trigger: Tự động set `replied_at` khi có reply

### 10. **SCHEDULES** - Lịch học
- FK: `subject_id` → subjects.id
- FK: `teacher_id` → teachers.id
- Thứ, giờ học, phòng học, học kỳ

## 🔍 Views (Các view hữu ích)

### view_students_full
Kết hợp thông tin từ users và students:
```sql
SELECT s.id, s.student_code, u.username, u.name, u.email, 
       s.year_level, s.phone, s.address
FROM students s
JOIN users u ON s.user_id = u.id;
```

### view_teachers_full
Kết hợp thông tin từ users và teachers:
```sql
SELECT t.id, t.teacher_code, u.username, u.name, u.email,
       t.department, t.specialization, t.phone
FROM teachers t
JOIN users u ON t.user_id = u.id;
```

### view_student_gpa
Điểm trung bình của học sinh:
```sql
SELECT s.student_code, u.name, s.year_level,
       ROUND(AVG(sc.average_score), 2) AS gpa
FROM students s
JOIN users u ON s.user_id = u.id
LEFT JOIN scores sc ON s.id = sc.student_id
GROUP BY s.id;
```

### view_tuition_summary
Tổng quan học phí:
```sql
SELECT s.student_code, u.name, t.year_level, t.academic_year,
       t.total_amount, t.paid_amount, t.remaining_amount, t.status
FROM tuition t
JOIN students s ON t.student_id = s.id
JOIN users u ON s.user_id = u.id;
```

## 🔧 Stored Procedures

### sp_add_student
Thêm học sinh mới (INSERT vào cả users và students):
```sql
CALL sp_add_student(
    'SV005',                    -- username
    'password',                 -- password
    'Nguyễn Văn E',            -- name
    'student5@gmail.com',      -- email
    'SV005',                   -- student_code
    1,                         -- year_level
    '0123456793',              -- phone
    'Address',                 -- address
    '2003-06-15'               -- date_of_birth
);
```

### sp_add_teacher
Thêm giáo viên mới (INSERT vào cả users và teachers):
```sql
CALL sp_add_teacher(
    'GV004',                   -- username
    'password',                -- password
    'Giáo viên 4',            -- name
    'teacher4@gmail.com',     -- email
    'GV004',                  -- teacher_code
    'Khoa Vật lý',            -- department
    'Vật lý lượng tử',        -- specialization
    '0987654324'              -- phone
);
```

### sp_create_tuition
Tạo học phí cho năm học mới:
```sql
CALL sp_create_tuition('student1', 2, '2025-2026');
```

## ⚡ Triggers

### calculate_average_score
Tự động tính điểm TB và xếp loại khi cập nhật scores:
- `average_score` = midterm × 0.4 + final × 0.6
- Grade: A (≥8.5), B (≥7.0), C (≥5.5), D (≥4.0), F (<4.0)

### update_tuition_after_payment
Tự động cập nhật học phí khi có payment mới:
- Cập nhật `paid_amount`
- Tính `remaining_amount`
- Thay đổi `status`: pending → partial → completed

### update_feedback_replied_at
Tự động set thời gian trả lời feedback:
- Set `replied_at` = CURRENT_TIMESTAMP
- Đổi `status` = 'replied'

## 📁 Files

- `schema.sql` - Định nghĩa cấu trúc database
- `sample_data.sql` - Dữ liệu mẫu
- `README.md` - Tài liệu này

## 🚀 Usage

### 1. Tạo database:
```bash
mysql -u root -p < schema.sql
```

### 2. Thêm dữ liệu mẫu:
```bash
mysql -u root -p < sample_data.sql
```

### 3. Query ví dụ:

**Lấy tất cả học sinh:**
```sql
SELECT * FROM view_students_full;
```

**Lấy tất cả giáo viên:**
```sql
SELECT * FROM view_teachers_full;
```

**Lấy điểm của một học sinh:**
```sql
SELECT s.student_code, u.name, subj.subject_name, 
       sc.midterm_score, sc.final_score, sc.average_score, sc.grade
FROM students s
JOIN users u ON s.user_id = u.id
JOIN scores sc ON s.id = sc.student_id
JOIN subjects subj ON sc.subject_id = subj.id
WHERE s.student_code = 'SV001';
```

**Lấy học phí chưa đóng:**
```sql
SELECT * FROM view_tuition_summary 
WHERE status IN ('pending', 'partial');
```

## 💡 Best Practices

### Authentication:
```javascript
// Login - Query users table only
const user = await db.query(
  'SELECT * FROM users WHERE username = ? AND password = ?',
  [username, password]
);

if (user.role === 1) {
  // Student - Join với students table
  const studentInfo = await db.query(`
    SELECT s.*, u.name, u.email 
    FROM students s 
    JOIN users u ON s.user_id = u.id 
    WHERE u.id = ?
  `, [user.id]);
} else if (user.role === 2) {
  // Teacher - Join với teachers table
  const teacherInfo = await db.query(`
    SELECT t.*, u.name, u.email 
    FROM teachers t 
    JOIN users u ON t.user_id = u.id 
    WHERE u.id = ?
  `, [user.id]);
}
```

### Create Student:
```javascript
// Transaction: INSERT vào cả 2 bảng
const userId = uuid();
const studentId = uuid();

await db.query('START TRANSACTION');

await db.query(
  'INSERT INTO users (id, username, password, role, name, email) VALUES (?, ?, ?, 1, ?, ?)',
  [userId, username, password, name, email]
);

await db.query(
  'INSERT INTO students (id, user_id, student_code, year_level, phone, address, date_of_birth, enrollment_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
  [studentId, userId, studentCode, yearLevel, phone, address, dob, enrollDate]
);

await db.query('COMMIT');
```

## 🎯 Migration từ Single-table

Nếu bạn có database cũ với single `users` table:

```sql
-- 1. Tạo bảng students và teachers
CREATE TABLE students (...);
CREATE TABLE teachers (...);

-- 2. Migrate students
INSERT INTO students (id, user_id, student_code, year_level, ...)
SELECT id, id, code, year_level, ...
FROM users WHERE role = 1;

-- 3. Migrate teachers
INSERT INTO teachers (id, user_id, teacher_code, ...)
SELECT id, id, code, ...
FROM users WHERE role = 2;

-- 4. Drop unused columns
ALTER TABLE users 
DROP COLUMN code,
DROP COLUMN year_level;
```

## 📊 Sample Data Overview

- **Users**: 8 (1 admin + 3 teachers + 4 students)
- **Students**: 4 (Năm 1: 2, Năm 2: 1, Năm 3: 1)
- **Teachers**: 3
- **Subjects**: 8
- **Scores**: 8 records
- **Tuition**: 7 records
- **Payments**: 18 payments
- **Tests**: 6 records
- **Feedbacks**: 4 records
- **Schedules**: 8 schedules

## 🎓 Conclusion

Thiết kế 3-table này:
- ✅ Tách biệt rõ ràng thông tin đăng nhập và thông tin chi tiết
- ✅ Dễ mở rộng thêm fields cho students/teachers
- ✅ Tránh nullable fields
- ✅ Performance tốt với proper indexes
- ✅ Maintainable và scalable

---

**Created**: January 2026  
**Database**: MySQL 8.0+  
**Charset**: utf8mb4_unicode_ci
