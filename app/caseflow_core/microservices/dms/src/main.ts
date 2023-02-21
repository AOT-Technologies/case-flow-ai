import { NestFactory } from '@nestjs/core';

import { Transport } from '@nestjs/microservices';

//_____________________Custom Imports_____________________//

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  try {
    app.enableCors({
      origin: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
  })
    await app.listen(7002);
  } catch (err) {
    console.log(err);
  }

}

bootstrap();

