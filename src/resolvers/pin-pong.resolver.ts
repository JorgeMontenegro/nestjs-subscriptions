import { Resolver, Mutation, Subscription, Query } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { PubSubEngine } from 'graphql-subscriptions';
import { PingPong } from './../models/ping-pong.model';

const PONG_EVENT_NAME = 'pong';

@Resolver(PingPong)
export class PingPongResolvers {

  constructor(@Inject('PUB_SUB') private pubSub: PubSubEngine) {}

  @Query(() => Number, {
    name: 'consulta'
  })
  consultaPing() {
    const ping = { id: new Date() };
    this.pubSub.publish(PONG_EVENT_NAME, { [PONG_EVENT_NAME]: { pingId: ping.id } });
    return 1;
  }

  @Mutation(() => PingPong,  {
      name: 'ping'
    })
  async ping() {
    const ping = { date: new Date() };
    this.pubSub.publish(PONG_EVENT_NAME, { [PONG_EVENT_NAME]: ping });
    return ping;
  }

  @Subscription(() => PingPong, {
      name:PONG_EVENT_NAME
    })
  pong() {
    return this.pubSub.asyncIterator(PONG_EVENT_NAME);
  }
}