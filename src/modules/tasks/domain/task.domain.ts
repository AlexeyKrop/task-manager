import {TaskComment} from "./task-comment.vo";
import {TaskAuthor} from "./task-author.vo";
import {TaskAttachment} from "./task-attachment.vo";
import {TaskGroup} from "./task-group.domain";

export class Task {
    constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly description: string,
        public readonly isCompleted: boolean,
        public readonly completedAt: Date | null,
        public readonly priority: string,
        public readonly position: number,
        public readonly tags: string[],
        public readonly parentId: string | null,
        public readonly ownerId: string,
        public readonly groupId: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public readonly owner: TaskAuthor,
        public readonly group: TaskGroup,
        public readonly children: Task[],
        public readonly attachments: TaskAttachment[],
        public readonly comments: TaskComment[],
    ) { }

    canBeCompleted(): boolean {
        return !this.children.some(child => !child.isCompleted);
    }

    canBeEdited(): boolean {
        return !this.isCompleted;
    }

    wouldCreateCycle(potentialParentId: string): boolean {
        return this.isAncestorOf(potentialParentId);
    }

    private isAncestorOf(taskId: string): boolean {
        return this.children.some(child =>
            child.id === taskId || child.isAncestorOf(taskId)
        );
    }
    getDepth(): number {
        if (!this.parentId) return 0;
        const maxChildDepth = this.children.length > 0
            ? Math.max(...this.children.map(c => c.getDepth()))
            : 0;
        return 1 + maxChildDepth;
    }

    canHaveParent(parentDepth: number): boolean {
        const maxDepth = 3;
        return (parentDepth + 1) <= maxDepth;
    }
}

