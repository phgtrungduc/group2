import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const authService = {
  // Đăng nhập
  async login(username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = (await response.json()).data;

      if (!response.ok) {
        throw new Error(data.error || 'Đăng nhập thất bại');
      }

      // Lưu token và user info vào localStorage
      this.saveAuth(data.token, data.user, data.profile);

      return {
        token: data.token,
        user: data.user,
        profile: data.profile,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Lưu thông tin xác thực
  saveAuth(token, user, profile) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify({ ...user, profile }));
  },

  // Lấy token
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Lấy thông tin user từ localStorage
  getUser() {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  },

  // Kiểm tra đã đăng nhập chưa
  isAuthenticated() {
    return !!this.getToken();
  },

  // Đăng xuất
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Get authorization header
  getAuthHeader() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};
