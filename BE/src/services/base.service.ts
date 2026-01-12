import { IBaseRepository } from '../repositories/base.repository';

export interface IBaseService<T> {
  getAll(filters?: any): Promise<T[]>;
  getById(id: string): Promise<T>;
  create(data: any): Promise<T>;
  update(id: string, data: any): Promise<T>;
  delete(id: string): Promise<T>;
}

export abstract class BaseService<T> implements IBaseService<T> {
  protected repository: IBaseRepository<T>;

  constructor(repository: IBaseRepository<T>) {
    this.repository = repository;
  }

  async getAll(filters?: any): Promise<T[]> {
    return await this.repository.findAll(filters);
  }

  async getById(id: string): Promise<T> {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new Error('Resource not found');
    }
    return item;
  }

  async create(data: any): Promise<T> {
    return await this.repository.create(data);
  }

  async update(id: string, data: any): Promise<T> {
    await this.getById(id); // Check if exists
    
    return await this.repository.update(id, data);
  }

  async delete(id: string): Promise<T> {
    await this.getById(id); // Check if exists
    return await this.repository.delete(id);
  }
}
