# Database Schema Visualization
# Student Management System - 3-Table Design

## Quick Reference Card

### 🔑 Role Mapping
```
role = 0  →  Admin
role = 1  →  Student  →  students table
role = 2  →  Teacher  →  teachers table
```

### 📊 Table Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                     AUTHENTICATION LAYER                     │
└─────────────────────────────────────────────────────────────┘

                         ┌─────────────────┐
                         │     USERS       │  ← Login info only
                         ├─────────────────┤
                         │ id (PK)         │
                         │ username        │  SV001 / GV001
                         │ password        │  Hashed
                         │ role (INT)      │  0/1/2
                         │ name            │  Full name
                         │ email           │  Unique
                         └────────┬────────┘
                                  │
                    ┌─────────────┴──────────────┐
                    │         1 : 1              │
                    │                            │
       ┌────────────▼─────────┐     ┌───────────▼──────────┐
       │      STUDENTS        │     │      TEACHERS        │
       ├──────────────────────┤     ├──────────────────────┤
       │ id (PK)              │     │ id (PK)              │
       │ user_id (FK→users.id)│     │ user_id (FK→users.id)│
       │ student_code         │     │ teacher_code         │
       │ year_level (1/2/3)   │     │ department           │
       │ phone                │     │ specialization       │
       │ address              │     │ phone                │
       │ date_of_birth        │     │ hire_date            │
       │ enrollment_date      │     └──────────┬───────────┘
       └──────────┬───────────┘                │
                  │                            │
                  │                            │

┌─────────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER                        │
└─────────────────────────────────────────────────────────────┘

    ┌─────────────┐              ┌──────────────┐
    │  SUBJECTS   │              │  SCHEDULES   │
    ├─────────────┤              ├──────────────┤
    │ id (PK)     │◄────┐        │ id (PK)      │
    │ subject_code│     │        │ subject_id   │
    │ subject_name│     │        │ teacher_id ──┼──► teachers.id
    │ credits     │     │        │ year_level   │
    └─────────────┘     │        │ day_of_week  │
                        │        │ start_time   │
                        │        │ room         │
                        │        └──────────────┘
                        │
                        │
    ┌─────────────┐    │
    │   SCORES    │    │
    ├─────────────┤    │
    │ id (PK)     │    │
    │ student_id ─┼────┼──► students.id
    │ teacher_id ─┼────┼──► teachers.id
    │ subject_id ─┼────┘
    │ semester    │
    │ year_level  │
    │ midterm     │
    │ final       │
    │ average ★   │  ← Auto-calculated (trigger)
    │ grade ★     │  ← Auto-calculated (A/B/C/D/F)
    └─────────────┘


    ┌─────────────┐
    │    TESTS    │
    ├─────────────┤
    │ id (PK)     │
    │ student_id ─┼──► students.id
    │ teacher_id ─┼──► teachers.id
    │ subject_id ─┼──► subjects.id
    │ test_type   │  (midterm/final/quiz/project)
    │ test_date   │
    │ score       │
    └─────────────┘


    ┌─────────────┐
    │  FEEDBACKS  │
    ├─────────────┤
    │ id (PK)     │
    │ student_id ─┼──► students.id
    │ teacher_id ─┼──► teachers.id
    │ subject_id  │
    │ message     │
    │ reply       │
    │ status      │  (pending/replied/resolved)
    │ replied_at★ │  ← Auto-set (trigger)
    └─────────────┘


    ┌─────────────┐
    │   TUITION   │
    ├─────────────┤
    │ id (PK)     │
    │ student_id ─┼──► students.id
    │ year_level  │  (1/2/3)
    │ academic_yr │  (2024-2025)
    │ amount/mo   │  (400M/450M/500M)
    │ total_months│  (12)
    │ total_amount│  (4.8B/5.4B/6B)
    │ paid_amount★│  ← Auto-updated
    │ remaining★  │  ← Auto-updated
    │ status★     │  ← Auto-updated (trigger)
    └──────┬──────┘
           │
           │ 1 : N
           │
    ┌──────▼──────────┐
    │ TUITION_PAYMENTS│
    ├─────────────────┤
    │ id (PK)         │
    │ tuition_id (FK) │
    │ payment_amount  │
    │ payment_date    │
    │ payment_method  │
    │ transaction_id  │
    └─────────────────┘
```

## Data Flow Examples

### 1. Student Login Flow
```
┌──────────┐     ┌───────────┐     ┌────────────┐
│ Frontend │────►│   users   │────►│  students  │
└──────────┘     │ (auth)    │     │ (profile)  │
                 └───────────┘     └────────────┘
                 username/pwd      JOIN user_id
                 role = 1          get details
```

### 2. Teacher Login Flow
```
┌──────────┐     ┌───────────┐     ┌────────────┐
│ Frontend │────►│   users   │────►│  teachers  │
└──────────┘     │ (auth)    │     │ (profile)  │
                 └───────────┘     └────────────┘
                 username/pwd      JOIN user_id
                 role = 2          get details
```

### 3. Add Score Flow
```
┌──────────┐     ┌───────────┐     ┌────────────┐
│ Teacher  │────►│   scores  │────►│  Trigger   │
└──────────┘     │ INSERT    │     │ calculate  │
                 └───────────┘     └────────────┘
                 midterm/final     average/grade
```

### 4. Payment Flow
```
┌──────────┐     ┌──────────────┐     ┌───────────┐     ┌──────────┐
│ Student  │────►│   tuition    │────►│  Trigger  │────►│ tuition  │
└──────────┘     │   payments   │     │  update   │     │ (update) │
                 └──────────────┘     └───────────┘     └──────────┘
                 INSERT payment       sum paid_amt      update status
```

## Tuition Pricing Table

| Year Level | Per Month | Total (12 months) | Status After Payment |
|------------|-----------|-------------------|----------------------|
| Year 1     | 400M VND  | 4,800M VND (4.8B) | pending → partial → completed |
| Year 2     | 450M VND  | 5,400M VND (5.4B) | pending → partial → completed |
| Year 3     | 500M VND  | 6,000M VND (6.0B) | pending → partial → completed |

## Index Strategy

### users table:
- PRIMARY: `id`
- UNIQUE: `username`, `email`
- INDEX: `role`

### students table:
- PRIMARY: `id`
- UNIQUE: `user_id`, `student_code`
- INDEX: `year_level`

### teachers table:
- PRIMARY: `id`
- UNIQUE: `user_id`, `teacher_code`
- INDEX: `department`

### scores table:
- PRIMARY: `id`
- INDEX: `student_id`, `teacher_id`, `subject_id`
- INDEX: `year_level`, `semester`

### tuition table:
- PRIMARY: `id`
- INDEX: `student_id`, `academic_year`, `status`

## Views Quick Reference

### view_students_full
```sql
-- Combines users + students
SELECT s.id, s.student_code, u.username, u.name, u.email, s.year_level
FROM students s JOIN users u ON s.user_id = u.id;
```

### view_teachers_full
```sql
-- Combines users + teachers
SELECT t.id, t.teacher_code, u.username, u.name, u.email, t.department
FROM teachers t JOIN users u ON t.user_id = u.id;
```

### view_student_gpa
```sql
-- Student average scores
SELECT s.student_code, u.name, AVG(sc.average_score) AS gpa
FROM students s 
JOIN users u ON s.user_id = u.id
LEFT JOIN scores sc ON s.id = sc.student_id
GROUP BY s.id;
```

### view_tuition_summary
```sql
-- Tuition overview
SELECT s.student_code, u.name, t.total_amount, t.paid_amount, t.status
FROM tuition t
JOIN students s ON t.student_id = s.id
JOIN users u ON s.user_id = u.id;
```

## Common Queries

### Get all students in year 1:
```sql
SELECT * FROM view_students_full WHERE year_level = 1;
```

### Get student's scores:
```sql
SELECT s.student_code, u.name, subj.subject_name, 
       sc.midterm_score, sc.final_score, sc.average_score, sc.grade
FROM students s
JOIN users u ON s.user_id = u.id
JOIN scores sc ON s.id = sc.student_id
JOIN subjects subj ON sc.subject_id = subj.id
WHERE s.id = 'student1';
```

### Get teacher's schedule:
```sql
SELECT t.teacher_code, u.name, subj.subject_name,
       sch.day_of_week, sch.start_time, sch.room
FROM teachers t
JOIN users u ON t.user_id = u.id
JOIN schedules sch ON t.id = sch.teacher_id
JOIN subjects subj ON sch.subject_id = subj.id
WHERE t.id = 'teacher1';
```

### Get unpaid tuition:
```sql
SELECT * FROM view_tuition_summary 
WHERE status IN ('pending', 'partial')
ORDER BY academic_year, year_level;
```

---

**Note**: All foreign keys use CASCADE on delete except for optional references (like created_by) which use SET NULL.
