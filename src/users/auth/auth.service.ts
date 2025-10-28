import {JwtService} from '@nestjs/jwt';
import {UserService} from '../user.service';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {CreateUserDto} from '../create-user.dto';
import {User} from '../user.entity';
import {PasswordService} from '../password.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly UserService: UserService,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService
  ) {}
  public async register(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.UserService.findOneByEmail(
      createUserDto.email
    );
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    const user = await this.UserService.createUser(createUserDto);
    return user;
  }
  public async login(email: string, password: string): Promise<string> {
    const user = await this.UserService.findOneByEmail(email);
    if (
      !user ||
      !(await this.passwordService.verify(password, user.password))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.generateToken(user);
  }
  private generateToken(user: User): string {
    const payload = {sub: user.id, name: user.name, roles: user.roles};
    return this.jwtService.sign(payload);
  }
}
