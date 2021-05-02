import { Advantage } from "../../entity/Advantages/Advantage";
import { Resolver, Query, FieldResolver, Root, Arg } from "type-graphql";
import { AdvantageOutput } from "./AdvantageTypes";
import { Locales } from "../../entity/Locales/Locales";

@Resolver(() => AdvantageOutput)
export class AdvantageResolver {

    @Query(() => [AdvantageOutput])
    advantages() {
        return Advantage.find();
    } 

    @Query(() => AdvantageOutput)
    advantageById(
        @Arg("id") id: number
    ) {
        return Advantage.findOne({where: {id: id}});
    }    

    @FieldResolver()
    async title(@Root() advantage: Advantage, @Arg("locale", { defaultValue: "de" }) locale: string){
        let title = await Locales.findOne({ where: {objectid: advantage.id, locale: locale, textId: advantage.titleId}});
        let output = "N/A for locale " + locale;
        if(title?.text){
            output = title.text;
        }
        return output;
    }

    @FieldResolver()
    async description(@Root() advantage: Advantage, @Arg("locale", { defaultValue: "de" }) locale: string){
        let description = await Locales.findOne({ where: {objectid: advantage.id, locale: locale, textId: advantage.descriptionId}});
        let output = "N/A for locale " + locale;
        if(description?.text){
            output = description.text;
        }
        return output;
    }

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
}