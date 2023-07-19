import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';
import { readFileSync } from 'fs';
import * as https from 'https';

const OPENVIDU_URL = process.env.OPENVIDU_URL || 'https://seomik.shop/api';

async function bootstrap() {
  console.log('server run!');
//  const httpsOptions = {
//     key: readFileSync('/etc/letsencrypt/live/seomik.shop/key.pem'),
//     cert: readFileSync('/etc/letsencrypt/live/seomik.shop/cert.pem'),
//   };

  const app = await NestFactory.create(AppModule)//, { httpsOptions });

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
