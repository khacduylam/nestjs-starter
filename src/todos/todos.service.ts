import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { Todo } from './entities/todo.entity';
import { TodoItem } from './entities/todo-item.entity';
import { CreateTodoItemDto } from './dto/req/create-todo.dto';
import { FindTodoDto, FindTodoItemDto } from './dto/req/find-todo.dto';
import { UpdateTodoItemDto } from './dto/req/update-todo.dto';

@Injectable()
export class TodosService extends BaseService<Todo> {
  constructor(
    @InjectRepository(Todo)
    private readonly todosRepository: Repository<Todo>,
    @InjectRepository(TodoItem)
    private readonly todoItemsRepository: Repository<TodoItem>,
  ) {
    super(todosRepository);
  }

  async addItem(addDto: CreateTodoItemDto) {
    const query: FindTodoDto = {
      id: addDto.todoID,
      userID: addDto.userID,
    };

    const todo = await this.findExistedOne(query);
    const todoItem = this.todoItemsRepository.create({ ...addDto });
    await this.todoItemsRepository.save(todoItem);
    todo.items.push(todoItem);

    return todo;
  }

  async removeItem(queryDto: FindTodoItemDto) {
    const query: FindTodoItemDto = {
      id: queryDto.id,
      todoID: queryDto.todoID,
      userID: queryDto.userID,
    };

    const todoItem = await this.todoItemsRepository.findOneBy(query);
    if (todoItem) {
      await this.todoItemsRepository.delete(todoItem.id);
    }

    const todo = await this.findOne(queryDto.todoID);

    return todo;
  }

  async updateItem(queryDto: FindTodoItemDto, updateDto: UpdateTodoItemDto) {
    const query: FindTodoItemDto = {
      id: queryDto.id,
      todoID: queryDto.todoID,
      userID: queryDto.userID,
    };

    const todoItem = await this.todoItemsRepository.findOneBy(query);
    if (todoItem) {
      Object.assign(todoItem, updateDto);
      await this.todoItemsRepository.save(todoItem);
    }

    const todo = await this.findOne(queryDto.todoID);

    return todo;
  }
}
