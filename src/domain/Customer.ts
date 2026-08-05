// Customer — domain class (ported/refined from Assignment 2 design)

export class Customer {
  public readonly id: string;
  public name: string;
  public phone: string;
  public email: string;
  public address: string;
  public readonly createdAt: Date;
  public orderIds: string[];

  constructor(
    id: string,
    name: string,
    phone: string,
    email: string,
    address: string,
    orderIds: string[] = [],
    createdAt: Date = new Date(),
  ) {
    this.validateId(id);
    this.validateName(name);
    this.validatePhone(phone);
    this.validateEmail(email);
    this.validateAddress(address);

    this.id = id;
    this.name = name.trim();
    this.phone = phone.trim();
    this.email = email.trim().toLowerCase();
    this.address = address.trim();
    this.orderIds = [...orderIds];
    this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
  }

  public updateProfile(updates: Partial<{ name: string; phone: string; email: string; address: string }>): void {
    if (updates.name !== undefined) {
      this.validateName(updates.name);
      this.name = updates.name.trim();
    }
    if (updates.phone !== undefined) {
      this.validatePhone(updates.phone);
      this.phone = updates.phone.trim();
    }
    if (updates.email !== undefined) {
      this.validateEmail(updates.email);
      this.email = updates.email.trim().toLowerCase();
    }
    if (updates.address !== undefined) {
      this.validateAddress(updates.address);
      this.address = updates.address.trim();
    }
  }

  public addOrder(orderId: string): void {
    if (!orderId || !orderId.trim()) {
      throw new Error('Order ID cannot be empty.');
    }
    if (!this.orderIds.includes(orderId)) {
      this.orderIds.push(orderId);
    }
  }

  public getOrderHistory(): string[] {
    return [...this.orderIds];
  }

  // Validations
  private validateId(id: string): void {
    if (!id || !id.trim()) {
      throw new Error('Customer ID cannot be empty.');
    }
  }

  private validateName(name: string): void {
    if (!name || !name.trim()) {
      throw new Error('Customer name cannot be empty.');
    }
  }

  private validatePhone(phone: string): void {
    if (!/^[0-9]{10}$/.test(phone ? phone.trim() : '')) {
      throw new Error('Phone number must contain exactly 10 digits.');
    }
  }

  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email ? email.trim() : '')) {
      throw new Error('Invalid email address format.');
    }
  }

  private validateAddress(address: string): void {
    if (!address || !address.trim()) {
      throw new Error('Customer address cannot be empty.');
    }
  }
}
