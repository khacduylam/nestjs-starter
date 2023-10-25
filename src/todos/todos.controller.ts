import { Controller, Body, HttpStatus, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TodoDto } from './dto/res/todo.dto';
import { CreateTodoDto, CreateTodoItemDto } from './dto/req/create-todo.dto';
import { CrudApi } from 'src/common/decorators/controller.decorator';
import { CurrentUser } from 'src/common/decorators/auth.decorator';
import { AuthUser } from 'src/common/interfaces';
import {
  createPaginationResponseDto,
  createResponseDto,
} from 'src/common/utils/response.util';
import {
  FindTodoDto,
  FindTodoItemDto,
  FindTodosDto,
} from './dto/req/find-todo.dto';
import { UpdateTodoDto, UpdateTodoItemDto } from './dto/req/update-todo.dto';
import { TodosService } from './todos.service';

@ApiTags('todos')
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @CrudApi({
    swagger: {
      summary: 'Create a todo list',
      httpCode: HttpStatus.CREATED,
      successResponseOptions: { type: 'created', cls: TodoDto },
    },
    nest: { method: 'Post', path: '/' },
  })
  async create(
    @CurrentUser() currentUser: AuthUser,
    @Body() createDto: CreateTodoDto,
  ) {
    createDto.userID = currentUser.id;
    const todo = await this.todosService.create(createDto);

    return createResponseDto(TodoDto, todo);
  }

  @CrudApi({
    swagger: {
      summary: 'Get todo list by id',
      httpCode: HttpStatus.OK,
      successResponseOptions: { type: 'ok', cls: TodoDto },
    },
    nest: { method: 'Get', path: '/:id' },
  })
  async findOneByID(
    @CurrentUser() currentUser: AuthUser,
    @Param('id') id: number,
  ) {
    const queryDto: FindTodoDto = {
      id,
      userID: currentUser.id,
    };
    const todo = await this.todosService.findExistedOne(queryDto);

    return createResponseDto(TodoDto, todo);
  }

  @CrudApi({
    swagger: {
      summary: 'Find and paginate todo lists',
      httpCode: HttpStatus.OK,
      successResponseOptions: { type: 'pagination', cls: TodoDto },
    },
    nest: { method: 'Get', path: '/' },
  })
  async findAndPaginate(
    @CurrentUser() currentUser: AuthUser,
    @Query() queryDto: FindTodosDto,
  ) {
    queryDto.userID = currentUser.id;
    const paginateResult = await this.todosService.findAndPaginate(queryDto, [
      { field: 'items', alias: 'item' },
    ]);

    return createPaginationResponseDto(TodoDto, paginateResult);
  }

  @CrudApi({
    swagger: {
      summary: 'Udate todo list',
      httpCode: HttpStatus.OK,
      successResponseOptions: { type: 'ok', cls: TodoDto },
    },
    nest: { method: 'Put', path: '/:id' },
  })
  async update(
    @CurrentUser() currentUser: AuthUser,
    @Param('id') id: number,
    @Body() updateDto: UpdateTodoDto,
  ) {
    const queryDto: FindTodoDto = {
      id,
      userID: currentUser.id,
    };
    const todo = await this.todosService.findOneAndUpdate(queryDto, updateDto);

    return createResponseDto(TodoDto, todo);
  }

  @CrudApi({
    swagger: {
      summary: 'Delete todo list',
      httpCode: HttpStatus.OK,
      successResponseOptions: { type: 'ok', cls: Number },
    },
    nest: { method: 'Delete', path: '/:id' },
  })
  async delete(@CurrentUser() currentUser: AuthUser, @Param('id') id: number) {
    const queryDto: FindTodoDto = {
      id,
      userID: currentUser.id,
    };
    const todo = await this.todosService.findOneAndDelete(queryDto, true);

    return createResponseDto(TodoDto, todo);
  }

  @CrudApi({
    swagger: {
      summary: 'Add a todo item',
      httpCode: HttpStatus.OK,
      successResponseOptions: { type: 'ok', cls: TodoDto },
    },
    nest: { method: 'Post', path: '/:id' },
  })
  async addItem(
    @CurrentUser() currentUser: AuthUser,
    @Param('id') todoID: number,
    @Body() addDto: CreateTodoItemDto,
  ) {
    addDto.userID = currentUser.id;
    addDto.todoID = todoID;
    const todo = await this.todosService.addItem(addDto);

    return createResponseDto(TodoDto, todo);
  }

  @CrudApi({
    swagger: {
      summary: 'Update a todo item',
      httpCode: HttpStatus.OK,
      successResponseOptions: { type: 'ok', cls: TodoDto },
    },
    nest: { method: 'Put', path: '/:todoID/:itemID' },
  })
  async updateItem(
    @CurrentUser() currentUser: AuthUser,
    @Param('todoID') todoID: number,
    @Param('itemID') itemID: number,
    @Body() updateDto: UpdateTodoItemDto,
  ) {
    const queryDto: FindTodoItemDto = {
      id: itemID,
      todoID,
      userID: currentUser.id,
    };
    const todo = await this.todosService.updateItem(queryDto, updateDto);

    return createResponseDto(TodoDto, todo);
  }

  @CrudApi({
    swagger: {
      summary: 'Remove a todo item',
      httpCode: HttpStatus.OK,
      successResponseOptions: { type: 'ok', cls: TodoDto },
    },
    nest: { method: 'Delete', path: '/:todoID/:itemID' },
  })
  async removeItem(
    @CurrentUser() currentUser: AuthUser,
    @Param('todoID') todoID: number,
    @Param('itemID') itemID: number,
  ) {
    const queryDto: FindTodoItemDto = {
      id: itemID,
      todoID,
      userID: currentUser.id,
    };
    const todo = await this.todosService.removeItem(queryDto);

    return createResponseDto(TodoDto, todo);
  }
}
