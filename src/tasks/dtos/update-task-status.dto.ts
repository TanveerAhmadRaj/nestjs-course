import {IsEnum, IsNotEmpty} from 'class-validator';
import {TaskStatus} from '../types/task.model';

export class UpdateTaskStatusDto {
  @IsNotEmpty()
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
