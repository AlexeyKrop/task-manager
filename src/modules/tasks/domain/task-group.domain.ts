import {BadRequestException, ForbiddenException} from "@nestjs/common";
import {TaskAuthor} from "./task-author.vo";

export class TaskGroup {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly position: number,
        public readonly ownerId: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public readonly owner?: TaskAuthor,
    ) { }

    canBeEditedBy(userId: string): boolean {
        return this.ownerId === userId;
    }

    ensureCanBeEditedBy(userId: string): void {
        if (!this.canBeEditedBy(userId)) {
            throw new ForbiddenException('Only group owner can edit this group');
        }
    }

    canBeDeleted(taskCount: number, force: boolean): boolean {
        return taskCount === 0 || force;
    }

    ensureCanBeDeleted(taskCount: number, force: boolean): void {
        if (!this.canBeDeleted(taskCount, force)) {
            throw new BadRequestException(
                `Cannot delete group "${this.name}" with ${taskCount} task(s). Use force=true to delete all tasks.`
            );
        }
    }

}