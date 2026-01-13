import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const required = ['username', 'password', 'name', 'email', 'role'];
      for (const field of required) {
        if (!req.body[field]) {
          return res.status(400).json({ success: false, error: `${field} is required` });
        }
      }

      const role = Number(req.body.role);
      if (![1,2,3].includes(role)) {
        return res.status(400).json({ success: false, error: 'role must be 1, 2 or 3' });
      }

      // Check authorization based on JWT role if authenticated
      const currentUser = (req as any).user;
      if (currentUser) {
        const currentRole = currentUser.role;
        
        // Student (role=2) cannot create any users
        if (currentRole === 2) {
          return res.status(403).json({ 
            success: false, 
            error: 'Students are not allowed to create users' 
          });
        }
        
        // Teacher (role=3) can only create teachers and students
        if (currentRole === 3 && role === 1) {
          return res.status(403).json({ 
            success: false, 
            error: 'Teachers cannot create admin users' 
          });
        }
        
        // Admin (role=1) can create any role - no restriction
      }

      if (role === 2) {
        if (!req.body.student_code || !req.body.year_level) {
          return res.status(400).json({ success: false, error: 'student_code and year_level are required for student' });
        }
      }

      if (role === 3) {
        if (!req.body.teacher_code) {
          return res.status(400).json({ success: false, error: 'teacher_code is required for teacher' });
        }
      }

      const result = await this.authService.register(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ success: false, error: 'username and password are required' });
      }

      const result = await this.authService.login(username, password);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
