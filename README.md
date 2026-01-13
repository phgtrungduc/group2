# Student Management System

Hệ thống quản lý sinh viên cho Trường Đại học Công nghệ và Quản lý.

## 📁 Cấu trúc Project

```
group2/
├── BE/                 # Backend API (Node.js + Express + MySQL)
├── FE/                 # Frontend (React + Vite)
└── README.md
```

## 🚀 Backend (BE)

**Tech Stack:**
- Node.js + TypeScript
- Express.js
- MySQL 8.0+
- mysql2 driver

**Setup:**
```bash
cd BE
npm install
mysql -u root -p < database/schema.sql
cp .env.example .env
# Edit .env with your MySQL credentials
npm run dev
```

**Xem chi tiết:** [BE/README.md](BE/README.md)

## 🎨 Frontend (FE)

**Tech Stack:**
- React 18
- Vite
- TailwindCSS (hoặc CSS thuần)

**Setup:**
```bash
cd FE
npm install
npm run dev
```

## 📊 Database

Hệ thống sử dụng MySQL với thiết kế 3 bảng chính:
- **users** - Đăng nhập (username, password, role)
- **students** - Thông tin học sinh
- **teachers** - Thông tin giáo viên

**Xem chi tiết:** [BE/database/README.md](BE/database/README.md)

## 🔑 Roles

- **role = 1**: Admin - Quản trị hệ thống
- **role = 2**: Student - Học sinh
- **role = 3**: Teacher - Giáo viên

## ✨ Tính năng

### Cho Học sinh:
- ✅ Xem điểm và GPA
- ✅ Xem lịch học
- ✅ Xem học phí và lịch sử đóng phí
- ✅ Gửi phản ánh cho giáo viên
- ✅ Xem lịch sử kiểm tra

### Cho Giáo viên:
- ✅ Quản lý học sinh
- ✅ Nhập điểm
- ✅ Xem lịch dạy
- ✅ Trả lời phản ánh của học sinh
- ✅ Tạo bài kiểm tra

### Cho Admin:
- ✅ Quản lý người dùng
- ✅ Quản lý môn học
- ✅ Quản lý lịch học
- ✅ Quản lý học phí

## 📝 Quy tắc Học phí

| Năm học | Học phí/tháng | Tổng/năm (12 tháng) |
|---------|---------------|---------------------|
| Năm 1   | 400 triệu VND | 4.8 tỷ VND          |
| Năm 2   | 450 triệu VND | 5.4 tỷ VND          |
| Năm 3   | 500 triệu VND | 6.0 tỷ VND          |

## 🛠️ Development

### Prerequisites:
- Node.js >= 18.x
- MySQL >= 8.0
- npm hoặc yarn

### Environment Variables:

**Backend (.env):**
```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=student_management
```

## 📦 Sample Data

Database đã có sẵn dữ liệu mẫu:
- 8 users (1 admin, 3 teachers, 4 students)
- 4 students (Năm 1: 2, Năm 2: 1, Năm 3: 1)
- 3 teachers
- 8 subjects
- Scores, tests, tuition records, feedbacks, schedules

## 🤝 Contributing

1. Clone repository
2. Tạo branch mới: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add some feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Tạo Pull Request

## 👥 Team

**Group 2** - Trường Đại học Công nghệ và Quản lý

## 📄 License

ISC

---

**Lưu ý:** Đây là project học tập. Đảm bảo cấu hình đúng database trước khi chạy.
