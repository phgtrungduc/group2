// User Entity - Authentication data
export interface User {
  id: string;
  username: string;
  password: string;
  role: number; // 0=admin, 1=student, 2=teacher
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
