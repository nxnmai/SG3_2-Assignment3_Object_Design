// StaffMember — domain class (ported/refined from Assignment 2 design)
// TODO: attributes, methods, invariants — document any change vs A2 here.

export enum StaffRole {
    BRANCH_STAFF = "BRANCH_STAFF",
    DRIVER = "DRIVER",
    OPERATIONS_MANAGER = "OPERATIONS_MANAGER",
    ADMIN = "ADMIN"
}

export interface Credentials {
    username: string;
    password: string;
}

export abstract class StaffMember {
    public readonly id: string;
    public branchId: string;
    public name: string;
    public phone: string;
    public email: string;
    public role: StaffRole;
    protected credentials: Credentials;

    constructor(
        id: string,
        branchId: string,
        name: string,
        phone: string,
        email: string,
        role: StaffRole,
        credentials: Credentials
    ) {
        this.validateId(id);
        this.validateBranchId(branchId);
        this.validateName(name);
        this.validatePhone(phone);
        this.validateEmail(email);

        this.id = id;
        this.branchId = branchId;
        this.name = name.trim();
        this.phone = phone;
        this.email = email.trim().toLowerCase();
        this.role = role;
        this.credentials = credentials;
    }

    public authenticate(credentials: Credentials): boolean {
        return (
            credentials.username === this.credentials.username &&
            credentials.password === this.credentials.password
        );
    }

    public updateProfile(
        updates: Partial<{
            name: string;
            phone: string;
            email: string;
        }>
    ): void {
        if (updates.name !== undefined) {
            this.validateName(updates.name);
            this.name = updates.name.trim();
        }

        if (updates.phone !== undefined) {
            this.validatePhone(updates.phone);
            this.phone = updates.phone;
        }

        if (updates.email !== undefined) {
            this.validateEmail(updates.email);
            this.email = updates.email.trim().toLowerCase();
        }
    }

    public hasRole(role: StaffRole): boolean {
        return this.role === role;
    }

    // Validation
    private validateId(id: string): void {
        if (!/^STF-[A-Z0-9-]+$/.test(id)) {
            throw new Error(
                "Staff ID must follow the format 'STF-XXXXXX'."
            );
        }
    }

    private validateBranchId(branchId: string): void {
        if (!branchId.trim()) {
            throw new Error("Branch ID cannot be empty.");
        }
    }

    private validateName(name: string): void {
        if (!name.trim()) {
            throw new Error("Staff member name cannot be empty.");
        }
    }

    private validatePhone(phone: string): void {
        if (!/^[0-9]{10}$/.test(phone)) {
            throw new Error(
                "Phone number must contain exactly 10 digits."
            );
        }
    }

    private validateEmail(email: string): void {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            throw new Error("Invalid email address.");
        }
    }
}