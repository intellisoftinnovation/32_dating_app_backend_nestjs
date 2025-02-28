import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { envs } from './config';

async function main() {
  const prefix = `api`;
  const version = `0.0.1`;
  const logger = new Logger('Chomy-Api');
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
  });

  app.setGlobalPrefix(`${prefix}/${version}`);

  const config = new DocumentBuilder()
    .setTitle('Chomy - Api')
    .setDescription('Chomy - Api Documentation')
    .setVersion('0.0.1')
    .addApiKey({
      type: 'apiKey',
      name: 'token',
      in: 'header', 
    }, 'token')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${prefix}/${version}/docs`, app, document);
  await app.listen(envs.PORT);
  logger.log(`Chomy-Api is listening on port ${envs.PORT}`);
}
main();
