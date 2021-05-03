import { Advantage } from "../../entity/Advantages/Advantage";
import { Resolver, Query, FieldResolver, Root, Arg, Mutation, Authorized } from "type-graphql";
import { AdvantageOutput } from "./AdvantageTypes";
import { Locales, TableName, Locale } from "../../entity/Locales/Locales";


//Prefix for translationtable
const prefixTitle       = 100000;
const prefixDescription = 200000;

@Resolver(() => AdvantageOutput)
export class AdvantageResolver {

    //GET ALL ADVANTAGES
    @Query(() => [AdvantageOutput])
    advantages() {
        return Advantage.find();
    }

    //GET ONE ADVANTAGE BY ITS ID
    @Query(() => AdvantageOutput, {nullable: true})
    advantageById(
        @Arg("id") id: number
    ) {
        let output = Advantage.findOne({where: {id: id}});
        return output ? output : null;
    }    

    //RESOLVE TITLE AGAINST LOCALES TABLE
    @FieldResolver()
    async title(@Root() advantage: Advantage, @Arg("locale", { defaultValue: Locale.de }) locale: Locale){
        let title = await Locales.findOne({ where: {objectid: advantage.id, locale: locale, textId: advantage.titleId}});
        let output = "N/A for locale " + locale;
        if(title?.text){
            output = title.text;
        }
        return output;
    }

    //RESOLVE DESCRIPTION AGAINST LOCALES TABLE
    @FieldResolver()
    async description(@Root() advantage: Advantage, @Arg("locale", { defaultValue: Locale.de }) locale: Locale){
        let description = await Locales.findOne({ where: {objectid: advantage.id, locale: locale, textId: advantage.descriptionId}});
        let output = "N/A for locale " + locale;
        if(description?.text){
            output = description.text;
        }
        return output;
    }

    //RESOLVE REQUIREMNTID RECURSIVE AGAINST ADVANTAGE TABLE
    @FieldResolver()
    async requiredAdvantage(@Root() advantage: Advantage){
        if(advantage.requirementId){
            let requiredAdvantage = await Advantage.findOne({ where: {objectid: advantage.requirementId}});
            if(requiredAdvantage){
                return requiredAdvantage;
            }
        }
        return null;
    }

    //DELETE SINGLE ADVANTAGE    
    @Authorized("ADMIN")
    @Mutation(() => Boolean, { nullable: true })
    async deleteAdvanatage(@Arg("id") id: number) {
        await Advantage.delete({ id });
        return true;
    }

    //CREATE SINGLE ADVANTAGE
    @Authorized("ADMIN")
    @Mutation(() => Boolean, { nullable: true })
    async createAdvantage(
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

        const newAdvantage = await Advantage.create(input).save();
        const advantageId = newAdvantage.id;
        const titleId = prefixTitle + advantageId;
        const descriptionId = prefixDescription + advantageId;

        const newLocaleTitle = {
            objectid: newAdvantage.id,
            textId: titleId,
            locale:  locale,
            text: title,
            table: TableName.advantages
        };
        const newLocaleDescription = {
            objectid: newAdvantage.id,
            textId: descriptionId,
            locale:  locale,
            text: description,
            table: TableName.advantages
        };
        
        Locales.create(newLocaleTitle).save();
        Locales.create(newLocaleDescription).save();
        Advantage.update(advantageId, { titleId, descriptionId })

        return true;
    }

    //ADD TRANSLATION BY ID
    @Authorized("ADMIN")
    @Mutation(() => Boolean, { nullable: true })
    async newTranslationForAdvantage(
        @Arg("advantageId") advantageId: number,
        @Arg("locale", {defaultValue: Locale.de} ) locale: Locale,
        @Arg("text") text: string,
        @Arg("isTitle") isTitle: boolean
        ) {
        
        const input = {
            objectid: advantageId,
            textId: (isTitle) ? (prefixTitle + advantageId) : (prefixDescription + advantageId),
            locale:  locale,
            text: text,
            table: TableName.advantages
        };
        
        Locales.create(input).save();

        return true;
    }
    
    //UPDATE LOCALES
    @Authorized("ADMIN")
    @Mutation(() => Boolean, { nullable: true })
    async updateTextForAdvantage(
        @Arg("advantageId") advantageId: number,
        @Arg("locale", {defaultValue: Locale.de} ) locale: Locale,
        @Arg("text") text: string,
        @Arg("isTitle") isTitle: boolean
        ) {
        const textId = (isTitle) ? (prefixTitle + advantageId) : (prefixDescription + advantageId)
        
        Locales.update({objectid: advantageId, textId: textId, locale: locale}, {text: text});

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
    async updateAdvantageById(
        @Arg("advantageId") advantageId: number,
        @Arg("locale", {defaultValue: Locale.de} ) locale: Locale,
        @Arg("title") title: string,
        @Arg("description") description: string,
        @Arg("cost") cost: number,
        @Arg("rank") rank: number,
        @Arg("stage") stage: number,
        @Arg("source") source: number,
        @Arg("requirementId") requirementId: number
        ) {

        const advantage = await Advantage.findOne({where: {id: advantageId}});

        if(!advantage){
            return false;
        }

        const input = {
            cost: cost || advantage.cost,
            rank: rank || advantage.rank,
            stage: stage || advantage.stage,
            source: source || advantage.source,
            requirementId: requirementId || advantage.requirementId
        }

        Advantage.update({id: advantageId}, input);

        if(title){            
            this.updateTextByTextId(advantage.titleId, title, locale);
        }

        if(description){            
            this.updateTextByTextId(advantage.descriptionId, description, locale);
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
    localeByAdvantageId(
        @Arg("advantageId") advantageId: number,
        @Arg("locale", {defaultValue: Locale.de} ) locale: Locale
    ) {
        const titleId = prefixTitle + advantageId;
        const descriptionId = prefixDescription + advantageId;
        let output = [
            Locales.findOne({where: {objectid: advantageId, textId: titleId, locale: locale }}),
            Locales.findOne({where: {objectid: advantageId, textId: descriptionId, locale: locale }})
        ]
        return output ? output : null;
    } 

    //QUERY ADVANTAGE BY NAME
    @Query(() => AdvantageOutput, {nullable: true})
    async advantageByTitle(
        @Arg("title") title: string,
    ) {
        const locale = await Locales.findOne({where: {text: title}});
        
        return (locale) ? this.advantageById(locale.objectid) : null;
    } 
    //TODO 
    // Add FUZZY SEARCH FOR TITLE    
}