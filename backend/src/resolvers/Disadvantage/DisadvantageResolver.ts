import { Disadvantage } from "../../entity/Disadvantages/Disadvantage";
import { Resolver, Query, FieldResolver, Root, Arg, Mutation, Authorized } from "type-graphql";
import { DisadvantageOutput } from "./DisadvantageTypes";
import { Locales, TableName, Locale } from "../../entity/Locales/Locales";


//Prefix for translationtable
const prefixTitle       = 100000;
const prefixDescription = 200000;

@Resolver(() => DisadvantageOutput)
export class DisadvantageResolver {

    //GET ALL ADVANTAGES
    @Query(() => [DisadvantageOutput])
    disadvantages() {
        return Disadvantage.find();
    }

    //GET ONE ADVANTAGE BY ITS ID
    @Query(() => DisadvantageOutput, {nullable: true})
    disadvantageById(
        @Arg("id") id: number
    ) {
        let output = Disadvantage.findOne({where: {id: id}});
        return output ? output : null;
    }    

    //RESOLVE TITLE AGAINST LOCALES TABLE
    @FieldResolver()
    async title(@Root() disadvantage: Disadvantage, @Arg("locale", { defaultValue: Locale.de }) locale: Locale){
        let title = await Locales.findOne({ where: {objectid: disadvantage.id, locale: locale, textId: disadvantage.titleId}});
        let output = "N/A for locale " + locale;
        if(title?.text){
            output = title.text;
        }
        return output;
    }

    //RESOLVE DESCRIPTION AGAINST LOCALES TABLE
    @FieldResolver()
    async description(@Root() disadvantage: Disadvantage, @Arg("locale", { defaultValue: Locale.de }) locale: Locale){
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
    async deleteAdvanatage(@Arg("id") id: number) {
        await Disadvantage.delete({ id });
        return true;
    }

    //CREATE SINGLE ADVANTAGE
    @Authorized("ADMIN")
    @Mutation(() => Boolean, { nullable: true })
    async createDisadvantage(
        @Arg("rank", { nullable: true }) rank: number,
        @Arg("stage", { nullable: true }) stage: number,
        @Arg("cost") cost: number,
        @Arg("source") source: number,
        @Arg("requirementId", { nullable: true }) requirementId: number,
        @Arg("title") title: string,
        @Arg("description") description: string,
        @Arg("locale", { defaultValue: Locale.de }) locale: Locale,
        ) {

        const input = {
            rank: rank,
            stage: stage,
            cost: cost,
            source: source,
            requirementId: requirementId
        };

        const newDisadvantage = await Disadvantage.create(input).save();
        const disadvantageId = newDisadvantage.id;
        const titleId = prefixTitle + disadvantageId;
        const descriptionId = prefixDescription + disadvantageId;

        const newLocaleTitle = {
            objectid: newDisadvantage.id,
            textId: titleId,
            locale:  locale,
            text: title,
            table: TableName.disadvantages
        };
        const newLocaleDescription = {
            objectid: newDisadvantage.id,
            textId: descriptionId,
            locale:  locale,
            text: description,
            table: TableName.disadvantages
        };
        
        Locales.create(newLocaleTitle).save();
        Locales.create(newLocaleDescription).save();
        Disadvantage.update(disadvantageId, { titleId, descriptionId })

        return true;
    }

    //ADD TRANSLATION BY ID
    @Authorized("ADMIN")
    @Mutation(() => Boolean, { nullable: true })
    async newTranslationForDisadvantage(
        @Arg("disadvantageId") disadvantageId: number,
        @Arg("locale", {defaultValue: Locale.de} ) locale: Locale,
        @Arg("text") text: string,
        @Arg("isTitle") isTitle: boolean
        ) {
        
        const input = {
            objectid: disadvantageId,
            textId: (isTitle) ? (prefixTitle + disadvantageId) : (prefixDescription + disadvantageId),
            locale:  locale,
            text: text,
            table: TableName.disadvantages
        };
        
        Locales.create(input).save();

        return true;
    }
    
    //UPDATE LOCALES
    @Authorized("ADMIN")
    @Mutation(() => Boolean, { nullable: true })
    async updateTextForDisadvantage(
        @Arg("disadvantageId") disadvantageId: number,
        @Arg("locale", {defaultValue: Locale.de} ) locale: Locale,
        @Arg("text") text: string,
        @Arg("isTitle") isTitle: boolean
        ) {
        const textId = (isTitle) ? (prefixTitle + disadvantageId) : (prefixDescription + disadvantageId)
        
        Locales.update({objectid: disadvantageId, textId: textId, locale: locale}, {text: text});

        return true;
    }
    @Authorized("ADMIN")
    @Mutation(() => Boolean, { nullable: true })
    async updateTextByTextId(
        @Arg("id") id: number,
        @Arg("text") text: string,
        @Arg("locale", {defaultValue: Locale.de} ) locale: Locale
        ) {

        Locales.update({textId: id, locale: locale}, {text: text});

        return true;
    }

    //UPDATE ADVANTAGE
    @Authorized("ADMIN")
    @Mutation(() => Boolean, { nullable: true })
    async updateDisadvantageById(
        @Arg("disadvantageId") disadvantageId: number,
        @Arg("locale", {defaultValue: Locale.de} ) locale: Locale,
        @Arg("title") title: string,
        @Arg("description") description: string,
        @Arg("cost") cost: number,
        @Arg("rank") rank: number,
        @Arg("stage") stage: number,
        @Arg("source") source: number,
        @Arg("requirementId") requirementId: number
        ) {

        const disadvantage = await Disadvantage.findOne({where: {id: disadvantageId}});

        if(!disadvantage){
            return false;
        }

        const input = {
            cost: cost || disadvantage.cost,
            rank: rank || disadvantage.rank,
            stage: stage || disadvantage.stage,
            source: source || disadvantage.source,
            requirementId: requirementId || disadvantage.requirementId
        }

        Disadvantage.update({id: disadvantageId}, input);

        if(title){            
            this.updateTextByTextId(disadvantage.titleId, title, locale);
        }

        if(description){            
            this.updateTextByTextId(disadvantage.descriptionId, description, locale);
        }

        return true;
    }

    //QUERY LOCALE TEXT BY ID
    @Query(() => Locales, {nullable: true})
    localeById(
        @Arg("id") id: number
    ) {
        let output = Locales.findOne({where: {id: id}});
        return output ? output : null;
    } 
    
    //QUERY LOCALE TEXT BY ID
    @Query(() => [Locales], {nullable: true})
    localeByDisadvantageId(
        @Arg("disadvantageId") disadvantageId: number,
        @Arg("locale", {defaultValue: Locale.de} ) locale: Locale
    ) {
        const titleId = prefixTitle + disadvantageId;
        const descriptionId = prefixDescription + disadvantageId;
        let output = [
            Locales.findOne({where: {objectid: disadvantageId, textId: titleId, locale: locale }}),
            Locales.findOne({where: {objectid: disadvantageId, textId: descriptionId, locale: locale }})
        ]
        return output ? output : null;
    } 

    //QUERY ADVANTAGE BY NAME
    @Query(() => DisadvantageOutput, {nullable: true})
    async disadvantageByTitle(
        @Arg("title") title: string,
    ) {
        const locale = await Locales.findOne({where: {text: title}});
        
        return (locale) ? this.disadvantageById(locale.objectid) : null;
    } 
    //TODO 
    // Add FUZZY SEARCH FOR TITLE    
}