# TÀI LIỆU THUYẾT TRÌNH DỰ ÁN
## Hệ thống quản lý trường đại học - University of Technology and Management

---

## 1. TỔNG QUAN DỰ ÁN

### 1.1. Mục đích
Xây dựng hệ thống quản lý trường đại học với 2 luồng đăng nhập:
- **Học sinh**: Xem điểm, bài kiểm tra, học phí, thời khóa biểu, gửi phản ánh
- **Giáo viên**: Quản lý học sinh, chấm điểm, thêm/sửa/xóa học sinh, xem phản ánh

### 1.2. Công nghệ sử dụng
- **Frontend Framework**: React 18+ với Vite
- **Ngôn ngữ**: JavaScript (JSX)
- **Styling**: CSS thuần với phong cách RMIT
- **Dữ liệu**: File JSON tĩnh (public/data.json)
- **Font**: Inter (Google Fonts)

### 1.3. Đặc điểm nổi bật
- Giao diện chuyên nghiệp theo phong cách RMIT
- Responsive design (tương thích mobile, tablet, desktop)
- Quản lý dữ liệu bằng file JSON tĩnh
- Không sử dụng database, dữ liệu lưu trong memory

---

## 2. CẤU TRÚC DỰ ÁN

```
RMIT JOBs/
├── public/
│   └── data.json          # File dữ liệu JSON tĩnh
├── src/
│   ├── components/        # Các component React
│   │   ├── Login.jsx
│   │   ├── StudentDashboard.jsx
│   │   ├── TeacherDashboard.jsx
│   │   ├── ScoreView.jsx
│   │   ├── TestHistory.jsx
│   │   ├── TuitionView.jsx
│   │   ├── ScheduleView.jsx
│   │   ├── TeacherFeedback.jsx
│   │   ├── StudentManagement.jsx
│   │   └── StudentList.jsx
│   ├── utils/
│   │   └── dataService.js  # Service quản lý dữ liệu
│   ├── styles/
│   │   └── App.css         # CSS chính
│   ├── App.jsx             # Component gốc
│   └── main.jsx            # Entry point
├── package.json
└── vite.config.js
```

---

## 3. CHI TIẾT CÁC COMPONENT

### 3.1. App.jsx - Component gốc
**Chức năng**: 
- Quản lý authentication state (trạng thái đăng nhập)
- Load dữ liệu từ file JSON khi khởi động
- Điều hướng giữa Login, StudentDashboard và TeacherDashboard

**Luồng hoạt động**:
1. Load dữ liệu từ `/data.json` khi component mount
2. Kiểm tra user đã đăng nhập chưa
3. Hiển thị Login nếu chưa đăng nhập
4. Hiển thị Dashboard tương ứng với role (student/teacher)

**Code quan trọng**:
```javascript
- useState: Quản lý user và loading state
- useEffect: Load dữ liệu khi component mount
- handleLogin: Xử lý đăng nhập
- handleLogout: Xử lý đăng xuất
```

---

### 3.2. Login.jsx - Component đăng nhập
**Chức năng**:
- Form đăng nhập với username và password
- Validation đầu vào
- Xác thực thông tin với dữ liệu trong data.json

**Tính năng**:
- Kiểm tra username và password có tồn tại không
- Hiển thị thông báo lỗi nếu đăng nhập sai
- Giao diện gradient đẹp mắt với màu 

**UI Elements**:
- Input fields cho username và password
- Button đăng nhập
- Error message display

---

### 3.3. StudentDashboard.jsx - Dashboard học sinh
**Chức năng**:
- Giao diện chính cho học sinh sau khi đăng nhập
- Navigation sidebar với 5 tab chính
- Hiển thị nội dung tương ứng với tab được chọn

**5 Tab chính**:
1. **Xem điểm** (ScoreView): Hiển thị điểm các môn học
2. **Bài kiểm tra** (TestHistory): Lịch sử bài kiểm tra với timeline
3. **Học phí** (TuitionView): Quản lý học phí theo năm học
4. **Thời khóa biểu** (ScheduleView): Bảng thời khóa biểu dạng table
5. **Phản ánh giáo viên** (TeacherFeedback): Form gửi phản ánh

**Layout**:
- Header: Logo trường và thông tin user
- Sidebar: Navigation menu
- Main content: Nội dung tương ứng với tab

---

### 3.4. ScoreView.jsx - Xem điểm số
**Chức năng**:
- Hiển thị điểm số các môn học dạng bảng
- Tính điểm trung bình
- Phân loại điểm (Xuất sắc, Giỏi, Khá, Trung bình)

**Tính năng**:
- Màu sắc phân biệt theo điểm số:
  - Xanh lá (≥8.5): Xuất sắc
  - Xanh dương (≥7.0): Giỏi
  - Vàng (≥5.0): Khá
  - Đỏ (<5.0): Trung bình
- Hiển thị điểm trung bình ở footer

**Dữ liệu**:
- Đọc từ `dataService.getScores(studentId)`
- Format: `{ "Toán": 8.5, "Lý": 7.8, ... }`

---

### 3.5. TestHistory.jsx - Lịch sử bài kiểm tra
**Chức năng**:
- Hiển thị lịch sử bài kiểm tra với timeline design
- Sắp xếp theo thời gian (mới nhất trước)
- Hiển thị grade và badge màu sắc

**Design đặc biệt**:
- **Timeline layout**: Timeline dọc với marker và đường nối
- **Card design**: Card với shadow và hover effects
- **Grade system**: A+, A, B+, B, C+, C, D với màu sắc riêng
- **Icons**: SVG icons cho metadata

**Thông tin hiển thị**:
- Tên môn học với icon chữ cái đầu
- Ngày thi (đầy đủ và rút gọn)
- Điểm số với grade badge
- Loại bài kiểm tra (Giữa kỳ/Cuối kỳ)

---

### 3.6. TuitionView.jsx - Quản lý học phí
**Chức năng**:
- Hiển thị học phí 3 năm học
- Cho phép đóng học phí từng năm
- Validation: Chỉ đóng được năm tiếp theo sau khi hoàn thành năm trước

**Tính năng chính**:
- **Hiển thị 3 năm**: Năm 1 (400 triệu/tháng), Năm 2 (450 triệu/tháng), Năm 3 (500 triệu/tháng)
- **Progress bar**: Hiển thị tiến độ đóng học phí
- **Payment modal**: Form đóng học phí với options:
  - Đóng toàn bộ
  - Đóng 1 tháng
  - Nhập số tiền tùy chỉnh
- **Status badges**: Đã hoàn thành, Đang đóng, Chưa đóng

**Luồng đóng học phí**:
1. Click "Đóng học phí" trên năm học
2. Kiểm tra năm trước đã hoàn thành chưa
3. Mở modal với form nhập số tiền
4. Cập nhật vào state và hiển thị lại

---

### 3.7. ScheduleView.jsx - Thời khóa biểu
**Chức năng**:
- Hiển thị thời khóa biểu dạng bảng
- Sắp xếp các lớp học theo thời gian trong ngày
- Màu sắc phân biệt môn học

**Layout**:
- **Bảng dạng table**: 
  - Cột: Thời gian, Thứ 2-7
  - Hàng: Các khung giờ học (07:00-18:00)
- **Màu sắc môn học**:
  - Toán: #003d82 (Navy)
  - Lý: #0066cc (Blue)
  - Hóa: #0080ff (Light Blue)
  - Văn: #00a3ff (Sky Blue)
  - Anh: #00ccff (Cyan)
- **Legend**: Chú thích màu sắc ở dưới bảng

**Responsive**:
- Trên mobile: Scroll ngang để xem toàn bộ bảng
- Font size và padding tự điều chỉnh

---

### 3.8. TeacherFeedback.jsx - Phản ánh giáo viên
**Chức năng**:
- Form gửi phản ánh về giáo viên
- Hiển thị lịch sử phản ánh đã gửi
- Status tracking (Chờ xử lý/Đã xem)

**Tính năng**:
- **Form gửi phản ánh**:
  - Chọn môn học
  - Nhập nội dung phản ánh
  - Submit và hiển thị success message
- **Lịch sử phản ánh**:
  - Card design với status badge
  - Hiển thị ngày gửi và trạng thái

---

### 3.9. TeacherDashboard.jsx - Dashboard giáo viên
**Chức năng**:
- Giao diện chính cho giáo viên
- 3 tab chính:
  1. **Quản lý học sinh** (StudentManagement)
  2. **Danh sách học sinh** (StudentList)
  3. **Phản ánh từ học sinh** (Feedbacks)

**Layout**:
- Tương tự StudentDashboard nhưng với tabs khác
- Header với logo và thông tin giáo viên

---

### 3.10. StudentManagement.jsx - Quản lý học sinh
**Chức năng**:
- CRUD operations cho học sinh:
  - **Create**: Thêm học sinh mới
  - **Read**: Xem danh sách học sinh
  - **Update**: Sửa thông tin học sinh
  - **Delete**: Xóa học sinh
- Chấm điểm và thêm bài kiểm tra

**Tính năng chi tiết**:

**1. Bảng danh sách học sinh**:
- Hiển thị: Mã SV, Họ tên, Email, Năm học, Thao tác
- Action buttons với icons:
  - Sửa (Edit): Màu xanh dương
  - Điểm (Score): Màu xanh lá
  - Bài KT (Test): Màu tím
  - Xóa (Delete): Màu đỏ

**2. Thêm học sinh**:
- Modal form với các trường:
  - ID đăng nhập
  - Mã sinh viên
  - Họ tên
  - Email
  - Năm học
- Validation: Kiểm tra ID và mã SV không trùng

**3. Sửa học sinh**:
- Modal form với thông tin hiện tại
- Có thể sửa: Tên, Email, Năm học

**4. Chấm điểm**:
- Modal với dropdown chọn môn học
- Input điểm số (0-10)
- Validation điểm số hợp lệ

**5. Thêm bài kiểm tra**:
- Modal form với:
  - Môn học
  - Ngày thi
  - Điểm số
  - Loại bài kiểm tra (Giữa kỳ/Cuối kỳ)

**6. Xóa học sinh**:
- Confirmation dialog trước khi xóa
- Xóa tất cả dữ liệu liên quan (điểm, bài kiểm tra, học phí, thời khóa biểu)

---

### 3.11. StudentList.jsx - Danh sách học sinh
**Chức năng**:
- Hiển thị danh sách học sinh dạng grid cards
- Xem chi tiết từng học sinh
- Hiển thị điểm trung bình

**Tính năng**:
- **Card design**: Mỗi học sinh một card
- **Thông tin hiển thị**: Tên, Mã SV, Email, Năm học, Điểm TB
- **Modal chi tiết**: Click vào card để xem chi tiết và điểm các môn

---

## 4. UTILS - DATA SERVICE

### 4.1. dataService.js
**Chức năng**: Quản lý tất cả dữ liệu từ file JSON

**Các hàm chính**:

**Load Data**:
- `loadData()`: Load dữ liệu từ `/data.json` một lần duy nhất

**Get Data**:
- `getUsers()`: Lấy danh sách users
- `getStudents()`: Lấy danh sách học sinh
- `getScores(studentId)`: Lấy điểm số của học sinh
- `getTests(studentId)`: Lấy bài kiểm tra của học sinh
- `getTuition(studentId)`: Lấy học phí của học sinh
- `getSchedule(studentId)`: Lấy thời khóa biểu của học sinh
- `getFeedbacks()`: Lấy tất cả phản ánh

**Update Data**:
- `addStudent(student)`: Thêm học sinh mới
- `updateStudent(studentId, updates)`: Cập nhật thông tin học sinh
- `deleteStudent(studentId)`: Xóa học sinh
- `updateScore(studentId, subject, score)`: Cập nhật điểm số
- `addTest(studentId, test)`: Thêm bài kiểm tra
- `updateTuition(studentId, year, amount)`: Cập nhật học phí
- `addFeedback(feedback)`: Thêm phản ánh

**Lưu ý**: Tất cả thay đổi chỉ lưu trong memory, không persist vào file JSON

---

## 5. DỮ LIỆU - DATA.JSON

### 5.1. Cấu trúc dữ liệu
File `public/data.json` chứa tất cả dữ liệu:

```json
{
  "users": [...],        // Danh sách users (học sinh + giáo viên)
  "students": [...],     // Thông tin học sinh
  "scores": {...},       // Điểm số theo studentId
  "tests": {...},        // Bài kiểm tra theo studentId
  "tuition": {...},      // Học phí theo studentId
  "schedule": {...},     // Thời khóa biểu theo studentId
  "feedbacks": [...]     // Phản ánh từ học sinh
}
```

### 5.2. Dữ liệu mẫu
- **4 học sinh**: student1, student2, student3, student4
- **1 giáo viên**: teacher1
- **Mật khẩu mặc định**: 123456

### 5.3. Học phí
- **Năm 1**: 400.000.000 VND/tháng × 12 = 4.800.000.000 VND
- **Năm 2**: 450.000.000 VND/tháng × 12 = 5.400.000.000 VND
- **Năm 3**: 500.000.000 VND/tháng × 12 = 6.000.000.000 VND

---

## 6. STYLING - APP.CSS

### 6.1. Design System
**Màu sắc chính**:
- **Primary**: #003d82 (RMIT Navy)
- **Secondary**: #0052a3 (RMIT Blue)
- **Accent**: #e60012 (RMIT Red)
- **Success**: #27ae60 (Green)
- **Warning**: #f39c12 (Orange)
- **Danger**: #e74c3c (Red)

**Typography**:
- **Font**: Inter (Google Fonts)
- **Font weights**: 300, 400, 500, 600, 700, 800

### 6.2. Component Styles
- **Login**: Gradient background với animation
- **Dashboard**: Header với gradient, sidebar navigation
- **Cards**: Shadow, border-radius, hover effects
- **Buttons**: Gradient, hover effects, icons
- **Tables**: Clean design với hover states
- **Modals**: Overlay với centered content

### 6.3. Responsive Design
- **Mobile** (< 768px): 
  - Sidebar thành horizontal scroll
  - Tables scroll ngang
  - Buttons full width
  - Cards stack vertically

---

## 7. LUỒNG HOẠT ĐỘNG

### 7.1. Luồng đăng nhập
1. User mở trang web
2. App.jsx load dữ liệu từ data.json
3. Hiển thị Login component
4. User nhập username và password
5. Kiểm tra với dữ liệu trong users
6. Nếu đúng → Set user state → Hiển thị Dashboard tương ứng
7. Nếu sai → Hiển thị error message

### 7.2. Luồng học sinh
1. Đăng nhập với tài khoản học sinh
2. Vào StudentDashboard
3. Chọn tab muốn xem:
   - Xem điểm → ScoreView
   - Bài kiểm tra → TestHistory
   - Học phí → TuitionView (có thể đóng học phí)
   - Thời khóa biểu → ScheduleView
   - Phản ánh → TeacherFeedback (có thể gửi phản ánh)

### 7.3. Luồng giáo viên
1. Đăng nhập với tài khoản giáo viên
2. Vào TeacherDashboard
3. Chọn tab:
   - Quản lý học sinh → StudentManagement:
     - Xem danh sách
     - Thêm/Sửa/Xóa học sinh
     - Chấm điểm
     - Thêm bài kiểm tra
   - Danh sách học sinh → StudentList (xem chi tiết)
   - Phản ánh → Xem phản ánh từ học sinh

---

## 8. TÍNH NĂNG NỔI BẬT

### 8.1. Giao diện đẹp mắt
- Design theo phong cách RMIT
- Gradient backgrounds
- Smooth animations
- Professional color scheme

### 8.2. UX tốt
- Icons cho mọi action
- Tooltips và labels rõ ràng
- Loading states
- Error handling
- Success messages

### 8.3. Responsive
- Hoạt động tốt trên mọi thiết bị
- Mobile-friendly navigation
- Touch-friendly buttons

### 8.4. Validation
- Form validation
- Score validation (0-10)
- Duplicate check
- Required fields

---

## 9. ĐIỂM MẠNH CỦA DỰ ÁN

1. **Code structure**: Tổ chức rõ ràng, dễ maintain
2. **Component reusability**: Components có thể tái sử dụng
3. **Separation of concerns**: Logic tách biệt với UI
4. **Modern React**: Sử dụng hooks (useState, useEffect)
5. **Professional UI**: Giao diện chuyên nghiệp, đẹp mắt
6. **Complete features**: Đầy đủ tính năng CRUD
7. **Data management**: Quản lý dữ liệu tập trung

---

## 10. HƯỚNG PHÁT TRIỂN

### 10.1. Có thể cải thiện
- Thêm backend API thay vì file JSON
- Thêm authentication thật (JWT)
- Thêm database (PostgreSQL/MongoDB)
- Thêm pagination cho danh sách
- Thêm search và filter
- Thêm export PDF/Excel
- Thêm notifications system
- Thêm dark mode

### 10.2. Tính năng mở rộng
- Quản lý lớp học
- Quản lý môn học
- Quản lý giáo viên
- Thống kê và báo cáo
- Email notifications
- SMS notifications

---

## 11. HƯỚNG DẪN CHẠY DỰ ÁN

### 11.1. Cài đặt
```bash
npm install
```

### 11.2. Chạy development server
```bash
npm run dev
```

### 11.3. Build production
```bash
npm run build
```

### 11.4. Preview production build
```bash
npm run preview
```

---

## 12. TÀI KHOẢN ĐĂNG NHẬP

### Học sinh:
- **student1** / 123456
- **student2** / 123456
- **student3** / 123456
- **student4** / 123456

### Giáo viên:
- **teacher1** / 123456

---

## KẾT LUẬN

Dự án này là một hệ thống quản lý trường đại học hoàn chỉnh với:
- ✅ Giao diện đẹp mắt, chuyên nghiệp
- ✅ Đầy đủ tính năng CRUD
- ✅ 2 luồng đăng nhập (Học sinh/Giáo viên)
- ✅ Responsive design
- ✅ Code structure tốt
- ✅ Dễ mở rộng và maintain

Dự án thể hiện khả năng sử dụng React, JavaScript, CSS và quản lý state một cách hiệu quả.

---

**Tác giả**: [Tên của bạn]
**Ngày**: [Ngày thuyết trình]
**Môn học**: [Tên môn học]

