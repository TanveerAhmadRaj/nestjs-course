import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {TasksService} from './tasks.service';
import {CreateTaskDto} from './dtos/create-task.dto';
import {FindOneParams} from './types/find-one.params';
// import {UpdateTaskStatusDto} from './update-task-status.dto';
import {UpdateTaskDto} from './dtos/update-task.dto';
import {Task} from './entities/task.entity';
import {WrongTaskStatusException} from './exceptions/wrong-task-status.exception';
import {CreateTaskLabelDto} from './dtos/create-task-label.dto';
import {FindTaskParams} from './types/find-task.params';
import {PaginationParams} from 'src/common/pagination.params';
import {PaginationResponse} from 'src/common/pagination.response';
import {CurrentUserId} from 'src/users/decorators/current-user-id.decorator';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  public async findAll(
    @Query() filters: FindTaskParams,
    @Query() pagination: PaginationParams
  ): Promise<PaginationResponse<Task>> {
    const [items, total] = await this.tasksService.findAll(filters, pagination);
    return {
      data: items,
      meta: {
        total: total,
        ...pagination,
        // offset: pagination.offset,
        // limit: pagination.limit,
      },
    };
  }

  @Get('/:id')
  public async findOne(@Param() params: FindOneParams): Promise<Task> {
    return this.findOneOrFail(params.id);
  }

  @Post()
  public async create(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUserId() userId: string
  ): Promise<Task> {
    return await this.tasksService.createTask({...createTaskDto, userId});
  }
  @Patch('/:id')
  public async UpdateTask(
    @Param() params: FindOneParams,
    @Body() updateTaskDto: UpdateTaskDto
  ): Promise<Task> {
    const task = await this.findOneOrFail(params.id);
    try {
      return await this.tasksService.updateTask(task, updateTaskDto);
    } catch (error) {
      if (error instanceof WrongTaskStatusException)
        throw new BadRequestException([error.message]);
    }
    return await this.tasksService.updateTask(task, updateTaskDto);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteTask(@Param() params: FindOneParams): Promise<void> {
    const task = await this.findOneOrFail(params.id);
    await this.tasksService.deleteTask(task);
  }
  private async findOneOrFail(id: string): Promise<Task> {
    const task = await this.tasksService.findOne(id);

    if (!task) {
      throw new NotFoundException();
    }
    return task;
  }

  @Post(':id/labels')
  public async addLabels(
    @Param() params: FindOneParams,
    @Body() labels: CreateTaskLabelDto[]
  ): Promise<Task> {
    const task = await this.findOneOrFail(params.id);
    return await this.tasksService.addLabels(task, labels);
  }
  @Delete(':id/labels')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async removeLabels(
    @Param() params: FindOneParams,
    @Body() labelNames: string[]
  ): Promise<void> {
    const task = await this.findOneOrFail(params.id);
    await this.tasksService.removeLabels(task, labelNames);
  }
}
