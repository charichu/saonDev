import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";

import Loading from "./components/Loading";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./views/general/Home";
import Roadmap from "./views/general/Roadmap";
import Blog from "./views/general/Blog";
import Profile from "./views/general/Profile";
import ExternalApi from "./views/general/ExternalApi";
import Books from "./views/books/Books";
import ShowBook from "./views/books/Show";
import EditBook from "./views/books/EditBook";
import { useAuth0 } from "@auth0/auth0-react";
import history from "./utils/history";
import { withNamespaces } from 'react-i18next';

// styles
import "./App.css";

// fontawesome
import initFontAwesome from "./utils/initFontAwesome";
initFontAwesome();

const App = ({t}) => {
  const { isLoading, error } = useAuth0();

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Router history={history}>
      <div id="app" className="d-flex flex-column h-100 bg-dark">
        <NavBar />
        <Container className="flex-grow-1 mt-5">
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/profile" component={Profile} />
            <Route path="/external-api" component={ExternalApi} />
            <Route path="/roadmap" component={Roadmap} />
            <Route path="/blog" component={Blog} />
            <Route path="/books" component={Books} />
            <Route path='/book/show/:id' component={ShowBook} />
            <Route path='/book/edit/:id' component={EditBook} />
          </Switch>
        </Container>
        <Footer />
      </div>
    </Router>
  );
};

export default withNamespaces()(App);
