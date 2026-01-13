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
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
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
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
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
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    subject_code VARCHAR(20) NOT NULL UNIQUE COMMENT 'Mã môn học',
    subject_name VARCHAR(100) NOT NULL COMMENT 'Tên môn học',
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
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    student_id VARCHAR(36) NOT NULL COMMENT 'students.id',
    subject_id VARCHAR(36) NOT NULL,
    type INT NOT NULL COMMENT 'Loại điểm: 1=midterm, 2=final, 3=quiz, 4=assignment, 5=other',
    score DECIMAL(4,2) NOT NULL CHECK (score BETWEEN 0 AND 10) COMMENT 'Điểm số',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    INDEX idx_student_id (student_id),
    INDEX idx_subject_id (subject_id),
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Table: tests
-- Lịch sử các bài kiểm tra/thi
-- ================================================
CREATE TABLE tests (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
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
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
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
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
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
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
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
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
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

