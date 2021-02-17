import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { Link, useHistory, useParams } from "react-router-dom";
import { withNamespaces } from 'react-i18next';

function getByBookId(arr, id) {

  for (var i=0, iLen=arr.length; i<iLen; i++) {
    //eslint-disable-next-line
    if (arr[i].id == id) return arr[i];
  }
}

const DELETE_BOOK = gql`
mutation deleteBook($bookId: Int!) 
{
    deleteBook(id: $bookId)
}
`;

const Show = ({t}) => { 

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

  const bookls = JSON.parse(localStorage.getItem('bookls'));
  const book = getByBookId(bookls, id);

  return (
    <div className="container text-white">
      <div className="panel panel-default">
        <div className="panel-heading">
          <h4>
                <Link to="/books" className="btn btn-secondary">
                {t('books.title')}
                </Link>
          </h4>
          <h3 className="panel-title">{book.title}</h3>
        </div>
        <div className="panel-body">
          <dl>
            <dt>{t('book.isbn')}:</dt>
            <dd>{book.isbn}</dd>
            <dt>{t('book.title')}:</dt>
            <dd>{book.title}</dd>
            <dt>{t('book.description')}:</dt>
            <dd>{book.description}</dd>
            <dt>{t('book.short')}:</dt>
            <dd>{book.short}</dd>
            <dt>{t('book.imageURL')}:</dt>
            <dd>{book.imageURL}</dd>
          </dl>
          <Mutation
            mutation={DELETE_BOOK}
            key={book.id}
            onCompleted={() => history.push("/")}
          >
            {(deleteBook, { loading, error }) => (
              <div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    deleteBook({ variables: { bookId: parseInt(id) } });
                  }}
                >
                  <Link
                    to={{pathname: `/book/edit/${book.id}`, state: {book}}}
                    className="btn btn-secondary"
                  >
                    {t('edit.label')}
                  </Link>
                  &nbsp;
                  <button type="submit" className="btn btn-danger">
                  {t('delete.label')}
                  </button>
                </form>
                {loading && <p>Loading...</p>}
                {error && <p>Error : ${error.message}</p>}
              </div>
            )}
          </Mutation>
        </div>
      </div>
    </div>
  );
};

export default withNamespaces()(Show);