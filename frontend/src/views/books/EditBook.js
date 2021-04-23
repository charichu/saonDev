import React, {useState} from "react";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import gql from "graphql-tag";
import { Query, Mutation } from "react-apollo";
import { Link, useHistory, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import { withNamespaces } from 'react-i18next';

const GET_BOOK = gql`
query book($bookId: Int!)
{
    book(id: $bookId) {
      short
      isbn
      titleId
      descriptionId
      imageURL
      title
      description
    }
}
`;

const UPDATE_BOOK = gql`
  mutation updateBook($bookId: Int!, $input: BookUpdateInput!) {
    updateBook(id: $bookId, input: $input)
  }
`;

const UPDATE_LOCALE = gql`
  mutation updateTextByIdAndLocale($textId: Int!, $locale: String!, $text: String!){
    updateTextByIdAndLocale(textId: $textId, locale: $locale, text: $text)
  }
`;

const EditBook = ({t}) => { 

  const {
    getAccessTokenSilently,
  } = useAuth0();
  
  const setToken = async () => {
    try {
      const token = await getAccessTokenSilently();
      localStorage.setItem("token", token);
    } catch (error) {console.log(error)}
  };
  
  setToken();
  
  const history = useHistory();
  
  const { id } = useParams();

  const { titleId } = useState();
  localStorage.setItem('titleId', titleId)

  //Variables for the form field
  let isbn, title, description, locale, image, short;

  return (
    <Query
    query={GET_BOOK}
    variables={{ bookId: parseInt(id) }}
  >
    {({ loading, error, data }) => {
      if (loading) return <Loading/>;
      if (error) return `Error! ${error.message}`;

      return (
        <div>
          {/* UPDATE GENERAL BOOK INFORMATION  */}
          <Mutation
            mutation={UPDATE_BOOK}
            key={data.book.id}
            onError={() => console.log(error)}
            onCompleted={() => history.push(`/books`)}
          >
            {(updateBook, { loading, error }) => (
              <div className="container text-white">
                <div className="panel panel-default">
                  <div className="panel-heading">
                    <h3 className="panel-title">{t('books.edit')}</h3>
                  </div>
                  <div className="panel-body">
                    <h4>
                      <Link to={`/book/show/${id}`} className="btn btn-secondary">
                      {t('back.label')}
                      </Link>
                    </h4>

                    {/* first form to change basic without locales  */}

                    <form
                      onSubmit={(e) => {
                        const input = {
                          isbn: isbn.value,
                          short: short.value,
                          imageURL: image.value
                        }

                        console.log(input);

                        e.preventDefault();
                        updateBook({
                          variables: { bookId: parseInt(id), input },
                        });
                        isbn.value = "";
                        short.value = "";
                        image.value = "";
                      }}
                    >
                      <div className="form-group">
                        <label htmlFor="isbn">{t('books.isbn')}:</label>
                        <input
                          type="text"
                          className="form-control"
                          name="isbn"
                          ref={(node) => {
                            isbn = node;
                          }}
                          placeholder="ISBN"
                          defaultValue={data.book.isbn}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="short">{t('books.shortname')}:</label>
                        <input
                          type="text"
                          className="form-control"
                          name="short"
                          ref={(node) => {
                            short = node;
                          }}
                          placeholder="image"
                          defaultValue={data.book.short}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="image">{t('books.imageURL')}:</label>
                        <input
                          type="text"
                          className="form-control"
                          name="image"
                          ref={(node) => {
                            image = node;
                          }}
                          placeholder="image"
                          defaultValue={data.book.imageURL}
                        />
                      </div>
                      <button type="submit" className="btn btn-secondary">
                      {t('submit.label')}
                      </button>
                    </form>
                    {loading && <p>Loading...</p>}
                    {error && <p>Error : ${error.message}</p>}
                  </div>
                </div>
              </div>
            )}
          </Mutation>
          <br/>
          {/* UPDATE LOCALE TEXT  */}
          <Mutation
            mutation={UPDATE_LOCALE}
            key={data.book.id}
            onError={() => console.log(error)}
            onCompleted={() => history.push(`/books`)}
          >
            {(updateTextByIdAndLocale, { loading, error }) => (
              <div className="container text-white">
                <div className="panel panel-default">
                  <div className="panel-body">
                    <h4>
                      {t('books.edit.texts')}
                    </h4>
                    <p> {t('books.edit.info')} </p>
                  {/* Second form for editing locales  */}

                  <form
                    onSubmit={(e) => {
                        
                      e.preventDefault();
                      //NEEDS TO BE CONTROLLED DURING INPUT JUST DURING ALPHA PHASE
                      if(locale.value !== 'de' || locale.value !== 'en'){
                        //TODO THROW ERROR FOR END USER
                      }
                      
                      if(title.value && title.value !== data.book.title && title.value === '1234'){                        
                        updateTextByIdAndLocale({
                          variables: { textId: parseInt(data.book.titleId), locale: locale.value, text: title.value },
                        });
                      }
                      if(description.value && description.value !== data.book.description && description.value === '1234'){                        
                        updateTextByIdAndLocale({
                          variables: { textId: parseInt(data.book.descriptionId), locale: locale.value, text: description.value },
                        });
                      }
                      locale.value = "";
                      title.value = "";
                      description.value = "";
                    }}
                  >
                    <div className="form-group">
                      <label htmlFor="locale">{t('locale')}:</label>
                      <input
                        type="text"
                        className="form-control"
                        name="locale"
                        ref={(node) => {
                          locale = node;
                        }}
                        placeholder="de"
                        defaultValue={data.book.locale}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="title">{t('books.title')}:</label>
                      <input
                        type="text"
                        className="form-control"
                        name="Title"
                        ref={(node) => {
                          title = node;
                        }}
                        placeholder="Title"
                        defaultValue={data.book.title}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="description">{t('books.description')}:</label>
                      <input
                        type="text"
                        className="form-control"
                        name="description"
                        ref={(node) => {
                          description = node;
                        }}
                        placeholder="description"
                        defaultValue={data.book.description}
                      />
                    </div>
                    <button type="submit" className="btn btn-secondary">
                    {t('submit.label')}
                    </button>
                  </form>
                    {loading && <p>Loading...</p>}
                    {error && <p>Error : ${error.message}</p>}
                  </div>
                </div>
              </div>
            )}
          </Mutation>
        </div>
      );
    }}
  </Query>
  );
};

export default withNamespaces()(withAuthenticationRequired(EditBook, {
  onRedirecting: () => <Loading />,
}));