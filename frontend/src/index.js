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

//const token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ikh1SUFGT1lDMWJVNWNWTGQ2WVZTSSJ9.eyJpc3MiOiJodHRwczovL2Rldi1zYW9uMi5ldS5hdXRoMC5jb20vIiwic3ViIjoiZ24ySG1CMmZXUVR1dFNaVFN6M0U3QXRXRmZBMkRLanZAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vc2FvbjItYXBpLmRldi5jb20iLCJpYXQiOjE2MTI1MzQ5MDAsImV4cCI6MTYxMzQwMTY4MCwiYXpwIjoiZ24ySG1CMmZXUVR1dFNaVFN6M0U3QXRXRmZBMkRLanYiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMiLCJwZXJtaXNzaW9ucyI6W119.n1VD9PY6v1ObnZQZ4tA_Spr79HlIn46-cOxY9VCsfB9mjvTxTMqs6uEsNxkYstjBQuvGX6s22qwmC6Qmjst8r1p4PobDaxML-TJfcTZ8yPDhg-YBQMV5Pmb16Fb9jx3HhW_9pZ3dTP385cS3Ke9NzfgP-1WbZJLbv6hPznjR3UyEpYTG4Ay8LYEj8jP4ZouaAbdnm015azDwos2UYBTb9LRgDi0bVHmMAOuOsj9fFJk5b5Vq6BCnWnzq6H3EPO5B2YX0zxyXz0nNhqlVTYXGW4yQ49lo5jqSlo0NFzOpxr2OLaJkCZTxF_ID7k5ltQgvKLkyh9f1yzVcuVaBCJq49g";

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
