import { Disadvantage } from "../../entity/Disadvantages/Disadvantage";
import { Resolver, Query, FieldResolver, Root, Arg, Mutation, Authorized } from "type-graphql";
import { DisadvantageOutput } from "./DisadvantageTypes";
import { Locales } from "../../entity/Locales/Locales";

@Resolver(() => DisadvantageOutput)
export class DisadvantageResolver {

    //GET ALL ADVANTAGES
    @Query(() => [DisadvantageOutput])
    disadvantages() {
        return Disadvantage.find();
    }

    //GET ONE ADVANTAGE BY ITS ID
    @Query(() => DisadvantageOutput)
    disadvantageById(
        @Arg("id") id: number
    ) {
        return Disadvantage.findOne({where: {id: id}});
    }    

    //RESOLVE TITLE AGAINST LOCALES TABLE
    @FieldResolver()
    async title(@Root() disadvantage: Disadvantage, @Arg("locale", { defaultValue: "de" }) locale: string){
        let title = await Locales.findOne({ where: {objectid: disadvantage.id, locale: locale, textId: disadvantage.titleId}});
        let output = "N/A for locale " + locale;
        if(title?.text){
            output = title.text;
        }
        return output;
    }

    //RESOLVE DESCRIPTION AGAINST LOCALES TABLE
    @FieldResolver()
    async description(@Root() disadvantage: Disadvantage, @Arg("locale", { defaultValue: "de" }) locale: string){
        let description = await Locales.findOne({ where: {objectid: disadvantage.id, locale: locale, textId: disadvantage.descriptionId}});
        let output = "N/A for locale " + locale;
        if(description?.text){
            output = description.text;
        }
        return output;
    }

    //RESOLVE REQUIREMNTID RECURSIVE AGAINST ADVANTAGE TABLE
    @FieldResolver()
    async requiredDisadvantage(@Root() disadvantage: Disadvantage){
        if(disadvantage.requirementId){
            let requiredDisadvantage = await Disadvantage.findOne({ where: {objectid: disadvantage.requirementId}});
            if(requiredDisadvantage){
                return requiredDisadvantage;
            }
        }
        return null;
    }

    //DELETE SINGLE ADVANTAGE    
    @Authorized("ADMIN")
    @Mutation(() => Boolean, { nullable: true })
    async deleteDisadvanatage(@Arg("id") id: number) {
        await Disadvantage.delete({ id });
        return true;
    }
  }