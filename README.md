# Ninja Pirate Zombie Robot

A two player card game devised by a few Canadians killing time in the winter. The frontend is
a typescript / react / MelonJS app. The backend uses AWS AppSync to implement a GraphQL api.

## Pre-requisites

- UI
    - Node 10.x.x or later
    - yarn
- Backend
    - JVM 1.8 or later
- Deployment
    - An AWS account
    - AWS commandline tools
    - An AWS config pointing to an admin account
    - Serverless commandline
    
## Getting started

The frontend and backend are built separately, one using yarn and the other using gradle.
Though the frontend can be built locally, it can't be run until the backend has been built and
deployed. 

To build the app

```$shell
./gradlew buildUi
```

This builds both the front and back ends. To deploy

```$shell
./gradlew deploy
serverless s3sync
```

NOTE: The deploy step does call s3sync automatically. For the initial install though, it is only at the
end of the deployment process that we can capture the configuration properties for the newly created
API Gateway and Cognito authentication setup. The generated config then needs the separate 
`serverless s3sync` step to push the config to s3 which is where the frontend is hosted.

Once the app is deployed, you can run it directly using the DEV url, or run it locally

```$bash
cd ui
yarn run start
```

Once the frontend has been built and the server is running, a browser window will open at the correct URL.