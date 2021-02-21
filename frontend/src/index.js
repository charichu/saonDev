import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Auth0Provider } from "@auth0/auth0-react";
import history from "./utils/history";
import { getConfig } from "./config";
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
//eslint-disable-next-line
import i18n from './i18n';

const onRedirectCallback = (appState) => {
  history.push(
    appState && appState.returnTo ? appState.returnTo : window.location.pathname
  );
};

// Please see https://auth0.github.io/auth0-react/interfaces/auth0provideroptions.html
// for a full list of the available properties on the provider
const config = getConfig();


const providerConfig = {
  domain: config.domain,
  clientId: config.clientId,
  ...(config.audience ? { audience: config.audience } : null),
  redirectUri: window.location.origin,
  onRedirectCallback,
};

const token = localStorage.getItem("token");
console.log(token);

const client = new ApolloClient({ uri: 'http://localhost:4000/graphql', request: operation => {
    operation.setContext(context => ({
      headers: {
        ...context.headers,
        Authorization: token ? `Bearer ${token}` : "",
      },
    }));
  }, });

ReactDOM.render(
    <Auth0Provider {...providerConfig}>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>,
    </Auth0Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
