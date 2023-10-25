import {
  Inject,
  Injectable,
  LoggerService,
  OnModuleInit,
} from '@nestjs/common';
import { UsersService } from './users/users.service';
import { LOGGER_PROVIDER_TOKEN } from './logging/logging.constant';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @Inject(LOGGER_PROVIDER_TOKEN)
    private readonly loggerService: LoggerService,
    private readonly usersService: UsersService,
  ) {}

  async onModuleInit() {
    const { isNew } = await this.usersService.initSystemAdmin();
    if (isNew) {
      this.loggerService.log('🚀 System Admin is initialized!');
    } else {
      this.loggerService.log('✅ System Admin is already existed!');
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}
