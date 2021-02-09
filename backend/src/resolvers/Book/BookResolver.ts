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
      this.createBookLocale(locale.locale, locale.title, titleId);
    }
    if (locale.description) {
      this.createBookLocale(locale.locale, locale.description, descriptionId);
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
    @Arg("bookId", () => Int) bookId: number
  ) {
    const input = {
      locale: locale,
      bookid: bookId,
      text: text,
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
    for(let i = 0; i < bookList.length; i++){
      //TODO use method below for this! booklocale!!
      const title = await BookLocale.findOne({where: { bookid: bookList[i].id + prefixTitle,locale: locale },
      });
      const description = await BookLocale.findOne({
        where: { bookId: bookList[i].id + prefixDescription, locale: locale },
      });

      const output: BookOutput = {
        id: bookList[i].id,
        isbn: bookList[i].isbn,
        title: title!.text,
        short: bookList[i].short,
        description: description!.text,
        imageURL: bookList[i].imageURL
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
      where: { titleId: id + prefixTitle,  },
    });
    const description = await BookLocale.findOne({
      where: { titleId: id + prefixDescription, locale: locale },
    });

    const output: BookOutput = {
      id: book!.id,
      isbn: book!.isbn,
      title: title!.text,
      short: book!.short,
      description: description!.text,
      imageURL: book!.imageURL
    };
    return output;
  }

  //QUERIES LOCALE
  @Query(() => [BookLocale])
  async booklocales(@Arg("locale", { defaultValue: "de" }) locale: string) {
    return Book.find({ where: { locale: locale } });
  }

  @Query(() => BookLocale)
  async booklocale(@Arg("id") id: number,
  @Arg("textId", () => Int, {nullable:true})textId: textIdInput) {
    if(textId){
      if(textId.isTitle){
        const id = textId.bookid + prefixTitle;
        return BookLocale.findOne({ where: { bookId: id } });
      } else {
        const id = textId.bookid + prefixDescription;
        return BookLocale.findOne({ where: { bookId: id } });
      }
    };
    return BookLocale.findOne({ where: { id } });
  }
}
