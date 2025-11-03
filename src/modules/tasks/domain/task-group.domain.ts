import {ForbiddenException} from "@nestjs/common";
import {TaskAuthor} from "./task-author.vo";

export class TaskGroup {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly position: number,
        public readonly userId: string,
        public readonly owner: TaskAuthor,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) { }

    canBeEditedBy(userId: string): boolean {
        return this.userId === userId;
    }
    ensureCanBeEditedBy(userId: string): void {
        if (!this.canBeEditedBy(userId)) {
          throw new ForbiddenException('Only group owner can edit this group');
        }
      }
}