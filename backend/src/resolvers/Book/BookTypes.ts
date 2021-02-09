import { InputType, Field, ObjectType } from 'type-graphql';
import { Entity } from 'typeorm';

@InputType()
export class BookInput {
    @Field()
    isbn: string

    @Field({nullable:true})
    short: string

    @Field({nullable:true})
    imageURL: string

    @Field({defaultValue:false})
    isCore: boolean
}

@InputType()
export class BookUpdateInput {
    @Field(() => String, {nullable: true})
    isbn?: string;
}

@InputType()
export class BookLocaleInput {
    @Field()
    locale: string

    @Field()
    title: string

    @Field()
    description: string
}

@InputType()
export class textIdInput {
    @Field()
    bookid: number

    @Field()
    isTitle: boolean

}

@ObjectType()
@Entity()
export class BookOutput {
    @Field()
    id: number;

    @Field()
    isbn: string

    @Field({nullable:true})
    short: string

    @Field()
    title: string

    @Field()
    description: string 
    
    @Field({nullable:true})
    imageURL: string
}