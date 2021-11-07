import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Posting } from 'src/postings/entities/posting.entity';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CommentsService {
  constructor(@InjectRepository(Comment) private commentsRepository: Repository<Comment>, private usersService: UsersService) {}

  async getOneById(id: number): Promise<Comment> {
    try {
      const comment = await this.commentsRepository.findOneOrFail({ id });
      return comment;
    } catch (err) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }
  }

  async createComment(userId: number, createCommentDto: CreateCommentDto, posting: Posting): Promise<Comment> {
    const newComment = await this.commentsRepository.create({ userId, content: createCommentDto.content, posting });
    await this.usersService.addPoints(userId, 2);
    return await this.commentsRepository.save(newComment);
  }

  async deleteComment(id: number): Promise<Comment> {
    const comment = await this.getOneById(id);
    return await this.commentsRepository.remove(comment);
  }

  async likeComment(id: number, userEmail: string): Promise<Comment> {
    const comment = await this.getOneById(id);
    if (comment.likedUsers.includes(userEmail)) {
      throw new HttpException('User already liked this comment', HttpStatus.BAD_REQUEST);
    }

    comment.likes += 1;
    comment.likedUsers.push(userEmail);
    return await this.commentsRepository.save(comment);
  }
}
