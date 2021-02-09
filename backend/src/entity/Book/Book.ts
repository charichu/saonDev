import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Book extends BaseEntity{
    @Field( () => Int)
    @PrimaryGeneratedColumn()
    id: number

    @Field()
    @Column()
    isbn: string

    @Field()
    @Column()
    short: string

    @Field()
    @Column()
    imageURL: string

    @Field(() => Int)
    @Column({nullable: true})
    titleId: number

    @Field(() => Int)
    @Column({nullable: true})
    descriptionId: number

    @Field({defaultValue:false})
    @Column()
    isCore: boolean
}