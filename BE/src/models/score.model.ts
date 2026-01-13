// Score Entity
export interface Score {
  id: string;
  student_id: string;
  subject_id: string;
  type: 'midterm' | 'final' | 'quiz' | 'assignment' | 'other';
  score: number;
  created_at?: Date;
  updated_at?: Date;
}

// Score with related data (JOIN result)
export interface ScoreFull extends Score {
  student_name: string;
  student_code: string;
  subject_name: string;
  subject_code: string;
}

// Create Score DTO
export interface CreateScoreDto {
  student_id: string;
  subject_id: string;
  type: 'midterm' | 'final' | 'quiz' | 'assignment' | 'other';
  score: number;
}

// Update Score DTO
export interface UpdateScoreDto {
  type?: 'midterm' | 'final' | 'quiz' | 'assignment' | 'other';
  score?: number;
}
