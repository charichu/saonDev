import React from "react";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { Link, useHistory } from "react-router-dom";
import Loading from "../../components/Loading";
import { withNamespaces } from 'react-i18next';

const CREATE_BOOK = gql`
  mutation createBook($options: BookInput!, $localeInput: BookLocaleInput!) {
    createBook(options: $options, locale: $localeInput){id}
  }
`;

const CreateBook = ({t}) => { 

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
  
  //Variables for the form field
  let isbn, title, description, locale, image, short, isCore;

  return (
    <Mutation
    mutation={CREATE_BOOK}
    key={-1}
    onCompleted={() => history.push(`/books`)}
    >
    {(createBook, { loading, error }) => (
        <div className="container text-white">
        <div className="panel panel-default">
            <div className="panel-heading">
            <h3 className="panel-title">{t('books.add')}</h3>
            </div>
            <div className="panel-body">
            <h4>
                <Link to={`/books`} className="btn btn-secondary">
                {t('back.label')}
                </Link>
            </h4>
        <p>
        {t('books.add.info')}
        </p>
            <form
                onSubmit={(e) => {
                
            //TO-DO Add validation and give user output better use setStats and onChange for forms
                
            if((locale.value === "de" || locale.value === "en") 
                && isbn.value !== "" && short.value !== "" && image.value !== "" 
                && title.value !== ""&& description.value !== ""){
                
                    let coreInput = false
                    if(isCore.checked === true){coreInput = true;}

                    const options = {
                    isbn: isbn.value,
                    short: short.value,
                    imageURL: image.value,
                    isCore: coreInput
                    };

                    const localeInput = {
                        locale: locale.value,
                        title: title.value,
                        description: description.value,
                    }

                    e.preventDefault();

                    createBook({
                        variables: { options, localeInput },
                    });
                    
                    isbn.value = "";
                    short.value = "";
                    image.value = "";
                    locale.value = "";
                    title.value = "";
                    description.value = "";

                }}}
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
                defaultValue="ISBN"
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
                defaultValue="short"
            />
            </div>
            <div className="form-group">
            <label htmlFor="image">{t('books.imageURL')}</label>
            <input
                type="text"
                className="form-control"
                name="image"
                ref={(node) => {
                image = node;
                }}
                defaultValue="image"
            />
            </div>
                <div className="form-group">
                <label htmlFor="locale">{t('locale')}:</label>
                <input
                    type="text"
                    className="form-control"
                    name="locale"
                    ref={(node) => {
                        locale = node;
                    }}
                    defaultValue="de"
                />
                </div>
                <div className="form-group">
                <label htmlFor="title">{t('books.title')}:</label>
                <input
                    type="text"
                    className="form-control"
                    name="title"
                    ref={(node) => {
                        title = node;
                    }}
                    defaultValue="title"
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
                    defaultValue="description"
                />
                </div>
                <div className="form-group">
                <label htmlFor="isCore">{t('books.corerules')}:</label>
                <input
                    type="checkbox"
                    classname="custom-control-input"
                    name="isCore"
                    ref={(node) => {
                        isCore = node;
                    }}
                    for="isCore"
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
);
};

export default withNamespaces()(withAuthenticationRequired(CreateBook, {
  onRedirecting: () => <Loading />,
}));