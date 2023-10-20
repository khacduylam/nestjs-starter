import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { paginate } from 'nestjs-typeorm-paginate';
import { HASH_SALT_ROUNDS } from 'src/shared/constants/auth.constant';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/req/create-user.dto';
import { FindUserDto, FindUsersDto } from './dto/req/find-users.dto';
import { UpdateUserDto } from './dto/req/update-user.dto';
import { User } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findOneByID(id: number) {
    const user = await this.usersRepository.findOneBy({ id, isDeleted: false });

    return user;
  }

  async findOne(reqDto: FindUserDto) {
    const user = await this.usersRepository.findOneBy({
      ...reqDto,
      isDeleted: false,
    });

    return user;
  }

  async findAndPaginate(reqDto: FindUsersDto, options?: any) {
    const route = options?.route || null;
    const { page, limit, ...query } = reqDto;
    const queryBuilder = this.usersRepository.createQueryBuilder('u');
    queryBuilder.where({ ...query, isDeleted: false });
    queryBuilder.orderBy('u.id', 'DESC');

    const result = await paginate<User>(queryBuilder, { page, limit, route });

    return result;
  }

  async createOne(reqDto: CreateUserDto) {
    const user = new User({ ...reqDto });
    await this.hashPassword(user);

    await this.usersRepository.save(user);

    return user;
  }

  async findOneByIDAndUpdate(id: number, reqDto: UpdateUserDto) {
    const user = await this.usersRepository.findOneBy({ id, isDeleted: false });
    if (!user) {
      return null;
    }

    Object.assign(user, reqDto);
    await this.usersRepository.save(user);

    return user;
  }

  async findOneByIDAndDelete(id: number) {
    const user = await this.usersRepository.findOneBy({ id, isDeleted: false });
    if (!user) {
      return null;
    }

    Object.assign(user, { isDeleted: true });
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
}
