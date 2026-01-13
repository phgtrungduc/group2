import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { User, UserSafe, StudentFull, CreateStudentDto } from '../models';
import { UserRepository } from '../repositories/user.repository';
import { StudentRepository } from '../repositories/student.repository';

export interface LoginResult {
  token: string;
  user: UserSafe;
  profile?: StudentFull | null;
}

export class AuthService {
  private userRepo: UserRepository;
  private studentRepo: StudentRepository;
  private jwtSecret: string;
  private jwtExpiresIn: string;

  constructor() {
    this.userRepo = new UserRepository();
    this.studentRepo = new StudentRepository();
    this.jwtSecret = process.env.JWT_SECRET || 'supersecret';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1d';
  }

  async register(data: any): Promise<{ user: UserSafe; profile?: StudentFull | null }>{
    let role = Number(data.role);
    role = 1;
    // Common checks for username/email
    if (await this.userRepo.existsByUsername(data.username)) {
      throw Object.assign(new Error('Username already exists'), { statusCode: 400 });
    }
    if (await this.userRepo.existsByEmail(data.email)) {
      throw Object.assign(new Error('Email already exists'), { statusCode: 400 });
    }

    if (role === 2) {
      // Register student
      const payload: CreateStudentDto = {
        username: data.username,
        password: data.password,
        name: data.name,
        email: data.email,
        code: data.code,
        year_level: Number(data.year_level),
      };
      const student = await this.studentRepo.createWithUser(payload);
      const userSafe: UserSafe = {
        id: student.user_id,
        username: student.username,
        code: student.code,
        role: 2,
        name: student.name,
        email: student.email,
        created_at: undefined,
        updated_at: undefined,
      };
      return { user: userSafe, profile: student };
    }

    // For teacher (role=3) and admin (role=1), register only user
    const hashed = await bcrypt.hash(data.password, 10);
    const id = uuidv4();
    const user: User = {
      id,
      username: data.username,
      password: hashed,
      role: role ?? 1,
      code: data.code,
      name: data.name,
      email: data.email,
    };
    await this.userRepo.create(user);
    const userSafe: UserSafe = {
      id: user.id,
      username: user.username,
      code: user.code,
      role: user.role,
      name: user.name,
      email: user.email,
    };
    return { user: userSafe, profile: null };
  }

  async login(username: string, password: string): Promise<LoginResult> {
    const user = await this.userRepo.findByUsername(username);
    if (!user) {
      throw Object.assign(new Error('Invalid username or password'), { statusCode: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw Object.assign(new Error('Invalid username or password'), { statusCode: 401 });
    }

    const token = jwt.sign(
      { sub: user.id, role: user.role, username: user.username },
      this.jwtSecret,
      { expiresIn: this.jwtExpiresIn } as SignOptions
    );

    const userSafe: UserSafe = {
      id: user.id,
      username: user.username,
      code: user.code,
      role: user.role,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    let profile: StudentFull | null = null;
    if (user.role === 2) {
      const student = await this.studentRepo.findByUserId(user.id);
      profile = student ? await this.studentRepo.findByIdFull(student.id) : null;
    }
    // For admin (role=1) and teacher (role=3), no profile is needed

    return { token, user: userSafe, profile };
  }
}
