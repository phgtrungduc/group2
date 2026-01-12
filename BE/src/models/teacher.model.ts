// Teacher Entity - Teacher-specific data
export interface Teacher {
  id: string;
  user_id: string;
  teacher_code: string;
  department?: string;
  specialization?: string;
  phone?: string;
  hire_date: Date;
  created_at?: Date;
  updated_at?: Date;
}

// Teacher with User data (JOIN result)
export interface TeacherFull extends Teacher {
  username: string;
  name: string;
  email: string;
  role: number;
}

// Create Teacher DTO
export interface CreateTeacherDto {
  username: string;
  password: string;
  name: string;
  email: string;
  teacher_code: string;
  department?: string;
  specialization?: string;
  phone?: string;
}

// Update Teacher DTO
export interface UpdateTeacherDto {
  department?: string;
  specialization?: string;
  phone?: string;
}
