import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, User } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  // private tasks: Task[] = [];

  getTasks(currentUser: User, filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;

    let where: any = { userId: currentUser.id };
    //let tasks = this.getAllTasks();
    if (status) {
      // tasks = tasks.filter((t) => t.status === status);
      where = { ...where, status };
    }

    if (search) {
      /*tasks = tasks.filter(
        (t) => t.title.includes(search) || t.description.includes(search),
      );*/
      where = {
        ...where,
        OR: [
          {
            title: { contains: search, mode: 'insensitive' },
          },
          {
            description: { contains: search, mode: 'insensitive' },
          },
        ],
      };
    }
    return this.prisma.task.findMany({ where });
  }

  /**
   * Check if the task exist for the current user and return it
   */
  async getTaskById(currentUser: User, id: string): Promise<Task> {
    //const task = this.tasks.find((task) => task.id === id);
    const task = await this.prisma.task.findFirst({
      where: { id, userId: currentUser.id },
    });
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return task;
  }

  createTask(currentUser: User, createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    /*const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };*/
    //this.tasks.push(task);

    return this.prisma.task.create({
      data: { title, description, userId: currentUser.id },
      /*include: {
        user: true,
      },*/
    });
  }

  async deleteTask(currentUser: User, id: string): Promise<Task> {
    //this.tasks = this.tasks.filter((task) => task.id !== id);

    await this.getTaskById(currentUser, id);

    return this.prisma.task.delete({
      where: { id },
    });
  }

  async updateTask(
    currentUser: User,
    id: string,
    title: string,
    description: string,
  ): Promise<Task> {
    /*const task = this.getTaskById(id);
    task.title = title;
    task.description = description;
    return task;*/

    await this.getTaskById(currentUser, id);

    await this.prisma.task.update({
      where: { id },
      data: {
        title,
        description,
      },
    });

    /**
     * See:
     * https://www.prisma.io/docs/concepts/components/prisma-client/middleware/soft-delete-middleware#option-2-use-middleware-to-determine-the-behavior-of-readupdate-queries-for-deleted-records
     * Update return { count: n } instead of Task
     */
    return this.getTaskById(currentUser, id);
  }

  async updateTaskStatus(
    currentUser: User,
    id: string,
    status: TaskStatus,
  ): Promise<Task> {
    /* const task = this.getTaskById(id);
    task.status = statut;
    return task;*/

    await this.getTaskById(currentUser, id);

    await this.prisma.task.update({
      where: { id },
      data: { status },
    });

    /**
     * See:
     * https://www.prisma.io/docs/concepts/components/prisma-client/middleware/soft-delete-middleware#option-2-use-middleware-to-determine-the-behavior-of-readupdate-queries-for-deleted-records
     * Update return { count: n } instead of Task
     */
    return this.getTaskById(currentUser, id);
  }
}
