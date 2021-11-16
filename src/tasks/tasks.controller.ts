import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GetCurrentUser } from '../auth/get-current-user.decorator';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetCurrentUser() currentUser: User,
  ) {
    return this.tasksService.getTasks(currentUser, filterDto);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string, @GetCurrentUser() currentUser: User) {
    return this.tasksService.getTaskById(currentUser, id);
  }

  // create task POST /tasks
  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetCurrentUser() currentUser: User,
  ) {
    return this.tasksService.createTask(currentUser, createTaskDto);
  }

  @Patch('/:id')
  updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetCurrentUser() currentUser: User,
  ) {
    const { title, description } = updateTaskDto;
    return this.tasksService.updateTask(currentUser, id, title, description);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetCurrentUser() currentUser: User,
  ) {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTaskStatus(currentUser, id, status);
  }

  // delete task DELETE /tasks/:id
  @Delete('/:id')
  deleteTask(@Param('id') id: string, @GetCurrentUser() currentUser: User) {
    return this.tasksService.deleteTask(currentUser, id);
  }
}
