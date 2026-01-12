// Subject Entity
export interface Subject {
  id: string;
  subject_code: string;
  subject_name: string;
  credits: number;
  description?: string;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

// Create Subject DTO
export interface CreateSubjectDto {
  subject_code: string;
  subject_name: string;
  credits: number;
  description?: string;
}

// Update Subject DTO
export interface UpdateSubjectDto {
  subject_name?: string;
  credits?: number;
  description?: string;
  is_active?: boolean;
}
