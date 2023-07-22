import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';
import { readFileSync } from 'fs';
import * as https from 'https';
import * as dotenv from 'dotenv';
import * as path from 'path';


/*env 설정*/
dotenv.config({
  path: path.resolve(
    process.env.NODE_ENV == 'production'
      ? '.production.env'
      : '.development.env',
  ),
});

async function bootstrap() {


  const OPENVIDU_URL = process.env.OPENVIDU_URL;

  console.log('server run!');

  const app = await NestFactory.create(AppModule); //, { httpsOptions });

  app.enableCors({
    origin: '*',
  });
  app.use(express.static(join(__dirname, '..', 'public')));

  const SERVER_PORT = process.env.SERVER_PORT || 8080;
  await app.listen(SERVER_PORT);

  console.log('Application started on port: ', SERVER_PORT);
  console.warn('Application server connecting to OpenVidu at ' + OPENVIDU_URL);
}
bootstrap();
