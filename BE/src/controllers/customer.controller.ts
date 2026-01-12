import { BaseController } from './base.controller';
import { CustomerService } from '../services/customer.service';

export class CustomerController extends BaseController {
  constructor() {
    const service = new CustomerService();
    super(service);
  }
}
