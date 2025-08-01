import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { User } from './entities';
import { CreateUserDto } from './dto';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const { username, password, email } = createUserDto;
    const passwordSalt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, passwordSalt);

    const user: User = {
      userId: uuidv4(),
      username,
      email,
      password: hash,
    };

    this.users.push(user);
    const { password: _, ...result } = user;
    return result;
  }

  async findOne(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }
}
