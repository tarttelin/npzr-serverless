import { expect } from 'chai';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { Auth } from 'aws-amplify';
import enzyme from 'enzyme';
import { MockedProvider } from '@apollo/react-testing';
import JoinGame from "./JoinGame";
import { GAMES_TO_JOIN, NEW_GAME_SUBSCRIPTION } from "../graphql";
import {ObservableQuery} from "apollo-client";

describe('Games available to join', () => {
  it('Lists games to join', async () => {
    const spy = jest.spyOn(ObservableQuery.prototype, 'subscribeToMore').mockImplementation(() => { /* ... */ });
    const mocks = [
      {
        request: {
          query: GAMES_TO_JOIN,
          variables: { }
        },
        result() {
          return { data: { findGamesAwaitingSecondPlayer: { items:
                  [{ id: "abc123", players: [{ userId: "Jim", "playerType": "Player", "hand": [], "playState": "Wait" },{ userId: null, "playerType": "Player", "hand": [], "playState": "Wait" }], discardPile: [], "__typename": "Game" } ,
                  { id: "abc125", players: [{ userId: "Beam", "playerType": "Player", "hand": [], "playState": "Wait" },{ userId: null, "playerType": "Player", "hand": [], "playState": "Wait" }], discardPile: [], "__typename": "Game" } ]
          } } };
        }
      }
    ];

    const container = enzyme.mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <JoinGame/>
      </MockedProvider>
    );
    await act(async () => {
      await apolloCall(container, 10).then(() => {
        spy.mockReset();
        expect(container.find('.joinGame')).to.have.lengthOf(2);
      });
    });

  });

  it('Shows no games available when search returns empty list', async () => {
    const spy = jest.spyOn(ObservableQuery.prototype, 'subscribeToMore').mockImplementation(() => { /* ... */ });
    const mocks = [
      {
        request: {
          query: GAMES_TO_JOIN,
          variables: { }
        },
        result() {
          return { data: { findGamesAwaitingSecondPlayer: { items: [] } }, subscribeToMore: () => {} };
        }
      }
    ];

    const container = enzyme.mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <JoinGame/>
      </MockedProvider>
    );
    await act(async () => {
      await apolloCall(container, 10).then(() => {
        spy.mockReset();
        expect(container.find('.joinGame')).to.have.lengthOf(0);
        expect(container.find('div').text()).to.equal("No games to join");
      });
    });
  });

  it('Adds new games to the games to join', async () => {
    const initialGames = { findGamesAwaitingSecondPlayer: { items:
          [{ id: "abc123", players: [{ userId: "Jim", "playerType": "Player", "hand": [], "playState": "Wait" },{ userId: null, "playerType": "Player", "hand": [], "playState": "Wait" }], discardPile: [], "__typename": "Game" } ,
            { id: "abc125", players: [{ userId: "Beam", "playerType": "Player", "hand": [], "playState": "Wait" },{ userId: null, "playerType": "Player", "hand": [], "playState": "Wait" }], discardPile: [], "__typename": "Game" } ]
      } };
    let mergedGames = { };
    const spy = jest.spyOn(ObservableQuery.prototype, 'subscribeToMore').mockImplementation(({updateQuery}) => {
      mergedGames = updateQuery(initialGames, {subscriptionData: { data: { createdGame:
      { id: "abc127", players: [{ userId: "Henderson", "playerType": "Player", "hand": [], "playState": "Wait" },{ userId: null, "playerType": "Player", "hand": [], "playState": "Wait" }], discardPile: [], "__typename": "Game" }
            }}});
      return mergedGames;
    });
    const mocks = [
      {
        request: {
          query: GAMES_TO_JOIN,
          variables: { }
        },
        result() {
          return { data: initialGames };
        }
      }
    ];

    const container = enzyme.mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <JoinGame/>
      </MockedProvider>
    );
    await act(async () => {
      await apolloCall(container, 10).then(() => {
        spy.mockReset();
        expect(mergedGames.findGamesAwaitingSecondPlayer.items.length).to.equal(3);
      });
    });

  });

  it('Ignores new games that have the same ID as known games', async () => {
    const initialGames = { findGamesAwaitingSecondPlayer: { items:
          [{ id: "abc123", players: [{ userId: "Jim", "playerType": "Player", "hand": [], "playState": "Wait" },{ userId: null, "playerType": "Player", "hand": [], "playState": "Wait" }], discardPile: [], "__typename": "Game" } ,
            { id: "abc125", players: [{ userId: "Beam", "playerType": "Player", "hand": [], "playState": "Wait" },{ userId: null, "playerType": "Player", "hand": [], "playState": "Wait" }], discardPile: [], "__typename": "Game" } ]
      } };
    let mergedGames = { };
    const spy = jest.spyOn(ObservableQuery.prototype, 'subscribeToMore').mockImplementation(async ({updateQuery}) => {
      mergedGames = await updateQuery(initialGames, {subscriptionData: { data: { createdGame:
      { id: "abc125", players: [{ userId: "Henderson", "playerType": "Player", "hand": [], "playState": "Wait" },{ userId: null, "playerType": "Player", "hand": [], "playState": "Wait" }], discardPile: [], "__typename": "Game" }
            }}});
      return mergedGames;
    });
    const mocks = [
      {
        request: {
          query: GAMES_TO_JOIN,
          variables: { }
        },
        result() {
          return { data: initialGames };
        }
      }
    ];

    const container = enzyme.mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <JoinGame/>
      </MockedProvider>
    );
    await act(async () => {
      await apolloCall(container, 10).then(() => {
        spy.mockReset();
        expect(mergedGames.findGamesAwaitingSecondPlayer.items.length).to.equal(2);
      });
    });

  });

  it('Removes games that have been joined by someone else', async () => {
    const initialGames = { findGamesAwaitingSecondPlayer: { items:
          [{ id: "abc123", players: [{ userId: "Jim", "playerType": "Player", "hand": [], "playState": "Wait" },{ userId: null, "playerType": "Player", "hand": [], "playState": "Wait" }], discardPile: [], "__typename": "Game" } ,
            { id: "abc125", players: [{ userId: "Beam", "playerType": "Player", "hand": [], "playState": "Wait" },{ userId: null, "playerType": "Player", "hand": [], "playState": "Wait" }], discardPile: [], "__typename": "Game" } ]
      } };
    let mergedGames = { };
    const authSpy = jest.spyOn(Auth, "currentUserInfo").mockResolvedValue({username: "George"});
    const spy = jest.spyOn(ObservableQuery.prototype, 'subscribeToMore').mockImplementation(async ({updateQuery}) => {
      mergedGames = await updateQuery(initialGames, {subscriptionData: { data: { joinedGame:
      { id: "abc125", players: [{ userId: "Henderson", "playerType": "Player", "hand": [], "playState": "Wait" },{ userId: null, "playerType": "Player", "hand": [], "playState": "Wait" }], discardPile: [], "__typename": "Game" }
            }}});
      return mergedGames;
    });
    const mocks = [
      {
        request: {
          query: GAMES_TO_JOIN,
          variables: { }
        },
        result() {
          return { data: initialGames };
        }
      }
    ];

    const container = enzyme.mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <JoinGame/>
      </MockedProvider>
    );
    await act(async () => {
      await apolloCall(container, 100).then(() => {
        spy.mockReset();
        authSpy.mockReset();
        expect(mergedGames.findGamesAwaitingSecondPlayer.items.length).to.equal(1);
      });
    });

  });

  it('Calls the playGame callback when a players game is joined by someone else', async () => {
    const initialGames = { findGamesAwaitingSecondPlayer: { items:
          [{ id: "abc123", players: [{ userId: "Jim", "playerType": "Player", "hand": [], "playState": "Wait" },{ userId: null, "playerType": "Player", "hand": [], "playState": "Wait" }], discardPile: [], "__typename": "Game" } ,
            { id: "abc125", players: [{ userId: "Beam", "playerType": "Player", "hand": [], "playState": "Wait" },{ userId: null, "playerType": "Player", "hand": [], "playState": "Wait" }], discardPile: [], "__typename": "Game" } ]
      } };
    let mergedGames = { };
    const authSpy = jest.spyOn(Auth, "currentUserInfo").mockResolvedValue({username: "Beam"});
    const callback = jest.fn();
    const spy = jest.spyOn(ObservableQuery.prototype, 'subscribeToMore').mockImplementation(async ({updateQuery}) => {
      mergedGames = await updateQuery(initialGames, {subscriptionData: { data: { joinedGame:
      { id: "abc125", players: [{ userId: "Beam", "playerType": "Player", "hand": [], "playState": "Wait" },{ userId: "Jim", "playerType": "Player", "hand": [], "playState": "Wait" }], discardPile: [], "__typename": "Game" }
            }}});
      return mergedGames;
    });
    const mocks = [
      {
        request: {
          query: GAMES_TO_JOIN,
          variables: { }
        },
        result() {
          return { data: initialGames };
        }
      }
    ];

    const container = enzyme.mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <JoinGame playGame={callback}/>
      </MockedProvider>
    );
    await act(async () => {
      await apolloCall(container, 10).then(() => {
        spy.mockReset();
        authSpy.mockReset();
        expect(mergedGames.findGamesAwaitingSecondPlayer.items.length).to.equal(1);
        expect(callback.mock.calls.length).is.greaterThan(0);
      });
    });

  });
});