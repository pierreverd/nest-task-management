import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TaskStatus, User } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { TasksService } from './tasks.service';

const mockPrismaService = () => ({
  task: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
  },
});

const mockCurrentuser: User = {
  username: 'test',
  id: '1',
  password: 'test',
  deletedAt: null,
  updatedAt: null,
  createdAt: null,
};

describe('Task Service', () => {
  let tasksService: TasksService;
  let prismaService;

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

  describe('getTasks() ', () => {
    it('call prisma service and return the result', async () => {
      expect(prismaService.task.findMany).not.toBeCalled();

      const expectedResult = [
        {
          id: '1',
          title: 'task 1',
          description: 'task 1 description',
          completed: false,
        },
        {
          id: '2',
          title: 'task 2',
          description: 'task 2 description',
          completed: false,
        },
      ];

      prismaService.task.findMany.mockResolvedValue(expectedResult);

      // call tasksService.getTasks(), which calls prismaService.task.findMany()
      const actualResult = await tasksService.getTasks(mockCurrentuser, {
        status: null,
        search: null,
      });

      // prismaService.task.findMany() should be called called
      expect(prismaService.task.findMany).toBeCalled();

      // expect prismaService.task.findMany() to be called with the correct parameters
      expect(prismaService.task.findMany).toBeCalledWith({
        where: { userId: '1' },
      });

      // expect prismaService.task.findMany() to return an array of tasks
      expect(actualResult).toEqual(expectedResult);
    });
  });

  describe('getTaskById()', () => {
    it('call prisma service and throw error', async () => {
      try {
        await tasksService.getTaskById(mockCurrentuser, '1');
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe('Task with id 1 not found');
      }

      expect(prismaService.task.findFirst).toBeCalledWith({
        where: { id: '1', userId: mockCurrentuser.id },
      });
    });

    it('call prisma service and throw error, best way', async () => {
      expect(tasksService.getTaskById(mockCurrentuser, '1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('call prisma service and return result', async () => {
      const expectedResult = {
        id: '1',
        title: 'task 1',
        description: 'task 1 description',
        status: TaskStatus.OPEN,
      };

      prismaService.task.findFirst.mockResolvedValue(expectedResult);

      const actualResult = await tasksService.getTaskById(mockCurrentuser, '1');

      expect(prismaService.task.findFirst).toBeCalledWith({
        where: { id: '1', userId: mockCurrentuser.id },
      });

      expect(actualResult).toEqual(expectedResult);
    });
  });
});
