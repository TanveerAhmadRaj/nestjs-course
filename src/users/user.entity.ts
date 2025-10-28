import {Expose} from 'class-transformer';
import {Task} from 'src/tasks/entities/task.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {Role} from './roles/role.enum';

@Entity()
export class User {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Expose()
  @Column({
    type: 'varchar',
    nullable: false,
    length: 30,
  })
  name: string;

  @Expose()
  @Column({
    type: 'varchar',
    nullable: false,
    length: 30,
  })
  email: string;

  @Column()
  password: string;

  @Expose()
  @CreateDateColumn()
  createdAt: Date;

  @Expose()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Task, (task) => task.user)
  @Expose()
  tasks: Task[];

  @Expose()
  @Column('text', {array: true, default: [Role.USER]})
  roles: Role[];
}
