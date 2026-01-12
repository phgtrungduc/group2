// Score Entity
export interface Score {
  id: string;
  student_id: string;
  subject_id: string;
  semester: number; // 1 or 2
  year_level: number; // 1, 2, 3
  midterm_score?: number;
  final_score?: number;
  average_score?: number;
  grade?: string; // A, B, C, D, F
  teacher_id?: string;
  created_at?: Date;
  updated_at?: Date;
}

// Score with related data (JOIN result)
export interface ScoreFull extends Score {
  student_name: string;
  student_code: string;
  subject_name: string;
  subject_code: string;
  teacher_name?: string;
}

// Create Score DTO
export interface CreateScoreDto {
  student_id: string;
  subject_id: string;
  semester: number;
  year_level: number;
  midterm_score?: number;
  final_score?: number;
  teacher_id?: string;
}

// Update Score DTO
export interface UpdateScoreDto {
  midterm_score?: number;
  final_score?: number;
  teacher_id?: string;
}
