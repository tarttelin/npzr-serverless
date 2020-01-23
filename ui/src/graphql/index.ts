import gql from "graphql-tag";

export const CREATE_GAME = gql`
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
`;

export const JOIN_GAME = gql`
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
        stacks {
            id
            head {
                id
                bodyPart
                characterType
                __typename
            }
            torso {
                id
                bodyPart
                characterType
                __typename
            }
            legs {
                id
                bodyPart
                characterType
                __typename
            }
        }
        playState
        __typename
      }
      discardPile {
        id
        bodyPart
        characterType
        __typename
      }
      __typename
    }
  }
`;

export const PLAY_CARD = gql`
    mutation($gameId: ID!, $cardId: ID!, $stackId: ID!, $position: BodyPartType!) {
        playCard(input: {gameId: $gameId, cardId: $cardId, stackId: $stackId, position: $position}) {
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
                completed
                stacks {
                    id
                    head {
                        id
                        bodyPart
                        characterType
                        __typename
                    }
                    torso {
                        id
                        bodyPart
                        characterType
                        __typename
                    }
                    legs {
                        id
                        bodyPart
                        characterType
                        __typename
                    }
                }
                playState
                __typename
            }
            discardPile {
                id
                bodyPart
                characterType
                __typename
            }
            __typename
        }
    }
`;

export const GET_GAME = gql`
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
                __typename
            }
            completed
            stacks {
                id
                head {
                    id
                    bodyPart
                    characterType
                    __typename
                }
                torso {
                    id
                    bodyPart
                    characterType
                    __typename
                }
                legs {
                    id
                    bodyPart
                    characterType
                    __typename
                }
            }
            playState
            __typename
        }
        discardPile {
            id
            bodyPart
            characterType
            __typename
        }
        __typename
    }
  }
`;

export const GAMES_TO_JOIN = gql`
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
`;

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

export const PLAYED_CARD_SUBSCRIPTION = gql`
    subscription($gameId: ID) {
        playedCard(id: $gameId) {
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
                completed
                stacks {
                    id
                    head {
                        id
                        bodyPart
                        characterType
                        __typename
                    }
                    torso {
                        id
                        bodyPart
                        characterType
                        __typename
                    }
                    legs {
                        id
                        bodyPart
                        characterType
                        __typename
                    }
                }
                playState
                __typename
            }
            discardPile {
                id
                bodyPart
                characterType
                __typename
            }
            __typename
        }
    }
`;