import { Controller, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { CrudApi } from './common/decorators/controller.decorator';

@ApiTags('health')
@Controller('health')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @CrudApi({
    swagger: {
      summary: `Check server's health`,
      httpCode: HttpStatus.OK,
      successResponseOptions: { type: 'ok', cls: String },
    },
    nest: { method: 'Get', path: '/', isPublic: true },
  })
  checkHealth(): string {
    return this.appService.getHello();
  }
}
