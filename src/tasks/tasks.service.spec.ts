import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { TasksService } from './tasks.service';

const mockPrismaService = () => ({
  task: {
    getTasks: jest.fn(),
  },
});

describe('Task Service', () => {
  let tasksService: TasksService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    // initialize a NestJS module with the TasksService
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: PrismaService, useFactory: mockPrismaService },
      ],
    }).compile();

    tasksService = module.get(TasksService);
    prismaService = module.get(PrismaService);
  });

  it('should be true', () => {
    expect(true).toBe(true);
  });

  /*describe('getTasks() ', () => {
    it('call prisma service and return the result', () => {
      tasksService.getTasks();
    });
  });*/
});
