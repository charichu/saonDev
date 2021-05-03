import { AdvantageOutput } from '../../resolvers/Advantage/AdvantageTypes';
import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Advantage extends BaseEntity{
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

    @Field(() => AdvantageOutput, {nullable: true})
    requiredAdvantage: AdvantageOutput

    @Field(() => Int)
    @Column({nullable: true})
    titleId: number

    @Field(() => Int)
    @Column({nullable: true})
    descriptionId: number
}