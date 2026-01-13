# Frontend Authentication Setup

## Cấu hình đã hoàn thành

### 1. API Configuration
- **File**: `src/config/api.js`
- **Base URL**: `http://localhost:3000/api`
- **Endpoints**: LOGIN, REGISTER, CUSTOMERS

### 2. Auth Service
- **File**: `src/services/authService.js`
- **Chức năng**:
  - `login(username, password)`: Đăng nhập qua API
  - `logout()`: Xóa thông tin đăng nhập
  - `getUser()`: Lấy thông tin user từ localStorage
  - `isAuthenticated()`: Kiểm tra trạng thái đăng nhập
  - `getAuthHeader()`: Lấy header Authorization cho API calls

### 3. Global State Management
- **File**: `src/contexts/AuthContext.jsx`
- **Provider**: `AuthProvider` - Wrap toàn bộ app
- **Hook**: `useAuth()` - Sử dụng trong components
- **State**: user, login, logout, isAuthenticated, loading

### 4. LocalStorage
Thông tin lưu trong localStorage:
- `auth_token`: JWT token từ backend
- `auth_user`: Thông tin user (id, username, name, email, role, code, profile)

### 5. Auto-login sau khi F5
- Khi component mount, AuthContext tự động check localStorage
- Nếu có token và user info hợp lệ → tự động đăng nhập
- Transform role từ số (1,2,3) sang string (admin, student, teacher)

## Cách sử dụng trong components

### Trong component cần access user info:

```jsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, logout, isAuthenticated } = useAuth();
  
  return (
    <div>
      {isAuthenticated && <p>Xin chào {user.name}</p>}
      <button onClick={logout}>Đăng xuất</button>
    </div>
  );
}
```

### Gọi API với authentication:

```jsx
import { authService } from '../services/authService';

async function callProtectedAPI() {
  const response = await fetch('http://localhost:3000/api/customers', {
    headers: {
      'Content-Type': 'application/json',
      ...authService.getAuthHeader(), // Thêm Bearer token
    },
  });
  return response.json();
}
```

## Flow đăng nhập

1. User nhập username/password
2. Gọi API `POST /api/auth/login`
3. Backend trả về: `{ token, user, profile }`
4. Frontend lưu vào localStorage
5. Update global state (AuthContext)
6. Redirect đến dashboard tương ứng

## Flow F5 (Refresh page)

1. App component mount
2. AuthContext kiểm tra localStorage
3. Nếu có token → getUser()
4. Transform role number sang string
5. Set user state → auto login
6. Show dashboard tương ứng

## Chạy ứng dụng

### Backend (Terminal 1):
```bash
cd BE
npm run dev
# Chạy tại http://localhost:3000
```

### Frontend (Terminal 2):
```bash
cd FE
npm run dev
# Chạy tại http://localhost:5173
```

## Test đăng nhập

1. Mở http://localhost:5173
2. Nhập username/password (từ database)
3. Đăng nhập thành công → redirect dashboard
4. F5 trang web → vẫn giữ trạng thái đăng nhập
5. Click đăng xuất → xóa localStorage và quay về login

## Mapping Role

Backend (số) → Frontend (string):
- 1 → 'admin'
- 2 → 'student'
- 3 → 'teacher'
