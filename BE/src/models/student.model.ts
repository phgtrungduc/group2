// Student Entity - Student-specific data
export interface Student {
  id: string;
  user_id: string;
  year_level: number; // 1, 2, 3
  created_at?: Date;
  updated_at?: Date;
}

// Student with User data (JOIN result)
export interface StudentFull extends Student {
  username: string;
  code?: string;
  name: string;
  email: string;
  role: number;
}

// Create Student DTO
export interface CreateStudentDto {
  username: string;
  password: string;
  name: string;
  email: string;
  code?: string;
  year_level: number;
}

// Update Student DTO
export interface UpdateStudentDto {
  year_level?: number;
}
