export class RefreshToken {
  constructor(
    public readonly id: string,
    public readonly token: string,
    public readonly userId: string,
    public readonly expiresAt: Date,
    public readonly createdAt: Date,
  ) {}

  isExpired(): boolean {
    return this.expiresAt < new Date();
  }

  toJSON() {
    return {
      id: this.id,
      token: this.token,
      userId: this.userId,
      expiresAt: this.expiresAt,
      createdAt: this.createdAt,
    };
  }
}
