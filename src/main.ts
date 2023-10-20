import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configure } from './app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  // Config app
  configure(app, configService);

  // Start server
  const Port = configService.get<number>('PORT');
  await app.listen(Port, () => {
    console.log(`SERVER IS RUNNING ON [${Port}]`);
  });
}
bootstrap();
