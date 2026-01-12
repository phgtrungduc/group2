// Student Entity - Student-specific data
export interface Student {
  id: string;
  user_id: string;
  student_code: string;
  year_level: number; // 1, 2, 3
  phone?: string;
  address?: string;
  date_of_birth?: Date;
  enrollment_date: Date;
  created_at?: Date;
  updated_at?: Date;
}

// Student with User data (JOIN result)
export interface StudentFull extends Student {
  username: string;
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
  student_code: string;
  year_level: number;
  phone?: string;
  address?: string;
  date_of_birth?: Date;
}

// Update Student DTO
export interface UpdateStudentDto {
  phone?: string;
  address?: string;
  year_level?: number;
}
