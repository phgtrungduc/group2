-- ================================================
-- SAMPLE DATA INSERT STATEMENTS
-- Student Management System
-- ================================================

USE student_management;

-- ================================================
-- Insert Subjects (already exist - for reference)
-- ================================================
-- INSERT INTO subjects (id, subject_code, subject_name) VALUES
-- ('f650652e-f051-11f0-9219-809', 'TOAN', 'Toán'),
-- ('f651ae2b-f051-11f0-9219-809', 'LY', 'Lý'),
-- ('f651ea24-f051-11f0-9219-809', 'HOA', 'Hóa'),
-- ('f651ecf2-f051-11f0-9219-8091', 'VAN', 'Văn'),
-- ('f651ee00-f051-11f0-9219-809', 'ANH', 'Anh');

-- ================================================
-- Insert Users (1 admin + 5 students + 1 teacher)
-- Password: 123456 (for all accounts) - hashed with bcrypt
-- ================================================
INSERT INTO users (username, password, role, code, name, email) VALUES
-- 1 Admin (username: admin, password: 123456)
('admin', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 1, 'AD001', 'Administrator', 'admin@rmit.edu.vn'),
-- 5 Students
('SV001', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 2, 'SV001', 'Nguyễn Văn An', 'nguyenvanan@student.edu.vn'),
('SV002', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 2, 'SV002', 'Trần Thị Bình', 'tranthibinh@student.edu.vn'),
('SV003', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 2, 'SV003', 'Lê Hoàng Cường', 'lehoangcuong@student.edu.vn'),
('SV004', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 2, 'SV004', 'Phạm Thị Dung', 'phamthidung@student.edu.vn'),
('SV005', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 2, 'SV005', 'Hoàng Văn Em', 'hoangvanem@student.edu.vn'),
-- 1 Teacher
('GV001', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 3, 'GV001', 'Nguyễn Thị Hương', 'nguyenthihuong@teacher.edu.vn');

-- ================================================
-- Insert Students (linked to 5 student users)
-- Note: Must query user_id from users table first using username/code
-- ================================================
INSERT INTO students (user_id, year_level) 
SELECT id, 1 FROM users WHERE username = 'SV001'  -- Năm 1 (Luỹ 1)
UNION ALL
SELECT id, 2 FROM users WHERE username = 'SV002'  -- Năm 2 (Luỹ 2)
UNION ALL
SELECT id, 3 FROM users WHERE username = 'SV003'  -- Năm 3 (Luỹ 3)
UNION ALL
SELECT id, 1 FROM users WHERE username = 'SV004'  -- Năm 1 (Luỹ 1)
UNION ALL
SELECT id, 2 FROM users WHERE username = 'SV005'; -- Năm 2 (Luỹ 2)

-- ================================================
-- Insert Scores for Student SV001 (Nguyễn Văn An)
-- All 5 subjects with different score types
-- Score Types: 1=midterm, 2=final, 3=quiz, 4=assignment, 5=other
-- ================================================

-- Môn Toán (TOAN)
INSERT INTO scores (student_id, subject_id, type, score) 
SELECT s.id, sub.id, 1, 8.50 FROM students s 
JOIN users u ON s.user_id = u.id 
JOIN subjects sub ON sub.subject_code = 'TOAN'
WHERE u.username = 'SV001'
UNION ALL
SELECT s.id, sub.id, 2, 9.00 FROM students s 
JOIN users u ON s.user_id = u.id 
JOIN subjects sub ON sub.subject_code = 'TOAN'
WHERE u.username = 'SV001'
UNION ALL
SELECT s.id, sub.id, 3, 8.00 FROM students s 
JOIN users u ON s.user_id = u.id 
JOIN subjects sub ON sub.subject_code = 'TOAN'
WHERE u.username = 'SV001'
UNION ALL
SELECT s.id, sub.id, 4, 9.50 FROM students s 
JOIN users u ON s.user_id = u.id 
JOIN subjects sub ON sub.subject_code = 'TOAN'
WHERE u.username = 'SV001';

-- Môn Lý (LY)
INSERT INTO scores (student_id, subject_id, type, score) 
SELECT s.id, sub.id, 1, 7.50 FROM students s 
JOIN users u ON s.user_id = u.id 
JOIN subjects sub ON sub.subject_code = 'LY'
WHERE u.username = 'SV001'
UNION ALL
SELECT s.id, sub.id, 2, 8.00 FROM students s 
JOIN users u ON s.user_id = u.id 
JOIN subjects sub ON sub.subject_code = 'LY'
WHERE u.username = 'SV001'
UNION ALL
SELECT s.id, sub.id, 3, 7.00 FROM students s 
JOIN users u ON s.user_id = u.id 
JOIN subjects sub ON sub.subject_code = 'LY'
WHERE u.username = 'SV001'
UNION ALL
SELECT s.id, sub.id, 4, 8.50 FROM students s 
JOIN users u ON s.user_id = u.id 
JOIN subjects sub ON sub.subject_code = 'LY'
WHERE u.username = 'SV001';

-- Môn Hóa (HOA)
INSERT INTO scores (student_id, subject_id, type, score) 
SELECT s.id, sub.id, 1, 9.00 FROM students s 
JOIN users u ON s.user_id = u.id 
JOIN subjects sub ON sub.subject_code = 'HOA'
WHERE u.username = 'SV001'
UNION ALL
SELECT s.id, sub.id, 2, 9.50 FROM students s 
JOIN users u ON s.user_id = u.id 
JOIN subjects sub ON sub.subject_code = 'HOA'
WHERE u.username = 'SV001'
UNION ALL
SELECT s.id, sub.id, 3, 8.50 FROM students s 
JOIN users u ON s.user_id = u.id 
JOIN subjects sub ON sub.subject_code = 'HOA'
WHERE u.username = 'SV001'
UNION ALL
SELECT s.id, sub.id, 4, 10.00 FROM students s 
JOIN users u ON s.user_id = u.id 
JOIN subjects sub ON sub.subject_code = 'HOA'
WHERE u.username = 'SV001';

-- Môn Văn (VAN)
INSERT INTO scores (student_id, subject_id, type, score) 
SELECT s.id, sub.id, 1, 8.00 FROM students s 
JOIN users u ON s.user_id = u.id 
JOIN subjects sub ON sub.subject_code = 'VAN'
WHERE u.username = 'SV001'
UNION ALL
SELECT s.id, sub.id, 2, 8.50 FROM students s 
JOIN users u ON s.user_id = u.id 
JOIN subjects sub ON sub.subject_code = 'VAN'
WHERE u.username = 'SV001'
UNION ALL
SELECT s.id, sub.id, 3, 7.50 FROM students s 
JOIN users u ON s.user_id = u.id 
JOIN subjects sub ON sub.subject_code = 'VAN'
WHERE u.username = 'SV001'
UNION ALL
SELECT s.id, sub.id, 4, 9.00 FROM students s 
JOIN users u ON s.user_id = u.id 
JOIN subjects sub ON sub.subject_code = 'VAN'
WHERE u.username = 'SV001';

-- Môn Anh (ANH)
INSERT INTO scores (student_id, subject_id, type, score) 
SELECT s.id, sub.id, 1, 9.50 FROM students s 
JOIN users u ON s.user_id = u.id 
JOIN subjects sub ON sub.subject_code = 'ANH'
WHERE u.username = 'SV001'
UNION ALL
SELECT s.id, sub.id, 2, 10.00 FROM students s 
JOIN users u ON s.user_id = u.id 
JOIN subjects sub ON sub.subject_code = 'ANH'
WHERE u.username = 'SV001'
UNION ALL
SELECT s.id, sub.id, 3, 9.00 FROM students s 
JOIN users u ON s.user_id = u.id 
JOIN subjects sub ON sub.subject_code = 'ANH'
WHERE u.username = 'SV001'
UNION ALL
SELECT s.id, sub.id, 4, 9.50 FROM students s 
JOIN users u ON s.user_id = u.id 
JOIN subjects sub ON sub.subject_code = 'ANH'
WHERE u.username = 'SV001';

-- ================================================
-- Insert Tuition for Student ID: 43f23bf2-f056-11f0-9219-8091334e7b10
-- Year 1, 2: inactive (đã qua)
-- Year 3: active (năm hiện tại)
-- ================================================
INSERT INTO tuition (student_id, year, amount, months, paid, is_active) VALUES
('43f23bf2-f056-11f0-9219-8091334e7b10', 1, 400000.00, 12, 4800000.00, FALSE),  -- Năm 1: đã hoàn thành
('43f23bf2-f056-11f0-9219-8091334e7b10', 2, 420000.00, 12, 5040000.00, FALSE),  -- Năm 2: đã hoàn thành
('43f23bf2-f056-11f0-9219-8091334e7b10', 3, 450000.00, 12, 2700000.00, TRUE);   -- Năm 3: đang học (active)

-- ================================================
-- SUMMARY
-- ================================================
-- Users created: 7 (1 admin + 5 students + 1 teacher)
-- Students created: 5
-- Scores created: 20 (1 student × 5 subjects × 4 score types)
-- Tuition records: 3 (1 student × 3 years)
-- 
-- Login credentials:
-- Admin: username=admin, password=123456
-- Students/Teacher: password=123456
-- ================================================
