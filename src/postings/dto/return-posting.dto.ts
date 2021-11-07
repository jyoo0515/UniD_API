import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Comment } from 'src/comments/entities/comment.entity';

@Exclude()
export class ReturnPostingDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  userId: number;

  @ApiProperty()
  @Expose()
  text: string;

  @ApiProperty()
  @Expose()
  imgPath: string;

  @ApiProperty()
  @Expose()
  category: string;

  @ApiProperty({ type: () => Comment, isArray: true, nullable: true })
  @Expose()
  comments: Comment[];

  @ApiProperty()
  @Expose()
  createdAt: Date;
}
