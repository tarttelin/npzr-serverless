import gql from "graphql-tag";

export const createGame = gql(`
  mutation($userId: String!, $playerType: PlayerType!) {
    createGame(input: { userId: $userId, playerType: $playerType }) {
      id
    }
  }
`);