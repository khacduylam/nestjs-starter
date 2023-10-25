import { DBTable } from 'src/common/constants/db.constant';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { Todo } from './todo.entity';

@Entity({ name: DBTable.TodoItem })
export class TodoItem extends BaseEntity {
  constructor(partial: Partial<TodoItem>) {
    super();
    Object.assign(this, partial);
  }

  @Column()
  content: string;

  @Column()
  userID: number;

  @Column()
  todoID: number;

  @ManyToOne(() => Todo, (todo) => todo.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'todoID' })
  todo: Todo;
}
