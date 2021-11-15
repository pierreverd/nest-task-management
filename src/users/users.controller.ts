import { Delete, Get, Controller, Param, Post } from '@nestjs/common';

@Controller('users')
export class UsersController {
  // get users
  @Get('/:id')
  getUser(@Param('id') id: string) {
    return {
      id,
      name: 'John Doe',
      email: '',
    };
  }

  // create user
  @Post()
  createUser() {
    return {
      id: '',
      name: 'John Doe',
      email: '',
    };
  }

  // delete user
  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return {
      id,
      name: 'John Doe',
      email: '',
    };
  }
}
