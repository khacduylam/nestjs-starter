import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/req/create-user.dto';
import { FindUserDto } from './dto/req/find-users.dto';
import { User } from './entities/users.entity';
import { USER_PASSWORD_IS_INCORRECT } from 'src/common/constants/response-code.constant';
import { ChangePasswordDto } from './dto/req/change-password.dto';
import { ConfigService } from '@nestjs/config';
import { UserRole } from './users.enum';
import { HASH_SALT_ROUNDS } from 'src/auth/auth.constant';
import { BaseService } from 'src/common/services/base.service';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {
    super(usersRepository);
  }

  async create(createDto: CreateUserDto) {
    const user = this.usersRepository.create({ ...createDto });
    await this.hashPassword(user);

    await this.usersRepository.save(user);

    return user;
  }

  async findOneAndChangePassword(
    queryDto: FindUserDto,
    updateDto: ChangePasswordDto,
  ) {
    const user = await this.findExistedOne(queryDto);

    const { oldPassword, newPassword } = updateDto;
    const matches = await this.comparePasswords(user, oldPassword);
    if (!matches) {
      throw new BadRequestException(USER_PASSWORD_IS_INCORRECT);
    }

    user.password = newPassword;
    await this.hashPassword(user);

    await this.usersRepository.save(user);

    return user;
  }

  async hashPassword(user: User) {
    const hashedPassword = await hash(user.password, HASH_SALT_ROUNDS);
    user.password = hashedPassword;

    return user;
  }

  async comparePasswords(user: User, plainPassword: string) {
    const matches = await compare(plainPassword, user.password);

    console.log(plainPassword, user.password, matches);

    return matches;
  }

  async initSystemAdmin() {
    const systemEmail = this.configService.get<string>('SYSTEM_EMAIL');
    const systemPassword = this.configService.get<string>('SYSTEM_PASSWORD');

    let admin = await this.usersRepository.findOneBy({
      isDeleted: false,
      role: UserRole.ADMIN,
      email: systemEmail,
    });
    if (admin) {
      return { admin, isNew: false };
    }

    admin = new User({
      role: UserRole.ADMIN,
      email: systemEmail,
      password: systemPassword,
      firstName: 'System',
      lastName: 'Admin',
      emailVerified: true,
    });
    await this.hashPassword(admin);

    await this.usersRepository.save(admin);

    return { admin, isNew: true };
  }
}
