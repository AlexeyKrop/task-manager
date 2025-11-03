import {Module} from '@nestjs/common';
import {PrismaModule} from '../../common/prisma/prisma.module';
import {TaskGroupsController} from './task-groups.controller';
import {TaskGroupsService} from './task-groups.service';
import {TaskGroupsRepository} from './repositories';

@Module({
    imports: [PrismaModule],
    controllers: [
        TaskGroupsController,
    ],
    providers: [
        TaskGroupsService,

        TaskGroupsRepository,
    ],
    exports: [
        TaskGroupsService,
        TaskGroupsRepository,
    ],
})
export class TasksModule { }