// Test Entity
export interface Test {
  id: string;
  student_id: string;
  subject_id: string;
  test_type: 'midterm' | 'final' | 'quiz' | 'assignment';
  test_date: Date;
  score: number;
  max_score: number;
  weight: number;
  remarks?: string;
  teacher_id?: string;
  created_at?: Date;
  updated_at?: Date;
}

// Test with related data
export interface TestFull extends Test {
  student_name: string;
  student_code: string;
  subject_name: string;
  subject_code: string;
  teacher_name?: string;
}

// Create Test DTO
export interface CreateTestDto {
  student_id: string;
  subject_id: string;
  test_type: 'midterm' | 'final' | 'quiz' | 'assignment';
  test_date: Date;
  score: number;
  max_score?: number;
  weight?: number;
  remarks?: string;
  teacher_id?: string;
}

// Update Test DTO
export interface UpdateTestDto {
  score?: number;
  remarks?: string;
  test_date?: Date;
}
