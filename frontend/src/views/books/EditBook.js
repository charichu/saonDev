import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import gql from "graphql-tag";
import { Query, Mutation } from "react-apollo";
import { Link, useHistory, useParams } from "react-router-dom";
import Loading from "../../components/Loading"

const GET_BOOK = gql`
  query book($bookId: Int!) {
    book(id: $bookId) {
      short
      isbn
      title
      description
      imageURL
    }
  }
`;

const UPDATE_BOOK = gql`
  mutation updateBook($bookId: Int!, $input: BookUpdateInput!) {
    updateBook(id: $bookId, input: $input)
  }
`;

const EditBook = () => { 

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
        variables={{ bookId: parseInt(this.props.match.params.id) }}
    >
        {({ loading, error, data }) => {
        if (loading) return <Loading/>;
        if (error) return `Error! ${error.message}`;

        return (
            <Mutation
            mutation={UPDATE_BOOK}
            key={data.book.id}
            onError={() => console.log(error)}
            onCompleted={() => this.props.history.push(`/`)}
            >
            {(updateBook, { loading, error }) => (
                <div className="container">
                <div className="panel panel-default">
                    <div className="panel-heading">
                    <h3 className="panel-title">EDIT BOOK</h3>
                    </div>
                    <div className="panel-body">
                    <h4>
                        <Link to="/book" className="btn btn-secondary">
                        Book List
                        </Link>
                        <br></br><br></br>
                        <Link to={`/book/show/${this.props.match.params.id}`} className="btn btn-secondary">
                        Back
                        </Link>
                    </h4>
                    <form
                        onSubmit={(e) => {
                        const input = {isbn: isbn.value};  
                        e.preventDefault();
                        updateBook({
                            variables: { bookId: parseInt(this.props.match.params.id), input },
                        });
                        isbn.value = "";
                        }}
                    >
                        <div className="form-group">
                        <label htmlFor="isbn">ISBN:</label>
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
                        <button type="submit" className="btn btn-secondary">
                        Submit
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
        }}
    </Query>
  );
};

export default EditBook;