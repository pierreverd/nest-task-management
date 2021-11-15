import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [TasksModule, AuthModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
