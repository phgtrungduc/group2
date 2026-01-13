# HỆ THỐNG QUẢN LÝ SINH VIÊN

**Trường Đại học Công nghệ và Quản lý**  
**Group 2 - Đồ án Quản lý Sinh viên**

---

## 📋 MỤC LỤC

1. [Giới thiệu](#giới-thiệu)
2. [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
3. [Hướng dẫn cài đặt](#hướng-dẫn-cài-đặt)
   - [Bước 1: Cài đặt Database](#bước-1-cài-đặt-database)
   - [Bước 2: Cài đặt Backend](#bước-2-cài-đặt-backend)
   - [Bước 3: Cài đặt Frontend](#bước-3-cài-đặt-frontend)
4. [Thông tin đăng nhập](#thông-tin-đăng-nhập)
5. [Cấu trúc dự án](#cấu-trúc-dự-án)
6. [Tính năng hệ thống](#tính-năng-hệ-thống)
7. [Xử lý lỗi thường gặp](#xử-lý-lỗi-thường-gặp)

---

## 📖 GIỚI THIỆU

Hệ thống quản lý sinh viên là ứng dụng web giúp quản lý thông tin sinh viên, giáo viên, điểm số, học phí và phản hồi giữa sinh viên và giáo viên.

**Công nghệ sử dụng:**
- **Backend**: Node.js, Express, TypeScript, MySQL
- **Frontend**: React, Vite
- **Database**: MySQL 8.0+

---

## 💻 YÊU CẦU HỆ THỐNG

Trước khi bắt đầu, đảm bảo máy tính đã cài đặt:

| Phần mềm | Phiên bản tối thiểu | Link tải |
|----------|---------------------|----------|
| **Node.js** | 18.x trở lên | https://nodejs.org |
| **MySQL** | 8.0 trở lên | https://dev.mysql.com/downloads/mysql |
| **Git** (tùy chọn) | Bất kỳ | https://git-scm.com |

**Kiểm tra cài đặt:**
```bash
# Kiểm tra Node.js
node --version
# Kết quả mong đợi: v18.x.x hoặc cao hơn

# Kiểm tra npm
npm --version
# Kết quả mong đợi: 9.x.x hoặc cao hơn

# Kiểm tra MySQL
mysql --version
# Kết quả mong đợi: mysql Ver 8.0.x
```

---

## 🚀 HƯỚNG DẪN CÀI ĐẶT

### BƯỚC 1: CÀI ĐẶT DATABASE

#### 1.1. Mở MySQL Command Line hoặc MySQL Workbench

**Cách 1: Sử dụng MySQL Command Line**
```bash
# Windows: Mở Command Prompt hoặc PowerShell
mysql -u root -p
```

**Cách 2: Sử dụng MySQL Workbench**
- Mở MySQL Workbench
- Kết nối đến server MySQL (localhost:3306)
- Nhập mật khẩu root

#### 1.2. Import Schema Database

**Trong terminal MySQL:**
```sql
-- Import schema (tạo bảng)
SOURCE D:/ducpt/SourceCode/group2/BE/database/schema.sql;

-- HOẶC nếu đường dẫn có dấu cách, dùng dấu nháy kép:
SOURCE "D:/ducpt/SourceCode/group2/BE/database/schema.sql";
```

**Trong MySQL Workbench:**
1. File → Open SQL Script
2. Chọn file `BE/database/schema.sql`
3. Nhấn nút "Execute" (biểu tượng sấm sét ⚡)

#### 1.3. Import Dữ liệu mẫu

```sql
-- Import dữ liệu mẫu
SOURCE D:/ducpt/SourceCode/group2/BE/database/sample_insert.sql;
```

#### 1.4. Kiểm tra Database đã tạo thành công

```sql
-- Chọn database
USE student_management;

-- Kiểm tra các bảng
SHOW TABLES;

-- Kiểm tra dữ liệu users
SELECT * FROM users;

-- Thoát MySQL
EXIT;
```

**Kết quả mong đợi:**
- Database `student_management` được tạo
- Có 10+ bảng (users, students, scores, subjects, feedbacks, tuition, v.v.)
- Bảng users có 12 bản ghi (1 admin + 5 students + 5 teachers + 1 test user)

---

### BƯỚC 2: CÀI ĐẶT BACKEND

#### 2.1. Mở Terminal tại thư mục Backend

```bash
# Windows: Mở PowerShell hoặc Command Prompt
cd D:\ducpt\SourceCode\group2\BE

# Hoặc mở thư mục BE trong VS Code và mở Terminal
```

#### 2.2. Cài đặt các thư viện

```bash
npm install
```

**Chờ quá trình cài đặt hoàn tất** (có thể mất 2-5 phút tùy tốc độ mạng)

#### 2.3. Tạo file cấu hình môi trường

Tạo file mới tên `.env` trong thư mục `BE/`:

```env
# Sao chép nội dung sau vào file .env

PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=Truongtramy99@
DB_NAME=student_management
JWT_SECRET=nguyentuandung
JWT_EXPIRES_IN=100d
NODE_ENV=development
```

**⚠️ LƯU Ý:** 
- Thay `DB_PASSWORD=Truongtramy99@` bằng mật khẩu MySQL của bạn
- Không có dấu cách trước/sau dấu `=`

#### 2.4. Chạy Backend Server

```bash
npm run dev
```

**Kết quả mong đợi:**
```
[nodemon] starting `ts-node src/index.ts`
🚀 Server running on port 3000
✅ Database connected successfully
```

**Nếu thấy thông báo trên → Backend đã chạy thành công! ✅**

**Để kiểm tra:** Mở trình duyệt và vào http://localhost:3000/api

---

### BƯỚC 3: CÀI ĐẶT FRONTEND

#### 3.1. Mở Terminal MỚI (giữ nguyên terminal Backend đang chạy)

```bash
# Windows: Mở PowerShell hoặc Command Prompt MỚI
cd D:\ducpt\SourceCode\group2\FE
```

#### 3.2. Cài đặt các thư viện

```bash
npm install
```

**Chờ quá trình cài đặt hoàn tất** (có thể mất 2-5 phút)

#### 3.3. Chạy Frontend

```bash
npm run dev
```

**Kết quả mong đợi:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Nếu thấy thông báo trên → Frontend đã chạy thành công! ✅**

#### 3.4. Mở trình duyệt

Truy cập: **http://localhost:5173**

Bạn sẽ thấy màn hình đăng nhập của hệ thống.

---

## 🔐 THÔNG TIN ĐĂNG NHẬP

Hệ thống có 3 loại tài khoản:

### 1. Tài khoản ADMIN
```
Username: admin
Password: 123456
Quyền: Quản lý toàn bộ hệ thống
```

### 2. Tài khoản SINH VIÊN

| Username | Password | Họ tên | Năm học |
|----------|----------|---------|---------|
| SV001 | 123456 | Nguyễn Văn An | Năm 1 |
| SV002 | 123456 | Trần Thị Bình | Năm 2 |
| SV003 | 123456 | Lê Hoàng Cường | Năm 3 |
| SV004 | 123456 | Phạm Thị Dung | Năm 1 |
| SV005 | 123456 | Hoàng Văn Em | Năm 2 |

### 3. Tài khoản GIÁO VIÊN

| Username | Password | Họ tên |
|----------|----------|---------|
| GV001 | 123456 | Nguyễn Thị Hương |
| GV002 | 123456 | Trần Văn Minh |
| GV003 | 123456 | Lê Thị Lan |
| GV004 | 123456 | Phạm Văn Hùng |
| GV005 | 123456 | Hoàng Thị Mai |

---

## 📁 CẤU TRÚC DỰ ÁN

```
group2/
│
├── BE/                          # Backend API
│   ├── src/
│   │   ├── config/              # Cấu hình database
│   │   ├── controllers/         # Xử lý logic API
│   │   ├── models/              # Định nghĩa dữ liệu
│   │   ├── repositories/        # Truy vấn database
│   │   ├── routes/              # Định nghĩa API routes
│   │   ├── services/            # Business logic
│   │   ├── middleware/          # Xác thực JWT, xử lý lỗi
│   │   ├── enums/               # Enum cho Role, ScoreType
│   │   └── index.ts             # Entry point
│   │
│   ├── database/
│   │   ├── schema.sql           # ⭐ Schema database
│   │   ├── sample_insert.sql    # ⭐ Dữ liệu mẫu
│   │   └── README.md
│   │
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                     # ⚙️ Cấu hình môi trường
│
├── FE/                          # Frontend React
│   ├── src/
│   │   ├── components/          # Các component UI
│   │   │   ├── Login.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── TeacherDashboard.jsx
│   │   │   ├── ScoreView.jsx
│   │   │   ├── TuitionView.jsx
│   │   │   └── ...
│   │   │
│   │   ├── contexts/            # Context API (Auth)
│   │   ├── services/            # API service calls
│   │   ├── config/              # API endpoints config
│   │   ├── App.jsx              # Root component
│   │   ├── App.css              # Styles
│   │   └── main.jsx             # Entry point
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md                    # ⭐ File này
```

---

## ✨ TÍNH NĂNG HỆ THỐNG

### 🎓 Dành cho SINH VIÊN

- ✅ **Xem điểm số**: Xem điểm theo từng môn học, loại điểm (giữa kỳ, cuối kỳ, bài tập)
- ✅ **Xem điểm trung bình**: Tính GPA tự động theo môn và tổng
- ✅ **Xem học phí**: Xem học phí theo năm, số tiền đã đóng, còn lại
- ✅ **Đóng học phí**: Chức năng demo đóng học phí
- ✅ **Đánh giá giáo viên**: Gửi feedback về giáo viên
- ✅ **Xem lịch sử đánh giá**: Theo dõi trạng thái và phản hồi từ giáo viên

### 👨‍🏫 Dành cho GIÁO VIÊN

- ✅ **Quản lý sinh viên**: Thêm, sửa, xóa thông tin sinh viên
- ✅ **Xem danh sách sinh viên**: Xem điểm trung bình của từng sinh viên
- ✅ **Xem chi tiết điểm số**: Xem điểm chi tiết theo môn của sinh viên
- ✅ **Xem đánh giá**: Xem feedback sinh viên gửi đến
- ✅ **Trả lời đánh giá**: Phản hồi lại feedback của sinh viên

### 🔧 Dành cho ADMIN

- ✅ **Quản lý người dùng**: Thêm sinh viên, giáo viên mới vào hệ thống
- ✅ **Toàn quyền truy cập**: Truy cập tất cả chức năng của hệ thống

---

## 🔍 BẢNG PHÂN QUYỀN

| Chức năng | Admin | Giáo viên | Sinh viên |
|-----------|-------|-----------|-----------|
| Xem điểm của bản thân | ✅ | ✅ | ✅ |
| Xem điểm sinh viên khác | ✅ | ✅ | ❌ |
| Sửa thông tin sinh viên | ✅ | ✅ | ❌ |
| Xóa sinh viên | ✅ | ✅ | ❌ |
| Thêm người dùng mới | ✅ | ✅ | ❌ |
| Xem học phí | ✅ | ✅ | ✅ (bản thân) |
| Gửi đánh giá giáo viên | ❌ | ❌ | ✅ |
| Xem đánh giá về mình | ❌ | ✅ | ❌ |
| Trả lời đánh giá | ❌ | ✅ | ❌ |

---

## ⚠️ XỬ LÝ LỖI THƯỜNG GẶP

### 1. Lỗi: `Cannot connect to MySQL server`

**Nguyên nhân:** MySQL chưa chạy hoặc sai mật khẩu

**Cách sửa:**
```bash
# Kiểm tra MySQL đang chạy (Windows)
services.msc
# Tìm "MySQL" và Start service

# Kiểm tra kết nối
mysql -u root -p
```

### 2. Lỗi: `Database 'student_management' doesn't exist`

**Nguyên nhân:** Chưa import schema.sql

**Cách sửa:**
```sql
mysql -u root -p
SOURCE D:/ducpt/SourceCode/group2/BE/database/schema.sql;
```

### 3. Lỗi: `Port 3000 is already in use`

**Nguyên nhân:** Đã có ứng dụng khác chạy ở port 3000

**Cách sửa:**
```bash
# Option 1: Tắt ứng dụng đang dùng port 3000

# Option 2: Đổi port trong BE/.env
PORT=3001
```

### 4. Lỗi: `npm: command not found`

**Nguyên nhân:** Chưa cài Node.js hoặc chưa thêm vào PATH

**Cách sửa:**
- Tải và cài Node.js: https://nodejs.org
- Khởi động lại terminal sau khi cài

### 5. Lỗi: `Invalid username or password` khi đăng nhập

**Nguyên nhân:** 
- Chưa import dữ liệu mẫu
- Nhập sai username/password

**Cách sửa:**
```sql
-- Import lại dữ liệu mẫu
mysql -u root -p
USE student_management;
SOURCE D:/ducpt/SourceCode/group2/BE/database/sample_insert.sql;

-- Kiểm tra users
SELECT username, code, name FROM users;
```

### 6. Backend chạy nhưng Frontend không gọi được API

**Nguyên nhân:** Sai URL hoặc CORS

**Cách sửa:**
- Kiểm tra Backend đang chạy ở port 3000
- Kiểm tra file `FE/src/config/api.js`:
```javascript
export const API_BASE_URL = 'http://localhost:3000/api';
```

### 7. Lỗi `Module not found` sau khi pull code mới

**Cách sửa:**
```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
```

---

## 📞 HỖ TRỢ

Nếu gặp lỗi không có trong danh sách trên:

1. **Kiểm tra lại từng bước** trong hướng dẫn
2. **Xem log lỗi** trong terminal (Backend và Frontend)
3. **Kiểm tra MySQL** có đang chạy không
4. **Liên hệ nhóm phát triển** để được hỗ trợ

---

## 📝 GHI CHÚ

- **Mật khẩu mặc định** cho tất cả tài khoản: `123456`
- **Không commit file `.env`** lên Git
- **Backup database** trước khi thử nghiệm xóa/sửa dữ liệu
- **Đọc kỹ log lỗi** trước khi hỏi hỗ trợ

---

## 👥 THÔNG TIN NHÓM

**Group 2** - Đồ án Quản lý Sinh viên  
**Trường:** Đại học Công nghệ và Quản lý  
**Năm:** 2026

---

**🎉 CHÚC CÁC BẠN CÀI ĐẶT THÀNH CÔNG!**
