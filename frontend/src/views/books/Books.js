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
                <div className="panel-heading">
                  <h3 className="panel-title">{t('books.title')}</h3>
                  <h4>
                    <Link to="/book/create" className="btn btn-secondary">{t('book.add')}</Link>
                  </h4>
                </div>
                <div className="panel-body">
                  <table className="table table-dark">
                    <thead>
                      <tr>
                        <th>{t('book.isbn')}</th>
                        <th>{t('book.title')}</th>
                        <th>{t('details.label')}</th>
                        <th>{t('edit.label')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.bookls.map((book, index) => (
                        <tr key={index}>
                          <td>{book.isbn}</td>
                          <td><Link to={`/book/show/${book.id}`}>{book.title}</Link></td>
                          <td><Link to={`/book/show/${book.id}`} className="btn btn-secondary">{t('details.label')}</Link></td>
                          <td><Link to={{pathname: `/book/edit/${book.id}`, state: {titleId: book.titleId, descriptionId: book.descriptionId}}} className="btn btn-primary">{t('edit.label')}</Link></td>
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