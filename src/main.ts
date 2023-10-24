import { ConfigService } from '@nestjs/config';
import { setup } from './app.setup';

async function bootstrap() {
  const app = await setup();
  const configService = app.get<ConfigService>(ConfigService);

  // Start server
  const Port = configService.get<number>('PORT');
  await app.listen(Port, () => {
    console.log(`SERVER IS RUNNING ON [${Port}]`);
  });
}
bootstrap();
