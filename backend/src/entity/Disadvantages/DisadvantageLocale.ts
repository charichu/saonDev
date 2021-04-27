import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


export enum Locale { 
    de = 'de',
    en = 'en'
}

@ObjectType()
@Entity()
export class DisadvantageLocale extends BaseEntity{
    @Field( () => Int)
    @PrimaryGeneratedColumn()
    id: number
    
    @Field( () => Int)
    @Column()
    advantageid: number

    @Field( () => Int)
    @Column()
    textId: number

    @Field()
    @Column({enum: Locale})
    locale: string

    @Field()
    @Column()
    text: string
}