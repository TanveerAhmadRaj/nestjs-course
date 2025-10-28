import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import {Task} from './task.entity';

@Entity()
@Unique(['name', 'taskId'])
export class TaskLabel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  name: string;

  @Column()
  @Index()
  taskId: string;

  @ManyToOne(() => Task, (task) => task.labels, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({name: 'taskId'})
  task: Task;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
