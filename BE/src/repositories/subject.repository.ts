import { BaseRepository } from './base.repository';
import { Subject, CreateSubjectDto } from '../models';

export class SubjectRepository extends BaseRepository<Subject> {
  constructor() {
    super('subjects');
  }

  /**
   * Find subject by code
   */
  async findByCode(subjectCode: string): Promise<Subject | null> {
    return this.queryOne<Subject>(
      `SELECT * FROM ${this.tableName} WHERE subject_code = ?`,
      [subjectCode]
    );
  }

  /**
   * Find active subjects
   */
  async findActive(): Promise<Subject[]> {
    return this.query<Subject>(
      `SELECT * FROM ${this.tableName} WHERE is_active = TRUE ORDER BY subject_code`
    );
  }

  /**
   * Search subjects by name
   */
  async searchByName(keyword: string): Promise<Subject[]> {
    return this.query<Subject>(
      `SELECT * FROM ${this.tableName} WHERE subject_name LIKE ? ORDER BY subject_name`,
      [`%${keyword}%`]
    );
  }
}
