import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading";
import { withNamespaces } from 'react-i18next';

const GET_BOOKS = gql`
  {
    bookls {
      id
      title
      isbn
      short
      titleId
      descriptionId
      description
      imageURL
    }
  }
`;

const Books = ({t}) => { 

  const {
    getAccessTokenSilently,
    isAuthenticated,
  } = useAuth0();

  const setToken = async () => {
    try {
      const token = await getAccessTokenSilently();
      localStorage.setItem("token", token);
    } catch (error) {console.log(error)}
  };

  setToken();

  return (
    <Query query={GET_BOOKS} >
        {({ loading, error, data }) => {
          if (loading) return <Loading />;
          if (error) return `Error! ${error.message}`;
          localStorage.setItem("bookls", JSON.stringify(data.bookls));
          return (
            <div className="container bg-dark text-white">
              <div className="panel panel-default">
                {/* Showing Button for adding books if logged in */}
                <div className="panel-heading">
                  <h3 className="panel-title">{t('books.list')}</h3>
                  {isAuthenticated && (
                    <h4>
                      <Link to="/book/create" className="btn btn-secondary">{t('books.add')}</Link>
                    </h4>
                  )}
                </div>
                <br/>
                <div className="panel-body">
                  <table className="table table-dark">
                    <thead>
                      <tr>
                        <th>{t('books.isbn')}</th>
                        <th>{t('books.title')}</th>
                        <th>{t('details.label')}</th>
                        {isAuthenticated && (<th>{t('edit.label')}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {data.bookls.map((book, index) => (
                        <tr key={index}>
                          <td>{book.isbn}</td>
                          <td><Link to={`/book/show/${book.id}`}>{book.title}</Link></td>
                          <td><Link to={`/book/show/${book.id}`} className="btn btn-secondary">{t('details.label')}</Link></td>
                          {isAuthenticated && (
                            <td><Link to={{pathname: `/book/edit/${book.id}`, state: {titleId: book.titleId, descriptionId: book.descriptionId}}} className="btn btn-primary">{t('edit.label')}</Link></td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        }}
      </Query>
  );
};

export default withNamespaces()(Books);