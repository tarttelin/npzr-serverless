import React from 'react';
import ReactDOM from 'react-dom';
import Amplify, { Auth } from "aws-amplify";
import { ApolloProvider } from "react-apollo";
import AWSAppSyncClient from "aws-appsync";
import './index.css';
import App from './App';
import config from './config';
import * as serviceWorker from './serviceWorker';

Amplify.configure({
  Auth: {
    region: config.region,
    userPoolId: config.UserPoolId,
    userPoolWebClientId: config.ClientId
  }
});

const authConfig = {
  type: config.authMode,
  jwtToken: async () =>
    (await Auth.currentSession()).getAccessToken().getJwtToken()
};

const client = new AWSAppSyncClient(
  {
    disableOffline: true,
    url: config.graphqlEndpoint,
    region: config.region,
    auth: authConfig,
    complexObjectsCredentials: () => Auth.currentCredentials()
  }
);

ReactDOM.render(
  <ApolloProvider client={ client }>
      <App />
  </ApolloProvider>,
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
