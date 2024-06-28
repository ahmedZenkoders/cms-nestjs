/* eslint-disable prettier/prettier */
import { Message } from 'src/messages/entities/message';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'chats' })
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Message, (message) => message.chat_id)
  messages: Message[];
}
