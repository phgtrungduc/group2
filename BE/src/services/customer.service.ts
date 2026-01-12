import { Customer } from '@prisma/client';
import { BaseService } from './base.service';
import { CustomerRepository } from '../repositories/customer.repository';

export interface CreateCustomerDTO {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface UpdateCustomerDTO {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface CustomerFilters {
  name?: string;
  email?: string;
  phone?: string;
}

export class CustomerService extends BaseService<Customer> {
  private customerRepository: CustomerRepository;

  constructor() {
    const repository = new CustomerRepository();
    super(repository);
    this.customerRepository = repository;
  }

  async create(data: CreateCustomerDTO): Promise<Customer> {
    // Check if email already exists
    const existingCustomer = await this.customerRepository.findByEmail(data.email);
    if (existingCustomer) {
      throw new Error('Customer with this email already exists');
    }
    return await super.create(data);
  }

  async getAll(filters?: CustomerFilters): Promise<Customer[]> {
    if (filters && Object.keys(filters).length > 0) {
      return await this.customerRepository.findWithFilters(filters);
    }
    return await super.getAll();
  }

  async update(id: string, data: UpdateCustomerDTO): Promise<Customer> {
    // If email is being updated, check if it's unique
    if (data.email) {
      const existingCustomer = await this.customerRepository.findByEmail(data.email);
      if (existingCustomer && existingCustomer.id !== id) {
        throw new Error('Customer with this email already exists');
      }
    }
    return await super.update(id, data);
  }
}
