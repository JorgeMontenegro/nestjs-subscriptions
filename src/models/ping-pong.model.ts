import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PingPong {
    @Field({ nullable: true, description: `Fecha de prueba` })
    date?: Date
}