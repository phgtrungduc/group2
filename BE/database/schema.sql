-- ================================================
-- STUDENT MANAGEMENT SYSTEM - MySQL Database Schema
-- University of Technology and Management
-- Design: 3 Tables (users, students, teachers)
-- ================================================

-- Drop existing database if exists
DROP DATABASE IF EXISTS student_management;

-- Create database
CREATE DATABASE student_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE student_management;

-- ================================================
-- Table: users
-- Thông tin tài khoản đăng nhập chung
-- ================================================
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE COMMENT 'SV001, GV001',
    password VARCHAR(255) NOT NULL,
    role INT NOT NULL COMMENT '1=admin, 2=student, 3=teacher',
    code VARCHAR(20) COMMENT 'Mã: SV001, GV001, AD001',
    name VARCHAR(100) NOT NULL COMMENT 'Tên đầy đủ',
    email VARCHAR(100) NOT NULL UNIQUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_username (username),
    INDEX idx_code (code),
    INDEX idx_role (role),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Table: students
-- Thông tin riêng của học sinh
-- ================================================
CREATE TABLE students (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE,
    year_level INT NOT NULL COMMENT 'Năm học: 1, 2, 3',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_year_level (year_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Table: subjects
-- Danh mục môn học
-- ================================================
CREATE TABLE subjects (
    id VARCHAR(36) PRIMARY KEY,
    subject_code VARCHAR(20) NOT NULL UNIQUE COMMENT 'Mã môn học',
    subject_name VARCHAR(100) NOT NULL COMMENT 'Tên môn học',
    credits INT NOT NULL DEFAULT 3 COMMENT 'Số tín chỉ',
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_subject_code (subject_code),
    INDEX idx_subject_name (subject_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Table: scores
-- Điểm số của học sinh theo môn học
-- ================================================
CREATE TABLE scores (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL COMMENT 'students.id',
    subject_id VARCHAR(36) NOT NULL,
    semester INT NOT NULL CHECK (semester BETWEEN 1 AND 2) COMMENT 'Học kỳ',
    year_level INT NOT NULL CHECK (year_level BETWEEN 1 AND 3) COMMENT 'Năm học: 1, 2, 3',
    midterm_score DECIMAL(4,2) CHECK (midterm_score BETWEEN 0 AND 10) COMMENT 'Điểm giữa kỳ',
    final_score DECIMAL(4,2) CHECK (final_score BETWEEN 0 AND 10) COMMENT 'Điểm cuối kỳ',
    average_score DECIMAL(4,2) CHECK (average_score BETWEEN 0 AND 10) COMMENT 'Điểm trung bình',
    grade VARCHAR(2) COMMENT 'Xếp loại: A, B, C, D, F',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_subject_semester (student_id, subject_id, semester, year_level),
    INDEX idx_student_id (student_id),
    INDEX idx_subject_id (subject_id),
    INDEX idx_semester (semester, year_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Table: tests
-- Lịch sử các bài kiểm tra/thi
-- ================================================
CREATE TABLE tests (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL COMMENT 'students.id',
    subject_id VARCHAR(36) NOT NULL,
    test_type ENUM('midterm', 'final', 'quiz', 'assignment') NOT NULL COMMENT 'Loại bài kiểm tra',
    test_date DATE NOT NULL COMMENT 'Ngày thi',
    score DECIMAL(4,2) NOT NULL CHECK (score BETWEEN 0 AND 10) COMMENT 'Điểm',
    max_score DECIMAL(4,2) DEFAULT 10.00 COMMENT 'Điểm tối đa',
    weight DECIMAL(3,2) DEFAULT 1.00 COMMENT 'Trọng số',
    remarks TEXT COMMENT 'Ghi chú',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    INDEX idx_student_id (student_id),
    INDEX idx_subject_id (subject_id),
    INDEX idx_test_date (test_date),
    INDEX idx_test_type (test_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Table: tuition
-- Học phí theo năm học (Luỹ 1, 2, 3)
-- ================================================
CREATE TABLE tuition (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL COMMENT 'students.id',
    year_level INT NOT NULL CHECK (year_level BETWEEN 1 AND 3) COMMENT 'Năm học: 1 (Luỹ 1), 2 (Luỹ 2), 3 (Luỹ 3)',
    academic_year VARCHAR(9) NOT NULL COMMENT 'Năm học: 2024-2025',
    amount_per_month DECIMAL(12,2) NOT NULL COMMENT 'Học phí/tháng: 400tr(năm1), 450tr(năm2), 500tr(năm3)',
    total_months INT NOT NULL DEFAULT 12 COMMENT 'Tổng số tháng',
    total_amount DECIMAL(12,2) NOT NULL COMMENT 'Tổng học phí = amount_per_month * 12',
    paid_amount DECIMAL(12,2) DEFAULT 0.00 COMMENT 'Số tiền đã đóng',
    remaining_amount DECIMAL(12,2) NOT NULL COMMENT 'Số tiền còn lại',
    status ENUM('pending', 'partial', 'completed') DEFAULT 'pending' COMMENT 'Trạng thái: chưa đóng, đang đóng, hoàn thành',
    due_date DATE COMMENT 'Hạn đóng',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_year (student_id, year_level, academic_year),
    INDEX idx_student_id (student_id),
    INDEX idx_year_level (year_level),
    INDEX idx_status (status),
    INDEX idx_academic_year (academic_year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Table: tuition_payments
-- Lịch sử các lần đóng học phí
-- ================================================
CREATE TABLE tuition_payments (
    id VARCHAR(36) PRIMARY KEY,
    tuition_id VARCHAR(36) NOT NULL,
    payment_amount DECIMAL(12,2) NOT NULL COMMENT 'Số tiền đóng',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày đóng',
    payment_method ENUM('cash', 'bank_transfer', 'card', 'other') DEFAULT 'cash' COMMENT 'Phương thức thanh toán',
    transaction_id VARCHAR(100) COMMENT 'Mã giao dịch',
    remarks TEXT COMMENT 'Ghi chú',
    created_by VARCHAR(36) COMMENT 'Người tạo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tuition_id) REFERENCES tuition(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_tuition_id (tuition_id),
    INDEX idx_payment_date (payment_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Table: feedbacks
-- Phản ánh của học sinh về giáo viên
-- ================================================
CREATE TABLE feedbacks (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL COMMENT 'students.id',
    subject_id VARCHAR(36) COMMENT 'Môn học liên quan',
    message TEXT NOT NULL COMMENT 'Nội dung phản ánh',
    reply TEXT COMMENT 'Câu trả lời từ giáo viên',
    status ENUM('pending', 'replied', 'resolved', 'closed') DEFAULT 'pending' COMMENT 'Trạng thái phản ánh',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    replied_at TIMESTAMP NULL COMMENT 'Thời gian trả lời',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL,
    INDEX idx_student_id (student_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Table: schedules (optional - lịch học)
-- ================================================
CREATE TABLE schedules (
    id VARCHAR(36) PRIMARY KEY,
    subject_id VARCHAR(36) NOT NULL,
    year_level INT NOT NULL CHECK (year_level BETWEEN 1 AND 3) COMMENT 'Năm học',
    day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL COMMENT 'Thứ trong tuần',
    start_time TIME NOT NULL COMMENT 'Giờ bắt đầu',
    end_time TIME NOT NULL COMMENT 'Giờ kết thúc',
    room VARCHAR(20) COMMENT 'Phòng học',
    semester INT NOT NULL CHECK (semester BETWEEN 1 AND 2) COMMENT 'Học kỳ',
    academic_year VARCHAR(9) NOT NULL COMMENT 'Năm học',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    INDEX idx_subject_id (subject_id),
    INDEX idx_day_of_week (day_of_week),
    INDEX idx_academic_year (academic_year, semester)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- TRIGGERS
-- ================================================

-- Trigger: Tự động tính điểm trung bình khi cập nhật điểm
DELIMITER $$

CREATE TRIGGER calculate_average_score
BEFORE UPDATE ON scores
FOR EACH ROW
BEGIN
    IF NEW.midterm_score IS NOT NULL AND NEW.final_score IS NOT NULL THEN
        SET NEW.average_score = (NEW.midterm_score * 0.4 + NEW.final_score * 0.6);
        
        -- Xếp loại
        IF NEW.average_score >= 8.5 THEN
            SET NEW.grade = 'A';
        ELSEIF NEW.average_score >= 7.0 THEN
            SET NEW.grade = 'B';
        ELSEIF NEW.average_score >= 5.5 THEN
            SET NEW.grade = 'C';
        ELSEIF NEW.average_score >= 4.0 THEN
            SET NEW.grade = 'D';
        ELSE
            SET NEW.grade = 'F';
        END IF;
    END IF;
END$$

-- Trigger: Tự động cập nhật số tiền còn lại khi thêm payment
CREATE TRIGGER update_tuition_after_payment
AFTER INSERT ON tuition_payments
FOR EACH ROW
BEGIN
    DECLARE new_paid_amount DECIMAL(12,2);
    DECLARE new_remaining DECIMAL(12,2);
    DECLARE total DECIMAL(12,2);
    
    -- Tính tổng số tiền đã đóng
    SELECT COALESCE(SUM(payment_amount), 0) INTO new_paid_amount
    FROM tuition_payments
    WHERE tuition_id = NEW.tuition_id;
    
    -- Lấy tổng học phí
    SELECT total_amount INTO total
    FROM tuition
    WHERE id = NEW.tuition_id;
    
    -- Tính số tiền còn lại
    SET new_remaining = total - new_paid_amount;
    
    -- Cập nhật trạng thái
    UPDATE tuition
    SET paid_amount = new_paid_amount,
        remaining_amount = new_remaining,
        status = CASE
            WHEN new_remaining <= 0 THEN 'completed'
            WHEN new_paid_amount > 0 THEN 'partial'
            ELSE 'pending'
        END
    WHERE id = NEW.tuition_id;
END$$

-- Trigger: Cập nhật replied_at khi giáo viên trả lời feedback
CREATE TRIGGER update_feedback_replied_at
BEFORE UPDATE ON feedbacks
FOR EACH ROW
BEGIN
    IF NEW.reply IS NOT NULL AND OLD.reply IS NULL THEN
        SET NEW.replied_at = CURRENT_TIMESTAMP;
        SET NEW.status = 'replied';
    END IF;
END$$

DELIMITER ;

-- ================================================
-- VIEWS - Các view hữu ích
-- ================================================

-- View: Thông tin học sinh đầy đủ
CREATE VIEW view_students_full AS
SELECT 
    s.id,
    u.code,
    u.username,
    u.name,
    u.email,
    u.role,
    s.year_level
FROM students s
JOIN users u ON s.user_id = u.id;

-- View: Điểm trung bình của học sinh
CREATE VIEW view_student_gpa AS
SELECT 
    s.id AS student_id,
    u.code,
    u.name,
    s.year_level,
    ROUND(AVG(sc.average_score), 2) AS gpa,
    COUNT(sc.id) AS total_subjects
FROM students s
JOIN users u ON s.user_id = u.id
LEFT JOIN scores sc ON s.id = sc.student_id
GROUP BY s.id, u.code, u.name, s.year_level;

-- View: Tổng quan học phí
CREATE VIEW view_tuition_summary AS
SELECT 
    u.code,
    u.name,
    t.year_level,
    t.academic_year,
    t.total_amount,
    t.paid_amount,
    t.remaining_amount,
    t.status,
    ROUND((t.paid_amount / t.total_amount * 100), 2) AS payment_percentage
FROM tuition t
JOIN students s ON t.student_id = s.id
JOIN users u ON s.user_id = u.id;

-- ================================================
-- STORED PROCEDURES
-- ================================================

DELIMITER $$

-- Procedure: Thêm học sinh mới
CREATE PROCEDURE sp_add_student(
    IN p_username VARCHAR(50),
    IN p_password VARCHAR(255),
    IN p_name VARCHAR(100),
    IN p_email VARCHAR(100),
    IN p_code VARCHAR(20),
    IN p_year_level INT
)
BEGIN
    DECLARE new_user_id VARCHAR(36);
    DECLARE new_student_id VARCHAR(36);
    
    START TRANSACTION;
    
    -- Generate UUIDs
    SET new_user_id = UUID();
    SET new_student_id = UUID();
    
    -- Thêm user
    INSERT INTO users (id, username, password, role, code, name, email)
    VALUES (new_user_id, p_username, p_password, 2, p_code, p_name, p_email);
    
    -- Thêm student
    INSERT INTO students (id, user_id, year_level)
    VALUES (new_student_id, new_user_id, p_year_level);
    
    -- Tạo học phí cho học sinh
    INSERT INTO tuition (id, student_id, year_level, academic_year, amount_per_month, total_months, total_amount, paid_amount, remaining_amount, status)
    VALUES (
        UUID(),
        new_student_id,
        p_year_level,
        CONCAT(YEAR(CURDATE()), '-', YEAR(CURDATE()) + 1),
        CASE 
            WHEN p_year_level = 1 THEN 400000000
            WHEN p_year_level = 2 THEN 450000000
            WHEN p_year_level = 3 THEN 500000000
        END,
        12,
        CASE 
            WHEN p_year_level = 1 THEN 400000000 * 12
            WHEN p_year_level = 2 THEN 450000000 * 12
            WHEN p_year_level = 3 THEN 500000000 * 12
        END,
        0,
        CASE 
            WHEN p_year_level = 1 THEN 400000000 * 12
            WHEN p_year_level = 2 THEN 450000000 * 12
            WHEN p_year_level = 3 THEN 500000000 * 12
        END,
        'pending'
    );
    
    COMMIT;
    
    SELECT new_student_id AS student_id, new_user_id AS user_id, 'Student created successfully' AS message;
END$$

-- Procedure: Tạo học phí cho năm học mới
CREATE PROCEDURE sp_create_tuition(
    IN p_student_id VARCHAR(36),
    IN p_year_level INT,
    IN p_academic_year VARCHAR(9)
)
BEGIN
    DECLARE v_amount_per_month DECIMAL(12,2);
    DECLARE v_total_amount DECIMAL(12,2);
    
    -- Tính học phí theo năm (400tr, 450tr, 500tr cho năm 1, 2, 3)
    SET v_amount_per_month = CASE p_year_level
        WHEN 1 THEN 400000000
        WHEN 2 THEN 450000000
        WHEN 3 THEN 500000000
        ELSE 500000000
    END;
    
    SET v_total_amount = v_amount_per_month * 12;
    
    INSERT INTO tuition (id, student_id, year_level, academic_year, amount_per_month, total_months, total_amount, remaining_amount)
    VALUES (UUID(), p_student_id, p_year_level, p_academic_year, v_amount_per_month, 12, v_total_amount, v_total_amount);
    
    SELECT 'Tuition created successfully' AS message;
END$$

DELIMITER ;

-- ================================================
-- END OF SCHEMA
-- ================================================
