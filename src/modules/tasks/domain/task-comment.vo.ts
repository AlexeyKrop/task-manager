import { TaskAuthor } from "./task-author.vo";

export class TaskComment {
    constructor(
        public readonly id: string,
        public readonly content: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public readonly author: TaskAuthor
    ) { }
}

