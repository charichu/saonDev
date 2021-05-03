import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


export enum Locale { 
    de = 'de',
    en = 'en'
}

export enum TableName { 
    advantages = 'Vorteile',
    disadvantages = 'Nachteile'
}

@ObjectType()
@Entity()
export class Locales extends BaseEntity{
    @Field( () => Int)
    @PrimaryGeneratedColumn()
    id: number
    
    @Field( () => Int)
    @Column()
    objectid: number

    @Field( () => Int)
    @Column()
    textId: number

    @Field()
    @Column({enum: Locale})
    locale: string

    @Field()
    @Column()
    text: string
    
    @Field()
    @Column({enum: TableName, nullable: true})
    table: string
}