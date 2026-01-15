// Score Entity
export interface Score {
  id: string;
  student_id: string;
  subject_id: string;
  type: number; // 1=midterm, 2=final, 3=quiz, 4=assignment, 5=other
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
  type: number; // Use enum value
  score: number;
}

// Update Score DTO
export interface UpdateScoreDto {
  type?: number; // Use enum value
  score?: number;
}
