import { BaseRepository } from './base.repository';
import { User, UserSafe } from '../models';

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super('users');
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.queryOne<User>(
      `SELECT * FROM ${this.tableName} WHERE username = ?`,
      [username]
    );
  }

  async existsByUsername(username: string): Promise<boolean> {
    const result = await this.queryOne<{ count: number }>(
      `SELECT COUNT(*) as count FROM ${this.tableName} WHERE username = ?`,
      [username]
    );
    return (result?.count || 0) > 0;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const result = await this.queryOne<{ count: number }>(
      `SELECT COUNT(*) as count FROM ${this.tableName} WHERE email = ?`,
      [email]
    );
    return (result?.count || 0) > 0;
  }
}
