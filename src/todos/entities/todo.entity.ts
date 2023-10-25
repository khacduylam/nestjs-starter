import { Column, Entity, OneToMany } from 'typeorm';
import { TodoItem } from './todo-item.entity';
import { DBTable } from 'src/common/constants/db.constant';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity({ name: DBTable.Todo })
export class Todo extends BaseEntity {
  constructor(partial: Partial<Todo>) {
    super();
    Object.assign(this, partial);
  }

  @Column()
  userID: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true, default: 0 })
  totalItems: number;

  @OneToMany(() => TodoItem, (todoItem) => todoItem.todo, {
    eager: true,
  })
  items: TodoItem[];
}
