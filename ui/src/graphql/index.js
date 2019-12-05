import gql from "graphql-tag";

export const CREATE_GAME = gql(`
  mutation($userId: String!, $playerType: PlayerType!) {
    createGame(input: { userId: $userId, playerType: $playerType }) {
      id
    }
  }
`);

export const GET_GAME = gql(`
  query($gameId: ID!) {
    getGame(gameId: $gameId) {
      id
      players {
        playerType
        userId
        hand {
          id
          bodyPart
          character
        }
        playState
      }
      discardPile {
        id
      }
    }
  }
`);

export const GAMES_TO_JOIN = gql(`
  query {
    findGamesAwaitingSecondPlayer {
      items {
        id
        players {
          playerType
          userId
          hand {
            id
            bodyPart
            character
          }
          playState
        }
        discardPile {
          id
        }
      }
    }
  }
`);