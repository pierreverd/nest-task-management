import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma.service';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [AuthModule],
  controllers: [TasksController],
  providers: [PrismaService, TasksService],
})
export class TasksModule {}
