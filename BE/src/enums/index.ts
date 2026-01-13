/**
 * User roles enum
 */
export enum Role {
  ADMIN = 1,
  STUDENT = 2,
  TEACHER = 3
}

/**
 * Score types enum
 */
export enum ScoreType {
  MIDTERM = 1,
  FINAL = 2,
  QUIZ = 3,
  ASSIGNMENT = 4,
  OTHER = 5
}

/**
 * Role name mappings
 */
export const RoleNames: Record<Role, string> = {
  [Role.ADMIN]: 'Admin',
  [Role.STUDENT]: 'Student',
  [Role.TEACHER]: 'Teacher'
};

/**
 * Score type name mappings
 */
export const ScoreTypeNames: Record<ScoreType, string> = {
  [ScoreType.MIDTERM]: 'Giữa kỳ',
  [ScoreType.FINAL]: 'Cuối kỳ',
  [ScoreType.QUIZ]: 'Kiểm tra',
  [ScoreType.ASSIGNMENT]: 'Bài tập',
  [ScoreType.OTHER]: 'Khác'
};

/**
 * Helper function to validate role
 */
export function isValidRole(role: number): role is Role {
  return Object.values(Role).includes(role);
}

/**
 * Helper function to validate score type
 */
export function isValidScoreType(type: number): type is ScoreType {
  return Object.values(ScoreType).includes(type);
}
