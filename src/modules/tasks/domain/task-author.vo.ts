export class TaskAuthor {
    constructor(
      public readonly firstName: string,
      public readonly lastName: string,
      public readonly avatarUrl?: string,
    ) {}

    getFullName(): string {
        return `${this.firstName} ${this.lastName}`.trim();
    }
  }