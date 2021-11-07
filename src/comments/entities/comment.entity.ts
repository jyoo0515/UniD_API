import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, BeforeInsert, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Posting } from '../../postings/entities/posting.entity';

@Entity({ name: 'comment' })
export class Comment extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  userId: number;

  @ApiProperty()
  @Column()
  content: string;

  @ApiProperty()
  @Column({ default: 0 })
  likes: number;

  @ApiProperty()
  @Column({ type: 'simple-array', array: true, nullable: true })
  likedUsers: string[];

  @ApiProperty()
  @Column({ default: 0 })
  reports: number;

  @ApiProperty({ type: () => Posting })
  @ManyToOne((type) => Posting, (posting) => posting.comments)
  posting: Posting;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @BeforeInsert()
  initializeArray() {
    this.likedUsers = [];
  }
}
