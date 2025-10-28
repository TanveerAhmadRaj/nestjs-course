import {AuthConfig} from './../config/auth.config';
import {TypedConfigService} from './../config/typed-config.service';
import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from './user.entity';
import {JwtModule} from '@nestjs/jwt';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {PasswordService} from './password.service';
import {UserService} from './user.service';
import {AuthService} from './auth/auth.service';
import {AuthController} from './auth/auth.controller';
import {AuthGuard} from './auth/auth.guard';
import {APP_GUARD} from '@nestjs/core';
import {RolesGuard} from './roles/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: TypedConfigService) => ({
        secret: config.get<AuthConfig>('auth')?.jwt.secret,
        signOptions: {
          expiresIn: '1h',
        },
      }),
    }),
  ],
  providers: [
    PasswordService,
    UserService,
    AuthService,
    AuthGuard,
    RolesGuard,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  controllers: [AuthController],
})
export class UsersModule {}
