import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import gql from "graphql-tag";
import { Query, Mutation } from "react-apollo";
import { Link, useHistory, useParams } from "react-router-dom";
import Loading from "../../components/Loading"

const GET_BOOK = gql`
query book($bookId: Int!)
{
    book(id: $bookId) {
      short
      isbn
      title
      description
      imageURL
    }
}
`;

const DELETE_BOOK = gql`
mutation deleteBook($bookId: Int!) 
{
    deleteBook(id: $bookId)
}
`;

const Show = () => { 

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

  return (
    <Query
        query={GET_BOOK}
        variables={{ bookId: parseInt(id) }}
      >
        {({ loading, error, data }) => {
          if (loading) return <Loading/>;
          if (error) return `Error! ${error.message}`;

          return (
            <div className="container text-white">
              <div className="panel panel-default">
                <div className="panel-heading">
                  <h4>
                        <Link to="/book" className="btn btn-secondary">
                        this.props.t('books.title')
                        </Link>
                  </h4>
                  <h3 className="panel-title">{data.book.title}</h3>
                </div>
                <div className="panel-body">
                  <dl>
                    <dt>this.props.t('book.isbn')</dt>
                    <dd>{data.book.isbn}</dd>
                    <dt>this.props.t('book.title')</dt>
                    <dd>{data.book.title}</dd>
                    <dt>this.props.t('book.description')</dt>
                    <dd>{data.book.description}</dd>
                    <dt>this.props.t('book.short')</dt>
                    <dd>{data.book.short}</dd>
                    <dt>this.props.t('book.imageURL')</dt>
                    <dd>{data.book.imageURL}</dd>
                  </dl>
                  <Mutation
                    mutation={DELETE_BOOK}
                    key={data.book.id}
                    onError={() => console.log(error)}
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
                            to={`/book/edit/${parseInt(id)}`}
                            className="btn btn-secondary"
                          >
                            this.props.t('edit.label')
                          </Link>
                          &nbsp;
                          <button type="submit" className="btn btn-danger">
                          this.props.t('delete.label')
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
        }}
      </Query>
  );
};

export default Show;