import { DisadvantageOutput } from '../../resolvers/Disadvantage/DisadvantageTypes';
import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Disadvantage extends BaseEntity{
    @Field( () => Int)
    @PrimaryGeneratedColumn()
    id: number

    @Field(() => Int)
    @Column({nullable: true})
    rank: number

    @Field(() => Int)
    @Column({nullable: true})
    stage: number

    @Field(() => Int)
    @Column()
    cost: number
    
    @Field(() => Int)
    @Column()
    source: number

    @Field(() => Int)
    @Column({nullable: true})
    requirementId: number

    @Field(() => DisadvantageOutput, {nullable: true})
    requiredAdvantage: DisadvantageOutput

    @Field(() => Int)
    @Column()
    titleId: number

    @Field(() => Int)
    @Column()
    descriptionId: number
}