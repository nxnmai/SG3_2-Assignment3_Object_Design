// Customer — Domain class (A2 CRC: profile management, order history)
// CHANGES vs A2: Added validation, Vietnamese error messages, explicit invariants

import { validatePhone, validateEmail } from '@/utils/validators';
import { getMessage } from '@/utils/validationMessages';
import { idGenerator } from '@/utils/idGenerator';

export interface CustomerInput {
  name: string;
  phone: string;
  email: string;
  address: string;
}

export class Customer {
  public readonly id: string;
  public name: string;
  public phone: string;
  public email: string;
  public address: string;
  public readonly createdAt: Date;
  public readonly orderIds: string[] = [];

  constructor(input: CustomerInput) {
    // Validation (Information Expert: Customer owns its data rules)
    if (!input.name?.trim()) throw new Error(getMessage('required', 'Tên'));
    if (!validatePhone(input.phone)) throw new Error(getMessage('invalidPhone'));
    if (!validateEmail(input.email)) throw new Error(getMessage('invalidEmail'));
    if (!input.address?.trim()) throw new Error(getMessage('invalidAddress'));

    this.id = idGenerator.generateCustomerId();
    this.name = input.name.trim();
    this.phone = input.phone;
    this.email = input.email.toLowerCase();
    this.address = input.address.trim();
    this.createdAt = new Date();
  }

  // Responsibility: Update profile (T4 from A1)
  updateProfile(updates: Partial<Pick<CustomerInput, 'name' | 'email' | 'address'>>): void {
    if (updates.name !== undefined) {
      if (!updates.name.trim()) throw new Error(getMessage('required', 'Tên'));
      this.name = updates.name.trim();
    }
    if (updates.email !== undefined) {
      if (!validateEmail(updates.email)) throw new Error(getMessage('invalidEmail'));
      this.email = updates.email.toLowerCase();
    }
    if (updates.address !== undefined) {
      if (!updates.address.trim()) throw new Error(getMessage('invalidAddress'));
      this.address = updates.address.trim();
    }
  }

  // Responsibility: Record order reference
  addOrder(orderId: string): void {
    if (!this.orderIds.includes(orderId)) this.orderIds.push(orderId);
  }

  // Responsibility: Get order history (read-only)
  getOrderHistory(): string[] {
    return [...this.orderIds];
  }

  // Invariant: Phone/email unique (enforced by Repository on save)
  // Invariant: Name non-empty, email valid format
}