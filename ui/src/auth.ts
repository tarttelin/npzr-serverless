import Amplify, {Auth} from "aws-amplify";
import config from "./config";
import AWSAppSyncClient from "aws-appsync/lib";
import { ApolloClient } from "apollo-client";


Amplify.configure({
    Auth: {
        region: config.region,
        userPoolId: config.UserPoolId,
        userPoolWebClientId: config.ClientId
    }
});

const authType: "AMAZON_COGNITO_USER_POOLS" = "AMAZON_COGNITO_USER_POOLS";

const authConfig = {
    type: authType,
    jwtToken: async () =>
        (await Auth.currentSession()).getAccessToken().getJwtToken()
};

const client = () => new AWSAppSyncClient(
    {
        disableOffline: true,
        url: config.graphqlEndpoint,
        region: config.region,
        auth: authConfig,
        complexObjectsCredentials: () => Auth.currentCredentials()
    }
);

let _client: Map<string, ApolloClient<any>> = new Map<string, ApolloClient<any>>();
export default (subscriberName: string) => _client.has(subscriberName) ? _client.get(subscriberName)! : _client.set(subscriberName, client()).get(subscriberName)!;