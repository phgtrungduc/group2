import { Customer } from '@prisma/client';
import { prisma } from '../config/database';
import { BaseRepository } from './base.repository';

export class CustomerRepository extends BaseRepository<Customer> {
  constructor() {
    super(prisma.customer);
  }

  // Custom methods specific to Customer can be added here
  async findByEmail(email: string): Promise<Customer | null> {
    return await this.model.findUnique({ where: { email } });
  }

  async findWithFilters(filters: {
    name?: string;
    email?: string;
    phone?: string;
  }): Promise<Customer[]> {
    const where: any = {};

    if (filters.name) {
      where.name = { contains: filters.name };
    }
    if (filters.email) {
      where.email = { contains: filters.email };
    }
    if (filters.phone) {
      where.phone = { contains: filters.phone };
    }

    return await this.model.findMany({ where });
  }
}
