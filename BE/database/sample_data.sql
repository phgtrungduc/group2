-- ================================================
-- SAMPLE DATA FOR STUDENT MANAGEMENT SYSTEM
-- Uses 3-table design: users + students + teachers
-- ================================================

USE student_management;

-- ================================================
-- 1. Insert Users (Authentication data)
-- ================================================

-- Teachers (role = 2)
INSERT INTO users (id, username, password, role, name, email) VALUES
('teacher1', 'GV001', '$2a$10$xZ8yHzE5LhJKhZmGqYqZxOwN8K3yHzE5LhJKhZmGqYqZxOwN8K3yH', 2, 'Thầy Nguyễn Văn Giáo', 'teacher1@gmail.com'),
('teacher2', 'GV002', '$2a$10$xZ8yHzE5LhJKhZmGqYqZxOwN8K3yHzE5LhJKhZmGqYqZxOwN8K3yH', 2, 'Cô Trần Thị Hoa', 'teacher2@gmail.com'),
('teacher3', 'GV003', '$2a$10$xZ8yHzE5LhJKhZmGqYqZxOwN8K3yHzE5LhJKhZmGqYqZxOwN8K3yH', 2, 'Thầy Lê Minh Đức', 'teacher3@gmail.com');

-- Students (role = 1)
INSERT INTO users (id, username, password, role, name, email) VALUES
('student1', 'SV001', '$2a$10$xZ8yHzE5LhJKhZmGqYqZxOwN8K3yHzE5LhJKhZmGqYqZxOwN8K3yH', 1, 'Nguyễn Văn An', 'student1@gmail.com'),
('student2', 'SV002', '$2a$10$xZ8yHzE5LhJKhZmGqYqZxOwN8K3yHzE5LhJKhZmGqYqZxOwN8K3yH', 1, 'Trần Thị Bình', 'student2@gmail.com'),
('student3', 'SV003', '$2a$10$xZ8yHzE5LhJKhZmGqYqZxOwN8K3yHzE5LhJKhZmGqYqZxOwN8K3yH', 1, 'Lê Văn Cường', 'student3@gmail.com'),
('student4', 'SV004', '$2a$10$xZ8yHzE5LhJKhZmGqYqZxOwN8K3yHzE5LhJKhZmGqYqZxOwN8K3yH', 1, 'Phạm Thị Dung', 'student4@gmail.com');

-- Admin (role = 0)
INSERT INTO users (id, username, password, role, name, email) VALUES
('admin1', 'admin', '$2a$10$xZ8yHzE5LhJKhZmGqYqZxOwN8K3yHzE5LhJKhZmGqYqZxOwN8K3yH', 0, 'Administrator', 'admin@gmail.com');

-- ================================================
-- 2. Insert Teachers (Teacher-specific data)
-- ================================================
INSERT INTO teachers (id, user_id, teacher_code, department, specialization, phone, hire_date) VALUES
('teacher1', 'teacher1', 'GV001', 'Khoa Công Nghệ Thông Tin', 'Lập trình', '0987654321', '2020-01-15'),
('teacher2', 'teacher2', 'GV002', 'Khoa Toán', 'Toán ứng dụng', '0987654322', '2019-03-20'),
('teacher3', 'teacher3', 'GV003', 'Khoa Công Nghệ Thông Tin', 'Trí tuệ nhân tạo', '0987654323', '2021-06-10');

-- ================================================
-- 3. Insert Students (Student-specific data)
-- ================================================
INSERT INTO students (id, user_id, student_code, year_level, phone, address, date_of_birth, enrollment_date) VALUES
('student1', 'student1', 'SV001', 1, '0123456789', '123 Đường ABC, Hà Nội', '2003-05-15', '2024-09-01'),
('student2', 'student2', 'SV002', 2, '0123456790', '456 Đường XYZ, Hồ Chí Minh', '2002-08-20', '2023-09-01'),
('student3', 'student3', 'SV003', 1, '0123456791', '789 Đường DEF, Đà Nẵng', '2003-11-10', '2024-09-01'),
('student4', 'student4', 'SV004', 3, '0123456792', '321 Đường GHI, Hải Phòng', '2001-03-25', '2022-09-01');

-- ================================================
-- 4. Insert Subjects
-- ================================================
INSERT INTO subjects (id, subject_code, subject_name, credits, description) VALUES
('subj-001', 'IT101', 'Lập trình cơ bản', 3, 'Môn học về lập trình cơ bản với C/C++'),
('subj-002', 'IT102', 'Cơ sở dữ liệu', 3, 'Môn học về thiết kế và quản trị cơ sở dữ liệu'),
('subj-003', 'MATH101', 'Toán cao cấp 1', 4, 'Môn toán cao cấp phần giải tích'),
('subj-004', 'MATH102', 'Toán rời rạc', 3, 'Toán học rời rạc và ứng dụng'),
('subj-005', 'IT201', 'Lập trình hướng đối tượng', 3, 'OOP với Java/C++'),
('subj-006', 'IT202', 'Cấu trúc dữ liệu và giải thuật', 4, 'Data structures và Algorithms'),
('subj-007', 'IT301', 'Phát triển ứng dụng Web', 4, 'Web development với modern frameworks'),
('subj-008', 'IT302', 'Trí tuệ nhân tạo', 3, 'Artificial Intelligence và Machine Learning');

-- ================================================
-- 5. Insert Scores (Điểm của học sinh)
-- ================================================
INSERT INTO scores (id, student_id, subject_id, semester, year_level, midterm_score, final_score, teacher_id) VALUES
('score-001', 'student1', 'subj-001', 1, 1, 8.5, 9.0, 'teacher1'),
('score-002', 'student1', 'subj-003', 1, 1, 7.0, 7.5, 'teacher2'),
('score-003', 'student2', 'subj-005', 1, 2, 7.5, 8.0, 'teacher1'),
('score-004', 'student2', 'subj-004', 2, 2, 8.0, 8.5, 'teacher2'),
('score-005', 'student3', 'subj-001', 1, 1, 9.0, 9.0, 'teacher1'),
('score-006', 'student3', 'subj-003', 1, 1, 8.5, 9.0, 'teacher2'),
('score-007', 'student4', 'subj-007', 1, 3, 8.0, 8.5, 'teacher1'),
('score-008', 'student4', 'subj-008', 1, 3, 7.5, 8.0, 'teacher3');

-- ================================================
-- 6. Insert Tuition (Học phí theo năm)
-- ================================================

-- Năm 1: 400 triệu x 12 tháng = 4.8 tỷ
INSERT INTO tuition (id, student_id, year_level, academic_year, amount_per_month, total_months, total_amount, paid_amount, remaining_amount, status) VALUES
('tuit-001', 'student1', 1, '2024-2025', 400000000, 12, 4800000000, 2400000000, 2400000000, 'partial'),
('tuit-002', 'student3', 1, '2024-2025', 400000000, 12, 4800000000, 0, 4800000000, 'pending');

-- Năm 2: 450 triệu x 12 tháng = 5.4 tỷ
INSERT INTO tuition (id, student_id, year_level, academic_year, amount_per_month, total_months, total_amount, paid_amount, remaining_amount, status) VALUES
('tuit-003', 'student2', 2, '2024-2025', 450000000, 12, 5400000000, 2700000000, 2700000000, 'partial'),
('tuit-004', 'student2', 1, '2023-2024', 400000000, 12, 4800000000, 4800000000, 0, 'completed');

-- Năm 3: 500 triệu x 12 tháng = 6 tỷ
INSERT INTO tuition (id, student_id, year_level, academic_year, amount_per_month, total_months, total_amount, paid_amount, remaining_amount, status) VALUES
('tuit-005', 'student4', 3, '2024-2025', 500000000, 12, 6000000000, 3000000000, 3000000000, 'partial'),
('tuit-006', 'student4', 2, '2023-2024', 450000000, 12, 5400000000, 5400000000, 0, 'completed'),
('tuit-007', 'student4', 1, '2022-2023', 400000000, 12, 4800000000, 4800000000, 0, 'completed');

-- ================================================
-- 7. Insert Tuition Payments (Lịch sử đóng học phí)
-- ================================================
INSERT INTO tuition_payments (id, tuition_id, payment_amount, payment_date, payment_method, transaction_id) VALUES
('pay-001', 'tuit-001', 400000000, '2024-09-15 10:00:00', 'bank_transfer', 'TXN20240915001'),
('pay-002', 'tuit-001', 400000000, '2024-10-15 10:00:00', 'bank_transfer', 'TXN20241015001'),
('pay-003', 'tuit-001', 400000000, '2024-11-15 10:00:00', 'bank_transfer', 'TXN20241115001'),
('pay-004', 'tuit-001', 400000000, '2024-12-15 10:00:00', 'bank_transfer', 'TXN20241215001'),
('pay-005', 'tuit-001', 400000000, '2025-01-10 10:00:00', 'bank_transfer', 'TXN20250110001'),
('pay-006', 'tuit-001', 400000000, '2026-01-10 10:00:00', 'bank_transfer', 'TXN20260110001'),
('pay-007', 'tuit-003', 450000000, '2024-09-20 14:30:00', 'bank_transfer', 'TXN20240920001'),
('pay-008', 'tuit-003', 450000000, '2024-10-20 14:30:00', 'bank_transfer', 'TXN20241020001'),
('pay-009', 'tuit-003', 450000000, '2024-11-20 14:30:00', 'bank_transfer', 'TXN20241120001'),
('pay-010', 'tuit-003', 450000000, '2024-12-20 14:30:00', 'bank_transfer', 'TXN20241220001'),
('pay-011', 'tuit-003', 450000000, '2025-01-10 14:30:00', 'bank_transfer', 'TXN20250110001'),
('pay-012', 'tuit-003', 450000000, '2026-01-10 14:30:00', 'bank_transfer', 'TXN20260110001'),
('pay-013', 'tuit-005', 500000000, '2024-09-25 09:00:00', 'bank_transfer', 'TXN20240925001'),
('pay-014', 'tuit-005', 500000000, '2024-10-25 09:00:00', 'bank_transfer', 'TXN20241025001'),
('pay-015', 'tuit-005', 500000000, '2024-11-25 09:00:00', 'bank_transfer', 'TXN20241125001'),
('pay-016', 'tuit-005', 500000000, '2024-12-25 09:00:00', 'bank_transfer', 'TXN20241225001'),
('pay-017', 'tuit-005', 500000000, '2025-01-13 09:00:00', 'bank_transfer', 'TXN20250113001'),
('pay-018', 'tuit-005', 500000000, '2026-01-12 09:00:00', 'bank_transfer', 'TXN20260112001');

-- ================================================
-- 8. Insert Tests (Bài kiểm tra)
-- ================================================
INSERT INTO tests (id, student_id, subject_id, test_type, test_date, score, teacher_id) VALUES
('test-001', 'student1', 'subj-001', 'midterm', '2024-10-15', 8.5, 'teacher1'),
('test-002', 'student1', 'subj-001', 'final', '2024-12-20', 9.0, 'teacher1'),
('test-003', 'student2', 'subj-005', 'midterm', '2024-10-20', 7.5, 'teacher1'),
('test-004', 'student2', 'subj-005', 'final', '2024-12-22', 8.0, 'teacher1'),
('test-005', 'student3', 'subj-001', 'quiz', '2024-10-10', 9.0, 'teacher1'),
('test-006', 'student4', 'subj-007', 'project', '2024-11-30', 8.5, 'teacher1');

-- ================================================
-- 9. Insert Feedbacks (Phản ánh học sinh)
-- ================================================
INSERT INTO feedbacks (id, student_id, teacher_id, subject_id, message, reply, status, replied_at) VALUES
('fb-001', 'student1', 'teacher1', 'subj-001', 'Thầy giảng rất hay và dễ hiểu', 'Cảm ơn em, thầy sẽ cố gắng hơn nữa', 'replied', '2024-11-15 10:30:00'),
('fb-002', 'student2', 'teacher2', 'subj-004', 'Cô có thể giải thích thêm phần đồ thị được không?', 'Được em, cô sẽ tổ chức buổi học thêm', 'replied', '2024-11-16 14:00:00'),
('fb-003', 'student3', 'teacher1', 'subj-001', 'Em muốn học thêm về con trỏ trong C++', NULL, 'pending', NULL),
('fb-004', 'student4', 'teacher3', 'subj-008', 'Môn AI rất thú vị, em muốn nghiên cứu sâu hơn', 'Tuyệt vời! Thầy sẽ gửi em tài liệu tham khảo', 'replied', '2024-12-01 09:00:00');

-- ================================================
-- 10. Insert Schedules (Lịch học)
-- ================================================
INSERT INTO schedules (id, subject_id, teacher_id, year_level, day_of_week, start_time, end_time, room, semester, academic_year, is_active) VALUES
('sch-001', 'subj-001', 'teacher1', 1, 'Monday', '08:00:00', '10:00:00', 'A101', 1, '2024-2025', TRUE),
('sch-002', 'subj-001', 'teacher1', 1, 'Wednesday', '08:00:00', '10:00:00', 'A101', 1, '2024-2025', TRUE),
('sch-003', 'subj-003', 'teacher2', 1, 'Tuesday', '13:00:00', '15:00:00', 'B205', 1, '2024-2025', TRUE),
('sch-004', 'subj-003', 'teacher2', 1, 'Thursday', '13:00:00', '15:00:00', 'B205', 1, '2024-2025', TRUE),
('sch-005', 'subj-005', 'teacher1', 2, 'Monday', '10:15:00', '12:15:00', 'A102', 1, '2024-2025', TRUE),
('sch-006', 'subj-005', 'teacher1', 2, 'Friday', '08:00:00', '10:00:00', 'A102', 1, '2024-2025', TRUE),
('sch-007', 'subj-007', 'teacher1', 3, 'Tuesday', '08:00:00', '11:00:00', 'LAB-301', 1, '2024-2025', TRUE),
('sch-008', 'subj-008', 'teacher3', 3, 'Thursday', '08:00:00', '11:00:00', 'LAB-302', 1, '2024-2025', TRUE);

-- ================================================
-- DATA SUMMARY
-- ================================================
-- Users: 8 (1 admin, 3 teachers, 4 students)
-- Students: 4 (Year 1: 2, Year 2: 1, Year 3: 1)
-- Teachers: 3
-- Subjects: 8
-- Scores: 8 records
-- Tuition: 7 records
-- Tuition Payments: 18 payments
-- Tests: 6 records
-- Feedbacks: 4 records
-- Schedules: 8 schedules
-- ================================================
