export class UserProfile {
  constructor(
    public readonly firstName: string | null,
    public readonly lastName: string | null,
    public readonly phone: string | null,
    public readonly bio: string | null,
    public readonly avatarUrl: string | null,
  ) {}
}
