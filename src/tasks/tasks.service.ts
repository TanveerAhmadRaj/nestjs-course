import {UpdateTaskDto} from './dtos/update-task.dto';
import {Injectable, Search} from '@nestjs/common';
import {TaskStatus} from './types/task.model';
import {CreateTaskDto} from './dtos/create-task.dto';
import {WrongTaskStatusException} from './exceptions/wrong-task-status.exception';
import {FindOptionsWhere, Like, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Task} from './entities/task.entity';
import {CreateTaskLabelDto} from './dtos/create-task-label.dto';
import {TaskLabel} from './entities/task-label.entity';
import {FindTaskParams} from './types/find-task.params';
import {PaginationParams} from 'src/common/pagination.params';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(TaskLabel)
    private readonly labelRepository: Repository<TaskLabel>
  ) {}
  /**
   Explanation
  1: Implemented Pagination on tasks with ORM as well ass with Query.
  2: Actually, It was difficult to implement the partial search using TYPEORM so Went with Raw query
  But also pass the object that we will not be attacked by SQL (INJUNCTION)
  3: Also I'm filtering my tasks on the bases on labels which are in relations with Tasks
  4: Keep in mind that ILIKE and LIKE (ILIKE have an ability to search without case sensitivity so used it)
  5: I also used subQuery for filtering the tasks by labels and not labels themselves.
   */
  public async findAll(
    filters: FindTaskParams,
    pagination: PaginationParams
  ): Promise<[Task[], number]> {
    const query = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.labels', 'labels');
    if (filters.status) {
      query.andWhere('task.status = :status', {status: filters.status});
    }

    if (filters.search?.trim()) {
      query.andWhere(
        '(task.title ILIKE :search OR task.description ILIKE :search)',
        {search: `%${filters.search}%`}
      );
    }
    if (filters.labels?.length) {
      const subQuery = query
        .subQuery()
        .select('labels.taskId')
        .from('task_label', 'label')
        .where('labels.name IN (:...names)', {names: filters.labels})
        .getQuery();
      query.andWhere(`task.id IN ${subQuery}`);
    }
    query.orderBy(`task.${filters.sortBy}`, filters.sortOrder);
    query.skip(pagination.offset).take(pagination.limit);
    return query.getManyAndCount();
    // const where: FindOptionsWhere<Task> = {};
    // if (filters.status) {
    //   where.status = filters.status;
    // }

    // if (filters.search?.trim()) {
    //   where.title = Like(`%${filters.search}%`);
    // }
    // return await this.taskRepository.findAndCount({
    //   where,
    //   relations: ['labels'],
    //   skip: pagination.offset,
    //   take: pagination.limit,
    // });
  }

  public async findOne(id: string): Promise<Task | null> {
    return await this.taskRepository.findOne({
      where: {id},
      relations: ['labels'],
    });
  }

  public async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    if (createTaskDto.labels) {
      createTaskDto.labels = this.getUniqueLabels(createTaskDto.labels);
    }
    return await this.taskRepository.save(createTaskDto);
  }
  public async deleteTask(task: Task): Promise<void> {
    /*
    Two different ways to work along CASCADING on BD level 
    1:  By Passing only id id=f the to the delete method
    2:  By Changing the method to remove from delete (Both will work fine but keep in mind pass only id when working CASCADING in Delete)
    */
    await this.taskRepository.delete(task.id);
    // await this.taskRepository.remove(task); ==> this will also work
    // await this.taskRepository.delete(task); ==> This will only work when we don't have any CASCADING into our Table
  }
  public async updateTask(
    task: Task,
    updateTaskDto: UpdateTaskDto
  ): Promise<Task> {
    if (
      updateTaskDto.status &&
      !this.isValidStatusTransition(task.status, updateTaskDto.status)
    ) {
      throw new WrongTaskStatusException();
    }
    if (updateTaskDto.labels) {
      updateTaskDto.labels = this.getUniqueLabels(updateTaskDto.labels);
    }
    Object.assign(task, updateTaskDto);
    return await this.taskRepository.save(task);
  }

  public async addLabels(
    task: Task,
    labelsDto: CreateTaskLabelDto[]
  ): Promise<Task> {
    /*
      1:  Duplicate DTO's
      2:  Get existing name in labels
      3:  New labels aren't already existing ones
      4:  We save only one ones, only if there are any 
    */
    const existingNames = new Set(task.labels.map((label) => label.name));
    const labels = this.getUniqueLabels(labelsDto)
      .filter((dto) => !existingNames.has(dto.name))
      .map((label) => this.labelRepository.create(label));
    if (labels.length) {
      task.labels = [...task.labels, ...labels];
      return await this.taskRepository.save(task);
    }
    return task;
  }
  public async removeLabels(task: Task, labels: string[]): Promise<Task> {
    /*
    Removing existing labels from labels array
    --> There are two way to do this
    1:  Remove the labels from the task and save task
    2:  Query Builder - SQL(Level) that deletes labels of specific Task
    I'm going with first one because I'll use Query Builder for High level & complex Structures
    */
    task.labels = task.labels.filter((label) => !labels.includes(label.name));
    return await this.taskRepository.save(task);
  }
  private isValidStatusTransition(
    currentStatus: TaskStatus,
    newStatus: TaskStatus
  ): boolean {
    const statusOder = [
      TaskStatus.OPEN,
      TaskStatus.IN_PROGRESS,
      TaskStatus.DONE,
    ];
    return statusOder.indexOf(currentStatus) <= statusOder.indexOf(newStatus);
  }

  private getUniqueLabels(
    labelsDto: CreateTaskLabelDto[]
  ): CreateTaskLabelDto[] {
    const uniqueNames = [...new Set(labelsDto.map((label) => label.name))];
    return uniqueNames.map((name) => ({name}));
  }
}
