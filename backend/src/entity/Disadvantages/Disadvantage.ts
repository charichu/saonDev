import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Disadvantage extends BaseEntity{
    @Field( () => Int)
    @PrimaryGeneratedColumn()
    id: number

    @Field()
    @Column()
    rank: number

    @Field()
    @Column()
    stage: number

    @Field()
    @Column()
    cost: number
    
    @Field()
    @Column()
    source: number

    @Field()
    @Column()
    requirementid: number

    @Field(() => Int)
    @Column({nullable: true})
    titleId: number

    @Field(() => Int)
    @Column({nullable: true})
    descriptionId: number

    @Field({defaultValue:true})
    @Column()
    isadvantge: boolean
}