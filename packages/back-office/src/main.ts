import { NestFactory } from '@nestjs/core'
import { ExpressAdapter } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import express from 'express'
import * as functions from 'firebase-functions'
import 'reflect-metadata'

import { AppModule } from './app/app.module'

const server = express()

export const createNestServer = async expressInstance => {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressInstance), {
    cors: true,
  })

  if (process.env.ENV === 'development') {
    app.enableCors({
      origin: function (origin, callback) {
        if (!origin || origin === 'null' || process.env.ALLOWED_ORIGINS?.includes(origin)) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
      },
    })
  }

  const config = new DocumentBuilder()
    .setTitle('Tussis')
    .setDescription("API for managing my daughter's asthma condition")
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)

  return app.init()
}

createNestServer(server)
  .then(v => console.log('Nest Ready'))
  .catch(err => console.error('Nest broken', err))

// Connect express server to Firebase Functions
export const api = functions.https.onRequest(server)
