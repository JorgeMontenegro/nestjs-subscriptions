import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { graphqlConfig } from './config/graphql.config';
import { PingPongResolvers } from './resolvers/pin-pong.resolver';
import { PubSub } from 'apollo-server-express';

@Module({
  imports: [
    GraphQLModule.forRoot(graphqlConfig),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PingPongResolvers,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub()
    }
  ],
})
export class AppModule {}
