const fs = require("fs");

function handler(data, serverless) {
  const authConfig = {
    ClientId: data['PoolClient'],
    AppWebDomain: "npzr-api-" + serverless.getProvider('aws').getStage() + ".auth." + serverless.getProvider('aws').getRegion() + ".amazoncognito.com",
    UserPoolId: data['PoolId'],
    graphqlEndpoint: data['GraphQlApiUrl'],
    region: serverless.getProvider('aws').getRegion()
  };
  const content = "const authConfig = " + JSON.stringify(authConfig, null, 2) + ";\n\nexport default authConfig;";

  fs.writeFileSync('./ui/src/config.js', content);
}

module.exports = { handler };