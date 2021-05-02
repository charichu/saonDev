import { Field, Int, ObjectType } from 'type-graphql';
import { Entity } from 'typeorm';

@ObjectType()
@Entity()
export class AdvantageOutput {
    @Field( () => Int)
    id: number

    @Field(() => Int)
    rank: number

    @Field(() => Int)
    stage: number

    @Field(() => Int)
    cost: number
    
    @Field(() => Int)
    source: number

    @Field(() => Int, {nullable: true})
    requirementId: number

    @Field(() => AdvantageOutput, {nullable: true})
    requiredAdvantage: AdvantageOutput

    @Field(() => Int)
    titleId: number

    @Field(() => String)
    title: string

    @Field(() => Int)
    descriptionId: number

    @Field(() => String)
    description: string

    @Field(() => String)
    locale: string
}