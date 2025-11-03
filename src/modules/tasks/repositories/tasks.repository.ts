import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../common";
import { Task, TaskAuthor, TaskGroup } from "../domain";
import { TaskMapper } from "../mappers";

@Injectable()
export class TasksRepository {

}