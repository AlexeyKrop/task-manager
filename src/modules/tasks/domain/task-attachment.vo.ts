export class TaskAttachment {
    constructor(
      public readonly id: string,
      public readonly url: string,
      public readonly fileName: string,
      public readonly fileSize?: number,
      public readonly mimeType?: string,
      public readonly createdAt?: Date,
    ) {}
  }