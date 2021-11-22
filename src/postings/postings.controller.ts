import { Body, Controller, Delete, Get, Param, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CommentsService } from 'src/comments/comments.service';
import { CreateCommentDto } from 'src/comments/dto/create-comment.dto';
import { CreatePostingDto } from './dto/create-posting.dto';
import { ReturnPostingDto } from './dto/return-posting.dto';
import { UpdatePostingDto } from './dto/update-posting.dto';
import { PostingsService } from './postings.service';

@ApiTags('postings')
@Controller('postings')
export class PostingsController {
  constructor(private postingsService: PostingsService, private commentsService: CommentsService) {}

  @Get()
  @ApiOkResponse({ type: ReturnPostingDto, isArray: true })
  async getAllPostings(): Promise<ReturnPostingDto[]> {
    const postings = await this.postingsService.getAll();
    return plainToClass(ReturnPostingDto, postings);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      dest: './uploads',
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ type: ReturnPostingDto })
  async createPosting(@Req() req, @UploadedFile() file: Express.Multer.File, @Body() body: CreatePostingDto): Promise<ReturnPostingDto> {
    let path: string = null;
    if (!file === undefined) path = file.path;
    const posting = await this.postingsService.createPosting(body.text, body.category, path, req.user.id);
    return plainToClass(ReturnPostingDto, posting);
  }

  @Get('/category/:category')
  @ApiOkResponse({ type: ReturnPostingDto, isArray: true })
  async getPostingsCategory(@Param('category') category: string): Promise<ReturnPostingDto[]> {
    const postings = await this.postingsService.getAllByCategory(category);
    return plainToClass(ReturnPostingDto, postings);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  @ApiOkResponse({ type: ReturnPostingDto, isArray: true })
  async getPostingsByUser(@Req() req): Promise<ReturnPostingDto[]> {
    const postings = await this.postingsService.getAllByUser(req.user.id);
    return plainToClass(ReturnPostingDto, postings);
  }

  @Get('/:id')
  @ApiOkResponse({ type: ReturnPostingDto })
  async getPosting(@Param('id') id: number): Promise<ReturnPostingDto> {
    const posting = await this.postingsService.getOneById(id);
    return plainToClass(ReturnPostingDto, posting);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  @ApiOkResponse({ type: ReturnPostingDto })
  async editPosting(@Param('id') id: number, @Body() body: UpdatePostingDto): Promise<ReturnPostingDto> {
    const posting = await this.postingsService.updatePosting(id, body);
    return plainToClass(ReturnPostingDto, posting);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  @ApiOkResponse({ type: ReturnPostingDto })
  async deletePosting(@Param('id') id: number): Promise<ReturnPostingDto> {
    const posting = await this.postingsService.deletePosting(id);
    return plainToClass(ReturnPostingDto, posting);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:id/comments')
  @ApiOkResponse({ type: ReturnPostingDto })
  async createComment(@Param('id') postId: number, @Req() req, @Body() body: CreateCommentDto): Promise<ReturnPostingDto> {
    const posting = await this.postingsService.getOneById(postId);
    const comment = await this.commentsService.createComment(req.user.id, body, posting);
    return this.getPosting(posting.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/comments/:commentId')
  @ApiOkResponse({ type: ReturnPostingDto })
  async deleteComment(@Param('id') postId: number, @Param('commentId') commentId: number): Promise<ReturnPostingDto> {
    const posting = await this.getPosting(postId);
    const comment = await this.commentsService.deleteComment(commentId);
    return this.getPosting(posting.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id/comments/:commentId/like')
  @ApiOkResponse({ type: ReturnPostingDto })
  async likeComment(@Param('id') postId: number, @Param('commentId') commentId: number, @Req() req): Promise<ReturnPostingDto> {
    const posting = await this.getPosting(postId);
    const comment = await this.commentsService.likeComment(commentId, req.user.email);
    return this.getPosting(posting.id);
  }
}
