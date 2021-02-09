import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


export enum Locale { 
    de = 'de',
    en = 'en'
}

@ObjectType()
@Entity()
export class BookLocale extends BaseEntity{
    @Field( () => Int)
    @PrimaryGeneratedColumn()
    id: number
    
    // THIS MEANS TITLE OR DESCRIPTION ID DIFFERENCE IS TITLE STARTS WITH 1 AND DESCRIPTION WITH 2
    @Field( () => Int)
    bookId: number

    @Field()
    @Column({enum: Locale})
    locale: string

    @Field()
    @Column()
    text: string
}