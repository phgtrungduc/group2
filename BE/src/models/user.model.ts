// User Entity - Authentication data
export interface User {
  id: string;
  username: string;
  password: string;
  role: number; // 1=admin, 2=student, 3=teacher
  code?: string; // SV001, GV001, AD001
  name: string;
  email: string;
  created_at?: Date;
  updated_at?: Date;
}

// Create User DTO (Data Transfer Object)
export interface CreateUserDto {
  username: string;
  password: string;
  role: number;
  code?: string;
  name: string;
  email: string;
}

// Update User DTO
export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
}

// User without password (for API responses)
export type UserSafe = Omit<User, 'password'>;
