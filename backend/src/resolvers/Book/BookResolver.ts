import { Book } from "../../entity/Book/Book";
import { BookLocale } from "../../entity/Book/BookLocale";
import { Arg, Mutation, Resolver, Query, Int, Authorized } from "type-graphql";
import {
  BookInput,
  BookLocaleInput,
  BookOutput,
  BookUpdateInput,
  textIdInput,
} from "./BookTypes";

//Prefix for translationtable
const prefixTitle = 100000;
const prefixDescription = 200000;

@Resolver()
export class BookResolver {
  
  //MUTATIONS
  @Authorized()
  @Mutation(() => Book, { nullable: true })
  async createBook(
    @Arg("options") options: BookInput,
    @Arg("locale", { nullable: true }) locale: BookLocaleInput
  ) {
    const book = await Book.create(options).save();
    const id = book.id;
    const titleId = prefixTitle + id;
    const descriptionId = prefixDescription + id;
    await Book.update({ id }, { titleId, descriptionId });

    //Create Locale Text
    if (locale.title) {
     this.createBookLocale(locale.locale, locale.title, id, true, false);
    }
    if (locale.description) {
     this.createBookLocale(locale.locale, locale.description, id, false, true);
    }
    return book;
  }

  @Authorized()
  @Mutation(() => Boolean, { nullable: true })
  async updateBook(
    @Arg("id", () => Int) id: number,
    @Arg("input", () => BookUpdateInput) input: BookUpdateInput
  ) {
    await Book.update({ id }, input);
    return true;
  }

  @Authorized()
  @Mutation(() => Boolean, { nullable: true })
  async deleteBook(@Arg("id", () => Int) id: number) {
    await Book.delete({ id });
    return true;
  }
  // MUTATION LOCALE
  @Authorized()
  @Mutation(() => Boolean, { nullable: true })
  async createBookLocale(
    @Arg("locale") locale: string,
    @Arg("text") text: string,
    @Arg("bookId", () => Int) bookId: number,
    @Arg("isTitle", { defaultValue: false }) isTitle: boolean,
    @Arg("isDescription", { defaultValue: false }) isDescription: boolean
  ) {
    let input = {};
    let textId;

    if(isTitle){      
      textId = prefixTitle + bookId; 
    } else if(isDescription){     
      textId = prefixDescription + bookId;     
    } else {
      return false
    }
    
    input = {
      locale: locale,
      bookId: bookId,
      text: text,
      textId: textId
    };

    await BookLocale.create(input).save();
    return true;
  }
  
  @Authorized()
  @Mutation(() => Boolean, { nullable: true })
  async updateBookLocale(
    @Arg("id", () => Int) id: number,
    @Arg("text") text: string
  ){
    await BookLocale.update({id}, {text});
    return true;
  };

  @Authorized()
  @Mutation(() => Boolean, { nullable: true })
  async deleteBookLocale(@Arg("id", () => Int) id: number) {
    await BookLocale.delete({ id });
    return true;
  }
  // QUERIES
  @Query(() => [Book])
  books() {
    return Book.find();
  }

  @Query(() => [BookOutput])
  async bookls(@Arg("locale", { defaultValue: "de" }) locale: string) {
    
    const bookList = await Book.find().then(
      (response) => response);
    
    let books = new Array(); 
    let title = "";
    let description = "";

    for(let i = 0; i < bookList.length; i++){
      
    const texts = await BookLocale.find({ where: {bookId: bookList[i].id, locale: locale}});

    if(texts[0].textId < prefixDescription){
      title = texts[0].text;
      description = texts[1].text;
    }else {
      title = texts[1].text;
      description = texts[0].text;
    }

      const output: BookOutput = {
        id: bookList[i].id,
        isbn: bookList[i].isbn,
        title: title,
        short: bookList[i].short,
        description: description,
        imageURL: bookList[i].imageURL,
        titleId: bookList[i].titleId,
        descriptionId: bookList[i].descriptionId,
      };
      books.push(output);
    }
    return books;
  }

  @Query(() => BookOutput)
  async book(
    @Arg("id", () => Int, { nullable: true }) id: number,
    @Arg("locale", { defaultValue: "de" }) locale: string
  ) {
    const book = await Book.findOne({ where: { id } }).then(
      (response) => response
    );
    const title = await BookLocale.findOne({
      where: { textId: book!.titleId, locale: locale },
    });
    const description = await BookLocale.findOne({
      where: { textId: book!.descriptionId, locale: locale },
    });

    const output: BookOutput = {
      id: book!.id,
      isbn: book!.isbn,
      title: title!.text,
      short: book!.short,
      description: description!.text,
      imageURL: book!.imageURL,
      titleId: book!.titleId,
      descriptionId: book!.descriptionId,
    };
    return output;
  }

  //QUERIES LOCALE
  @Query(() => [BookLocale])
  async booklocales(
    @Arg("locale", { defaultValue: "de" }) locale: string) {
    return Book.find({ where: { locale: locale } });
  }

  @Query(() => BookLocale)
  async booklocale(
    @Arg("id") id: number,
    @Arg("locale", { defaultValue: "de" }) locale: string,
    @Arg("textId", () => Int, {nullable:true})textId: textIdInput) {
    if(textId){
      if(textId.isTitle){
        const id = textId.bookid + prefixTitle;
        return BookLocale.findOne({ where: { bookId: id, locale: locale}});
      } else {
        const id = textId.bookid + prefixDescription;
        return BookLocale.findOne({ where: { bookId: id, locale: locale}});
      }
    };
    return BookLocale.findOne({ where: { id } });
  }
  
  @Query(() => [BookLocale])
  async bookAllTexts(
    @Arg("bookId") bookId: number,
    @Arg("locale", { defaultValue: "de" }) locale: string) {
      
      let output = new Array();
      const titleId       = bookId + prefixTitle;
      const descriptionId = bookId + prefixDescription;

      const titles        = await BookLocale.find({ where: { textId: titleId, locale: locale}});
      const descriptions  = await BookLocale.find({ where: { textId: descriptionId, locale: locale}});

      for(let i = 0; i < titles.length; i++){
        output.push(titles[i]);
      }
      for(let i = 0; i < descriptions.length; i++){
        output.push(descriptions[i]);
      }
      return output;
    };
}