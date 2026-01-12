import { Request, Response, NextFunction } from 'express';

export interface IBaseController {
  getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
  getById(req: Request, res: Response, next: NextFunction): Promise<void>;
  create(req: Request, res: Response, next: NextFunction): Promise<void>;
  update(req: Request, res: Response, next: NextFunction): Promise<void>;
  delete(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export abstract class BaseController implements IBaseController {
  protected service: any;

  constructor(service: any) {
    this.service = service;
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = req.query;
      const items = await this.service.getAll(filters);
      res.status(200).json({
        success: true,
        data: items,
        count: items.length,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const item = await this.service.getById(id);
      res.status(200).json({
        success: true,
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = req.body;
      const item = await this.service.create(data);
      res.status(201).json({
        success: true,
        data: item,
        message: 'Resource created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const data = req.body;
      const item = await this.service.update(id, data);
      res.status(200).json({
        success: true,
        data: item,
        message: 'Resource updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const item = await this.service.delete(id);
      res.status(200).json({
        success: true,
        data: item,
        message: 'Resource deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
