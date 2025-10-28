import {TypeOrmModuleAsyncOptions} from '@nestjs/typeorm';
import {AppConfig} from './app.config';
import {AuthConfig} from './auth.config';

export interface ConfigType {
  app: AppConfig;
  database: TypeOrmModuleAsyncOptions;
  auth: AuthConfig;
}
