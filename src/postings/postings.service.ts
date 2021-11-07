import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { UpdatePostingDto } from './dto/update-posting.dto';
import { Posting } from './entities/posting.entity';
@Injectable()
export class PostingsService {
  constructor(@InjectRepository(Posting) private postingsRepository: Repository<Posting>, private usersService: UsersService) {}

  async getAll(): Promise<Posting[]> {
    return this.postingsRepository.find({ relations: ['comments'] });
  }

  async getAllByCategory(category: string): Promise<Posting[]> {
    return this.postingsRepository.find({ where: { category }, relations: ['comments'] });
  }

  async getAllByUser(userId: number): Promise<Posting[]> {
    return this.postingsRepository.find({ where: { userId }, relations: ['comments'] });
  }

  async getOneById(id: number): Promise<Posting> {
    try {
      const posting = await this.postingsRepository.findOneOrFail({ id }, { relations: ['comments'] });
      return posting;
    } catch (err) {
      throw new HttpException('Posting not found', HttpStatus.NOT_FOUND);
    }
  }

  async createPosting(text: string, category: string, imgPath: string, userId: number): Promise<Posting> {
    const availableCategories = [
      'engineering',
      'natural science',
      'medicine',
      'humanities',
      'economics',
      'art',
      'sports',
      'social science',
      'agriculture',
      'law',
    ];
    if (!availableCategories.includes(category)) {
      throw new HttpException('Invalid category', HttpStatus.BAD_REQUEST);
    }
    const newPosting = this.postingsRepository.create({ text, category, imgPath, userId });
    await this.usersService.addPoints(userId, 1);
    return await this.postingsRepository.save(newPosting);
  }

  async updatePosting(id: number, updatePostingDto: UpdatePostingDto): Promise<any> {
    const posting = this.getOneById(id);
    return await this.postingsRepository.save(Object.assign(posting, updatePostingDto));
  }

  async deletePosting(id: number): Promise<Posting> {
    const posting = await this.getOneById(id);
    return await this.postingsRepository.remove(posting);
  }
}
