import { BaseRepository } from './base.repository';
import { User, UserSafe, CreateUserDto, UpdateUserDto } from '../models';
import { RowDataPacket } from 'mysql2/promise';

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super('users');
  }

  /**
   * Find user by username
   */
  async findByUsername(username: string): Promise<User | null> {
    return this.queryOne<User>(
      `SELECT * FROM ${this.tableName} WHERE username = ?`,
      [username]
    );
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.queryOne<User>(
      `SELECT * FROM ${this.tableName} WHERE email = ?`,
      [email]
    );
  }

  /**
   * Find users by role
   */
  async findByRole(role: number): Promise<User[]> {
    return this.query<User>(
      `SELECT * FROM ${this.tableName} WHERE role = ?`,
      [role]
    );
  }

  /**
   * Get user without password (safe)
   */
  async findByIdSafe(id: string): Promise<UserSafe | null> {
    return this.queryOne<UserSafe>(
      `SELECT id, username, role, name, email, created_at, updated_at 
       FROM ${this.tableName} WHERE id = ?`,
      [id]
    );
  }

  /**
   * Check if username exists
   */
  async existsByUsername(username: string): Promise<boolean> {
    const result = await this.queryOne<{ count: number }>(
      `SELECT COUNT(*) as count FROM ${this.tableName} WHERE username = ?`,
      [username]
    );
    return (result?.count || 0) > 0;
  }

  /**
   * Check if email exists
   */
  async existsByEmail(email: string): Promise<boolean> {
    const result = await this.queryOne<{ count: number }>(
      `SELECT COUNT(*) as count FROM ${this.tableName} WHERE email = ?`,
      [email]
    );
    return (result?.count || 0) > 0;
  }
}
