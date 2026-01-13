-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: student_management
-- ------------------------------------------------------
-- Server version	9.5.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ 'fe57ad46-f026-11f0-a6b6-8091334e7b10:1-66';

--
-- Table structure for table `feedbacks`
--

DROP TABLE IF EXISTS `feedbacks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedbacks` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `student_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'students.id - Học sinh đánh giá',
  `teacher_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'users.id - Giáo viên được đánh giá (role=3)',
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nội dung đánh giá',
  `reply` text COLLATE utf8mb4_unicode_ci COMMENT 'Câu trả lời từ giáo viên',
  `status` enum('pending','replied','resolved','closed') COLLATE utf8mb4_unicode_ci DEFAULT 'pending' COMMENT 'Trạng thái phản ánh',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `replied_at` timestamp NULL DEFAULT NULL COMMENT 'Thời gian trả lời',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_student_id` (`student_id`),
  KEY `idx_teacher_id` (`teacher_id`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `feedbacks_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  CONSTRAINT `feedbacks_ibfk_2` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedbacks`
--

LOCK TABLES `feedbacks` WRITE;
/*!40000 ALTER TABLE `feedbacks` DISABLE KEYS */;
INSERT INTO `feedbacks` VALUES ('209f6808-f06c-11f0-9219-8091334e7b10','43f23bf2-f056-11f0-9219-8091334e7b10','366964fa-f056-11f0-9219-8091334e7b10','em yêu cô 3','cô cũng thế','replied','2026-01-13 10:39:24',NULL,'2026-01-13 10:44:18'),('643a2f55-f06b-11f0-9219-8091334e7b10','43f23bf2-f056-11f0-9219-8091334e7b10','366964fa-f056-11f0-9219-8091334e7b10','em yêu cô','cô cũng yêu em','replied','2026-01-13 10:34:08','2026-01-13 10:45:57','2026-01-13 10:45:56'),('7884ef4c-f06c-11f0-9219-8091334e7b10','43f23bf2-f056-11f0-9219-8091334e7b10','366964fa-f056-11f0-9219-8091334e7b10','em yêu cô 4',NULL,'pending','2026-01-13 10:41:51',NULL,'2026-01-13 10:41:51'),('f74efa91-f06b-11f0-9219-8091334e7b10','43f23bf2-f056-11f0-9219-8091334e7b10','366964fa-f056-11f0-9219-8091334e7b10','em yêu cô 2',NULL,'pending','2026-01-13 10:38:14',NULL,'2026-01-13 10:38:14');
/*!40000 ALTER TABLE `feedbacks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedules`
--

DROP TABLE IF EXISTS `schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedules` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `subject_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `year_level` int NOT NULL COMMENT 'Năm học',
  `day_of_week` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Thứ trong tuần',
  `start_time` time NOT NULL COMMENT 'Giờ bắt đầu',
  `end_time` time NOT NULL COMMENT 'Giờ kết thúc',
  `room` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Phòng học',
  `semester` int NOT NULL COMMENT 'Học kỳ',
  `academic_year` varchar(9) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Năm học',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_subject_id` (`subject_id`),
  KEY `idx_day_of_week` (`day_of_week`),
  KEY `idx_academic_year` (`academic_year`,`semester`),
  CONSTRAINT `schedules_ibfk_1` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `schedules_chk_1` CHECK ((`year_level` between 1 and 3)),
  CONSTRAINT `schedules_chk_2` CHECK ((`semester` between 1 and 2))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedules`
--

LOCK TABLES `schedules` WRITE;
/*!40000 ALTER TABLE `schedules` DISABLE KEYS */;
/*!40000 ALTER TABLE `schedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scores`
--

DROP TABLE IF EXISTS `scores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scores` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `student_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'students.id',
  `subject_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` int NOT NULL COMMENT 'Loại điểm: 1=midterm, 2=final, 3=quiz, 4=assignment, 5=other',
  `score` decimal(4,2) NOT NULL COMMENT 'Điểm số',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_student_id` (`student_id`),
  KEY `idx_subject_id` (`subject_id`),
  KEY `idx_type` (`type`),
  CONSTRAINT `scores_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  CONSTRAINT `scores_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `scores_chk_1` CHECK ((`score` between 0 and 10))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scores`
--

LOCK TABLES `scores` WRITE;
/*!40000 ALTER TABLE `scores` DISABLE KEYS */;
INSERT INTO `scores` VALUES ('8cd25654-f056-11f0-9219-8091334e7b10','43f23bf2-f056-11f0-9219-8091334e7b10','f650652e-f051-11f0-9219-8091334e7b10',1,8.50,'2026-01-13 08:04:56','2026-01-13 08:04:56'),('8cd26167-f056-11f0-9219-8091334e7b10','43f23bf2-f056-11f0-9219-8091334e7b10','f650652e-f051-11f0-9219-8091334e7b10',2,9.00,'2026-01-13 08:04:56','2026-01-13 08:04:56'),('8cd2644d-f056-11f0-9219-8091334e7b10','43f23bf2-f056-11f0-9219-8091334e7b10','f650652e-f051-11f0-9219-8091334e7b10',3,8.00,'2026-01-13 08:04:56','2026-01-13 08:04:56'),('8cd26803-f056-11f0-9219-8091334e7b10','43f23bf2-f056-11f0-9219-8091334e7b10','f650652e-f051-11f0-9219-8091334e7b10',4,9.50,'2026-01-13 08:04:56','2026-01-13 08:04:56'),('906d117c-f056-11f0-9219-8091334e7b10','43f23bf2-f056-11f0-9219-8091334e7b10','f651ae2b-f051-11f0-9219-8091334e7b10',1,7.50,'2026-01-13 08:05:02','2026-01-13 08:05:02'),('906d280a-f056-11f0-9219-8091334e7b10','43f23bf2-f056-11f0-9219-8091334e7b10','f651ae2b-f051-11f0-9219-8091334e7b10',2,8.00,'2026-01-13 08:05:02','2026-01-13 08:05:02'),('906d2ae5-f056-11f0-9219-8091334e7b10','43f23bf2-f056-11f0-9219-8091334e7b10','f651ae2b-f051-11f0-9219-8091334e7b10',3,7.00,'2026-01-13 08:05:02','2026-01-13 08:05:02'),('906d2c9c-f056-11f0-9219-8091334e7b10','43f23bf2-f056-11f0-9219-8091334e7b10','f651ae2b-f051-11f0-9219-8091334e7b10',4,8.50,'2026-01-13 08:05:02','2026-01-13 08:05:02'),('93131ed2-f056-11f0-9219-8091334e7b10','43f23bf2-f056-11f0-9219-8091334e7b10','f651ea24-f051-11f0-9219-8091334e7b10',1,9.00,'2026-01-13 08:05:07','2026-01-13 08:05:07'),('931327ba-f056-11f0-9219-8091334e7b10','43f23bf2-f056-11f0-9219-8091334e7b10','f651ea24-f051-11f0-9219-8091334e7b10',2,9.50,'2026-01-13 08:05:07','2026-01-13 08:05:07'),('931329e9-f056-11f0-9219-8091334e7b10','43f23bf2-f056-11f0-9219-8091334e7b10','f651ea24-f051-11f0-9219-8091334e7b10',3,8.50,'2026-01-13 08:05:07','2026-01-13 08:05:07'),('93132bdb-f056-11f0-9219-8091334e7b10','43f23bf2-f056-11f0-9219-8091334e7b10','f651ea24-f051-11f0-9219-8091334e7b10',4,10.00,'2026-01-13 08:05:07','2026-01-13 08:05:07'),('9618cb2e-f056-11f0-9219-8091334e7b10','43f23bf2-f056-11f0-9219-8091334e7b10','f651ecf2-f051-11f0-9219-8091334e7b10',1,8.00,'2026-01-13 08:05:12','2026-01-13 08:05:12'),('9618d1ba-f056-11f0-9219-8091334e7b10','43f23bf2-f056-11f0-9219-8091334e7b10','f651ecf2-f051-11f0-9219-8091334e7b10',2,8.50,'2026-01-13 08:05:12','2026-01-13 08:05:12'),('9618d396-f056-11f0-9219-8091334e7b10','43f23bf2-f056-11f0-9219-8091334e7b10','f651ecf2-f051-11f0-9219-8091334e7b10',3,7.50,'2026-01-13 08:05:12','2026-01-13 08:05:12'),('9618d4f1-f056-11f0-9219-8091334e7b10','43f23bf2-f056-11f0-9219-8091334e7b10','f651ecf2-f051-11f0-9219-8091334e7b10',4,9.00,'2026-01-13 08:05:12','2026-01-13 08:05:12'),('98e79000-f056-11f0-9219-8091334e7b10','43f23bf2-f056-11f0-9219-8091334e7b10','f651ee00-f051-11f0-9219-8091334e7b10',1,9.50,'2026-01-13 08:05:17','2026-01-13 08:05:17'),('98e79c5d-f056-11f0-9219-8091334e7b10','43f23bf2-f056-11f0-9219-8091334e7b10','f651ee00-f051-11f0-9219-8091334e7b10',2,10.00,'2026-01-13 08:05:17','2026-01-13 08:05:17'),('98e7a02f-f056-11f0-9219-8091334e7b10','43f23bf2-f056-11f0-9219-8091334e7b10','f651ee00-f051-11f0-9219-8091334e7b10',3,9.00,'2026-01-13 08:05:17','2026-01-13 08:05:17'),('98e7a378-f056-11f0-9219-8091334e7b10','43f23bf2-f056-11f0-9219-8091334e7b10','f651ee00-f051-11f0-9219-8091334e7b10',4,9.50,'2026-01-13 08:05:17','2026-01-13 08:05:17');
/*!40000 ALTER TABLE `scores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `user_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `year_level` int NOT NULL COMMENT 'Năm học: 1, 2, 3',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `idx_year_level` (`year_level`),
  CONSTRAINT `students_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES ('43f23bf2-f056-11f0-9219-8091334e7b10','3666a027-f056-11f0-9219-8091334e7b10',3,'2026-01-13 08:02:54','2026-01-13 09:29:22'),('43f25a48-f056-11f0-9219-8091334e7b10','36693ce5-f056-11f0-9219-8091334e7b10',2,'2026-01-13 08:02:54','2026-01-13 08:02:54'),('43f25dc5-f056-11f0-9219-8091334e7b10','366957fa-f056-11f0-9219-8091334e7b10',3,'2026-01-13 08:02:54','2026-01-13 08:02:54'),('43f2603f-f056-11f0-9219-8091334e7b10','36695cb2-f056-11f0-9219-8091334e7b10',1,'2026-01-13 08:02:54','2026-01-13 08:02:54'),('43f26276-f056-11f0-9219-8091334e7b10','3669618c-f056-11f0-9219-8091334e7b10',2,'2026-01-13 08:02:54','2026-01-13 08:02:54');
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subjects`
--

DROP TABLE IF EXISTS `subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subjects` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `subject_code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Mã môn học',
  `subject_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên môn học',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `subject_code` (`subject_code`),
  KEY `idx_subject_code` (`subject_code`),
  KEY `idx_subject_name` (`subject_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subjects`
--

LOCK TABLES `subjects` WRITE;
/*!40000 ALTER TABLE `subjects` DISABLE KEYS */;
INSERT INTO `subjects` VALUES ('f650652e-f051-11f0-9219-8091334e7b10','TOAN','Toán',1,'2026-01-13 07:32:06','2026-01-13 07:32:06'),('f651ae2b-f051-11f0-9219-8091334e7b10','LY','Lý',1,'2026-01-13 07:32:06','2026-01-13 07:32:06'),('f651ea24-f051-11f0-9219-8091334e7b10','HOA','Hóa',1,'2026-01-13 07:32:06','2026-01-13 07:32:06'),('f651ecf2-f051-11f0-9219-8091334e7b10','VAN','Văn',1,'2026-01-13 07:32:06','2026-01-13 07:32:06'),('f651ee00-f051-11f0-9219-8091334e7b10','ANH','Anh',1,'2026-01-13 07:32:06','2026-01-13 07:32:06');
/*!40000 ALTER TABLE `subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tests`
--

DROP TABLE IF EXISTS `tests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tests` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `student_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'students.id',
  `subject_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `test_type` enum('midterm','final','quiz','assignment') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Loại bài kiểm tra',
  `test_date` date NOT NULL COMMENT 'Ngày thi',
  `score` decimal(4,2) NOT NULL COMMENT 'Điểm',
  `max_score` decimal(4,2) DEFAULT '10.00' COMMENT 'Điểm tối đa',
  `weight` decimal(3,2) DEFAULT '1.00' COMMENT 'Trọng số',
  `remarks` text COLLATE utf8mb4_unicode_ci COMMENT 'Ghi chú',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_student_id` (`student_id`),
  KEY `idx_subject_id` (`subject_id`),
  KEY `idx_test_date` (`test_date`),
  KEY `idx_test_type` (`test_type`),
  CONSTRAINT `tests_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  CONSTRAINT `tests_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `tests_chk_1` CHECK ((`score` between 0 and 10))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tests`
--

LOCK TABLES `tests` WRITE;
/*!40000 ALTER TABLE `tests` DISABLE KEYS */;
/*!40000 ALTER TABLE `tests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tuition`
--

DROP TABLE IF EXISTS `tuition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tuition` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `student_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'students.id',
  `year` int NOT NULL COMMENT 'Năm học: 1, 2, 3',
  `amount` decimal(12,2) NOT NULL COMMENT 'Học phí/tháng',
  `months` int NOT NULL DEFAULT '12' COMMENT 'Số tháng',
  `paid` decimal(12,2) DEFAULT '0.00' COMMENT 'Số tiền đã đóng',
  `is_active` tinyint(1) DEFAULT '1' COMMENT 'Trạng thái hoạt động',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_student_year` (`student_id`,`year`),
  KEY `idx_student_id` (`student_id`),
  KEY `idx_year` (`year`),
  CONSTRAINT `tuition_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tuition`
--

LOCK TABLES `tuition` WRITE;
/*!40000 ALTER TABLE `tuition` DISABLE KEYS */;
INSERT INTO `tuition` VALUES ('cc4cb6d1-f068-11f0-9219-8091334e7b10','43f23bf2-f056-11f0-9219-8091334e7b10',1,400000.00,12,4800000.00,0,'2026-01-13 10:15:34','2026-01-13 10:15:34'),('cc4d361d-f068-11f0-9219-8091334e7b10','43f23bf2-f056-11f0-9219-8091334e7b10',2,420000.00,12,5040000.00,0,'2026-01-13 10:15:34','2026-01-13 10:15:34'),('cc4d3e10-f068-11f0-9219-8091334e7b10','43f23bf2-f056-11f0-9219-8091334e7b10',3,450000.00,12,2700000.00,1,'2026-01-13 10:15:34','2026-01-13 10:15:34');
/*!40000 ALTER TABLE `tuition` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'SV001, GV001',
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` int NOT NULL COMMENT '1=admin, 2=student, 3=teacher',
  `code` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Mã: SV001, GV001, AD001',
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên đầy đủ',
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_username` (`username`),
  KEY `idx_code` (`code`),
  KEY `idx_role` (`role`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('3666a027-f056-11f0-9219-8091334e7b10','SV001','$2a$10$0Q6T4wBnNELt9uSBbbxSZuTcoVvSJ2hsY5hynXgByVi1j5AuGDp2a',2,'SV001','Nguyễn Văn ăn lồn','nguyenvanan@student.edu.vn','2026-01-13 08:02:31','2026-01-13 09:29:22'),('36693ce5-f056-11f0-9219-8091334e7b10','SV002','$2a$10$0Q6T4wBnNELt9uSBbbxSZuTcoVvSJ2hsY5hynXgByVi1j5AuGDp2a',2,'SV002','Trần Thị Bình','tranthibinh@student.edu.vn','2026-01-13 08:02:31','2026-01-13 08:51:01'),('366957fa-f056-11f0-9219-8091334e7b10','SV003','$2a$10$0Q6T4wBnNELt9uSBbbxSZuTcoVvSJ2hsY5hynXgByVi1j5AuGDp2a',2,'SV003','Lê Hoàng Cường','lehoangcuong@student.edu.vn','2026-01-13 08:02:31','2026-01-13 08:51:01'),('36695cb2-f056-11f0-9219-8091334e7b10','SV004','$2a$10$0Q6T4wBnNELt9uSBbbxSZuTcoVvSJ2hsY5hynXgByVi1j5AuGDp2a',2,'SV004','Phạm Thị Dung','phamthidung@student.edu.vn','2026-01-13 08:02:31','2026-01-13 08:51:01'),('3669618c-f056-11f0-9219-8091334e7b10','SV005','$2a$10$0Q6T4wBnNELt9uSBbbxSZuTcoVvSJ2hsY5hynXgByVi1j5AuGDp2a',2,'SV005','Hoàng Văn Em','hoangvanem@student.edu.vn','2026-01-13 08:02:31','2026-01-13 08:51:01'),('366964fa-f056-11f0-9219-8091334e7b10','GV001','$2a$10$0Q6T4wBnNELt9uSBbbxSZuTcoVvSJ2hsY5hynXgByVi1j5AuGDp2a',3,'GV001','Nguyễn Thị Hương','nguyenthihuong@teacher.edu.vn','2026-01-13 08:02:31','2026-01-13 08:51:01'),('3e74d552-32dc-49db-82ba-faf0911000c8','admin','$2a$10$0Q6T4wBnNELt9uSBbbxSZuTcoVvSJ2hsY5hynXgByVi1j5AuGDp2a',1,'admin','Administrator','admin@example.com','2026-01-13 08:50:37','2026-01-13 08:50:37');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'student_management'
--
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-13 17:46:41
