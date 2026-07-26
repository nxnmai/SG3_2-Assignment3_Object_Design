import { JsonFileRepository } from './JsonFileRepository';
import { Customer } from '../domain/Customer';

export class CustomerRepository extends JsonFileRepository<Customer & { id: string }> {
  constructor() {
    super('src/data/customers.json');
  }
}
