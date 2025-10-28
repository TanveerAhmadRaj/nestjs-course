import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {TasksModule} from './tasks/tasks.module';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {appConfig} from './config/app.config';
import {typeOrmConfig} from './config/database.config';
import {TypeOrmModule} from '@nestjs/typeorm';
import {TypedConfigService} from './config/typed-config.service';
import {Task} from './tasks/entities/task.entity';
import {User} from './users/user.entity';
import {TaskLabel} from './tasks/entities/task-label.entity';
import {authConfig} from './config/auth.config';
import {UsersModule} from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: TypedConfigService) => ({
        ...(await configService.get('database')),
        entities: [Task, User, TaskLabel],
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, typeOrmConfig, authConfig],
    }),
    TasksModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: TypedConfigService,
      useExisting: ConfigService,
    },
  ],
})
export class AppModule {}
