import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Skill extends BaseEntity{
    @Field( () => Int)
    @PrimaryGeneratedColumn()
    id: number

    @Field(() => Int)
    @Column({nullable: true})
    titleId: number

    @Field(() => Int)
    @Column({nullable: true})
    descriptionId: number
    
    @Field()
    @Column()
    source: number

    @Field()
    @Column()
    requirementid: number

    @Field()
    @Column()
    firstcheck: number

    @Field()
    @Column()
    secondcheck: number

    @Field()
    @Column()
    thirdcheck: number

    @Field()
    @Column()
    categoryid: number

    @Field()
    @Column()
    usagesid: number

    @Field({defaultValue: false})
    @Column()
    encumbrance: boolean    
    
    @Field()
    @Column()
    toolsid: number

    @Field()
    @Column()
    criticalsuccessid: number
    
    @Field()
    @Column()
    criticalfailid: number

    @Field()
    @Column()
    improvmentcost: string
    
    @Field()
    @Column()
    failid: number

    @Field()
    @Column()
    qualityid: number
}