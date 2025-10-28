import {UserService} from '../user.service';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Post,
  Request,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import {CreateUserDto} from '../create-user.dto';
import {AuthService} from './auth.service';
import {User} from '../user.entity';
import {LoginDto} from '../login.dto';
import {LoginResponse} from '../login.response';
import {AuthRequest} from './auth.request';
import {Public} from '../decorators/public.decorator';
import {AdminResponse} from '../roles/admin.response';
import {Roles} from '../decorators/roles.decorator';
import {Role} from '../roles/role.enum';
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({strategy: 'excludeAll'})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}
  @Post('register')
  @Public()
  public async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.authService.register(createUserDto);
  }
  @Post('login')
  @Public()
  public async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    const accessToken = await this.authService.login(
      loginDto.email,
      loginDto.password
    );
    return new LoginResponse({accessToken});
  }

  @Get('/profile')
  public async profile(@Request() request: AuthRequest): Promise<User> {
    const user = await this.userService.findOne(request.user.sub);
    if (user) {
      return user;
    }
    throw new NotFoundException();
  }
  @Get('admin')
  @Roles(Role.ADMIN)
  public adminOly(): AdminResponse {
    return new AdminResponse({message: 'This is for admins only'});
  }
}
