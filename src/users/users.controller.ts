import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Request, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { Response } from 'express';
import { SETTINGS } from 'src/app.utils';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ReturnUserDto } from './dto/return-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService, private configService: ConfigService) {}

  // @ApiOkResponse({
  //   type: ReturnUserDto,
  //   isArray: true,
  //   description: 'list of all users',
  // })
  // @Get()
  // async getUsers(): Promise<ReturnUserDto[]> {
  //   const usersList = await this.usersService.getAll();
  //   return plainToClass(ReturnUserDto, usersList);
  // }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: ReturnUserDto })
  @Get('/me')
  async me(@Request() req): Promise<ReturnUserDto> {
    const user = await this.usersService.getOneByEmail(req.user.email);
    return plainToClass(ReturnUserDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse()
  @Get('/logout')
  logout(@Res() res: Response): void {
    res.clearCookie('access_token').json({ message: 'Successfully logged out' });
  }

  @ApiCreatedResponse({ type: ReturnUserDto })
  @Post('/signup')
  async createUser(@Body(SETTINGS.VALIDATION_PIPE) body: CreateUserDto): Promise<ReturnUserDto> {
    const user = await this.usersService.createUser(body);
    return plainToClass(ReturnUserDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: ReturnUserDto })
  @Put('/:id')
  async updateUser(@Param('id') id: number, @Body(SETTINGS.VALIDATION_PIPE) body: UpdateUserDto): Promise<ReturnUserDto> {
    const user = await this.usersService.updateUser(id, body);
    return plainToClass(ReturnUserDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: ReturnUserDto })
  @Delete('/:id')
  async deleteUser(@Param('id') id: number): Promise<ReturnUserDto> {
    const user = await this.usersService.deleteUser(id);
    return plainToClass(ReturnUserDto, user);
  }

  @ApiOkResponse()
  @Post('/login')
  @HttpCode(200)
  async login(@Body() loginUserDto: LoginUserDto, @Res({ passthrough: true }) res: Response): Promise<void> {
    const jwt = await this.usersService.login(loginUserDto);
    res.cookie('access_token', jwt, {
      expires: new Date(new Date().getTime() + 6 * 60 * 60000), // 6 hours
      sameSite: 'strict',
      domain: 'localhost',
      httpOnly: true,
    });
  }
}
