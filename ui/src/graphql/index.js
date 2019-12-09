import gql from "graphql-tag";

export const CREATE_GAME = gql(`
  mutation($opponent: PlayerType!) {
    createGame(input: { opponent: $opponent }) {
      id
      players {
        playerType
        userId
        hand {
          id
          bodyPart
          characterType
          __typename
        }
        playState
        __typename
      }
      discardPile {
        id
        __typename
      }
      __typename
    }
  }
`);

export const JOIN_GAME = gql(`
  mutation($gameId: ID!) {
    joinGame(input: { gameId: $gameId }) {
      id
      players {
        playerType
        userId
        hand {
          id
          bodyPart
          characterType
          __typename
        }
        playState
        __typename
      }
      discardPile {
        id
        __typename
      }
      __typename
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
          characterType
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
            characterType
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

export const NEW_GAME_SUBSCRIPTION = gql`
    subscription {
        createdGame {
            id
            players {
                playerType
                userId
                hand {
                    id
                    bodyPart
                    characterType
                }
                playState
            }
            discardPile {
                id
            }
        }
    }
`;

export const JOINED_GAME_SUBSCRIPTION = gql`
    subscription {
        joinedGame {
            id
            players {
                playerType
                userId
                hand {
                    id
                    bodyPart
                    characterType
                }
                playState
            }
            discardPile {
                id
            }
        }
    }
`;