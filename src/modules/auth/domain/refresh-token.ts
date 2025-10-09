export class RefreshToken {
  constructor(
    public readonly id: string,
    public readonly token: string,
    public readonly userId: string,
    public readonly expiresAt: Date,
    public readonly createdAt: Date,
    public readonly isRevoked: boolean = false,
  ) {}

  isExpired(): boolean {
    return this.expiresAt < new Date();
  }

  isValid(): boolean {
    return !this.isRevoked && !this.isExpired();
  }

  toJSON() {
    return {
      id: this.id,
      token: this.token,
      userId: this.userId,
      expiresAt: this.expiresAt,
      createdAt: this.createdAt,
      isRevoked: this.isRevoked,
    };
  }
}
