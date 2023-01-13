import { NestFactory } from '@nestjs/core';

//_____________________Custom Imports_____________________//
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
})
  await app.listen(7001);
}
bootstrap();
