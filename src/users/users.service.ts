import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>, private authService: AuthService) {}

  // getAll(): Promise<User[]> {
  //   return this.usersRepository.find();
  //   // SELECT * from user
  // }

  async getOneById(id: number): Promise<User> {
    try {
      const user = await this.usersRepository.findOneOrFail({ id });
      return user;
    } catch (err) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  async getOneByEmail(email: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOneOrFail({ email });
      return user;
    } catch (err) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  async checkIfUnique(email: string): Promise<boolean> {
    try {
      await this.usersRepository.findOneOrFail({ email });
      return false;
    } catch (err) {
      return true;
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const unique = await this.checkIfUnique(createUserDto.email);
    if (!unique) {
      throw new HttpException('Email already in use', HttpStatus.CONFLICT);
    } else {
      const newUser = this.usersRepository.create(createUserDto);
      return await this.usersRepository.save(newUser);
    }
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<any> {
    const user = await this.getOneById(id);

    // If email is changed, check if email is unique
    if (!updateUserDto.email === undefined) {
      const unique = await this.checkIfUnique(updateUserDto.email);
      if (!unique) {
        throw new HttpException('Email already in use', HttpStatus.CONFLICT);
      }
    }
    return await this.usersRepository.save(Object.assign(user, updateUserDto));
  }

  async deleteUser(id: number): Promise<User> {
    const user = await this.getOneById(id);
    return await this.usersRepository.remove(user);
  }

  async login(loginUserDto: LoginUserDto): Promise<string> {
    const user = await this.getOneByEmail(loginUserDto.email);
    const valid = await this.authService.comparePassword(loginUserDto.password, user.password);
    if (valid) {
      const tokenUser = await this.getOneByEmail(user.email);
      return this.authService.generateJwt(tokenUser);
    } else {
      throw new HttpException('Incorrect password', HttpStatus.UNAUTHORIZED);
    }
  }

  async addPoints(userId: number, points: number): Promise<User> {
    const user = await this.getOneById(userId);
    user.points += points;
    return this.usersRepository.save(user);
  }
}
