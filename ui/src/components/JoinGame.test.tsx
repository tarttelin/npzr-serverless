import { expect } from 'chai';
import React from 'react';
import { act } from 'react-dom/test-utils';
import enzyme from 'enzyme';
import { MockedProvider } from '@apollo/react-testing';
import JoinGame from "./JoinGame";
import { GAMES_TO_JOIN } from "../graphql";
import {ObservableQuery} from "apollo-client";

declare let apolloCall: any;

describe('Games available to join', () => {
  it('Lists games to join', async () => {
    const spy = jest.spyOn(ObservableQuery.prototype, 'subscribeToMore').mockImplementation(() => { return () => {} });
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
        <JoinGame playerName="George"/>
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
    const spy = jest.spyOn(ObservableQuery.prototype, 'subscribeToMore').mockImplementation(() => { return () => {} });
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
        <JoinGame playerName="George"/>
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
    let gamesToJoin = { findGamesAwaitingSecondPlayer: { items:
          [{ id: "abc123", players: [{ userId: "Jim", "playerType": "Player", "hand": [], "playState": "Wait" },{ userId: null, "playerType": "Player", "hand": [], "playState": "Wait" }], discardPile: [], "__typename": "Game" } ,
            { id: "abc125", players: [{ userId: "Beam", "playerType": "Player", "hand": [], "playState": "Wait" },{ userId: null, "playerType": "Player", "hand": [], "playState": "Wait" }], discardPile: [], "__typename": "Game" } ]
      } };

    const spy = jest.spyOn(ObservableQuery.prototype, 'subscribeToMore').mockImplementation(({updateQuery}) => {
      if (!updateQuery) return () => {};
      gamesToJoin = updateQuery(gamesToJoin, {subscriptionData: { data: { createdGame:
      { id: "abc127", players: [{ userId: "Henderson", "playerType": "Player", "hand": [], "playState": "Wait" },{ userId: null, "playerType": "Player", "hand": [], "playState": "Wait" }], discardPile: [], "__typename": "Game" }
            }}});
      return () => {};
    });
    const mocks = [
      {
        request: {
          query: GAMES_TO_JOIN,
          variables: { }
        },
        result() {
          return { data: gamesToJoin };
        }
      }
    ];

    const container = enzyme.mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <JoinGame playerName="George"/>
      </MockedProvider>
    );
    await act(async () => {
      await apolloCall(container, 10).then(() => {
        expect(gamesToJoin.findGamesAwaitingSecondPlayer.items.length).to.equal(3);
      }).finally(() => {
        spy.mockReset();
      });
    });

  });

  it('Ignores new games that have the same ID as known games', async () => {
    let gamesToJoin = { findGamesAwaitingSecondPlayer: { items:
          [{ id: "abc123", players: [{ userId: "Jim", "playerType": "Player", "hand": [], "playState": "Wait" },{ userId: null, "playerType": "Player", "hand": [], "playState": "Wait" }], discardPile: [], "__typename": "Game" } ,
            { id: "abc125", players: [{ userId: "Beam", "playerType": "Player", "hand": [], "playState": "Wait" },{ userId: null, "playerType": "Player", "hand": [], "playState": "Wait" }], discardPile: [], "__typename": "Game" } ]
      } };
    const spy = jest.spyOn(ObservableQuery.prototype, 'subscribeToMore').mockImplementation( ({updateQuery}) => {
      if (!updateQuery) return () => {};
      gamesToJoin = updateQuery(gamesToJoin, {subscriptionData: { data: { createdGame:
      { id: "abc125", players: [{ userId: "Henderson", "playerType": "Player", "hand": [], "playState": "Wait" },{ userId: null, "playerType": "Player", "hand": [], "playState": "Wait" }], discardPile: [], "__typename": "Game" }
            }}});
      return () => {};
    });
    const mocks = [
      {
        request: {
          query: GAMES_TO_JOIN,
          variables: { }
        },
        result() {
          return { data: gamesToJoin };
        }
      }
    ];

    const container = enzyme.mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <JoinGame playerName="George"/>
      </MockedProvider>
    );
    await act(async () => {
      await apolloCall(container, 10).then(() => {
        spy.mockReset();
        expect(gamesToJoin.findGamesAwaitingSecondPlayer.items.length).to.equal(2);
      });
    });

  });

  it('Removes games that have been joined by someone else', async () => {
    let gamesToJoin = { findGamesAwaitingSecondPlayer: { items:
          [{ id: "abc12", players: [{ userId: "Jim", "playerType": "Player", "hand": [], "playState": "Wait" },{ userId: null, "playerType": "Player", "hand": [], "playState": "Wait" }], discardPile: [], "__typename": "Game" } ,
            { id: "abc15", players: [{ userId: "Beam", "playerType": "Player", "hand": [], "playState": "Wait" },{ userId: null, "playerType": "Player", "hand": [], "playState": "Wait" }], discardPile: [], "__typename": "Game" } ]
      } };
    const spy = jest.spyOn(ObservableQuery.prototype, 'subscribeToMore').mockImplementation(({updateQuery}) => {
      if (!updateQuery) return () => {};
      gamesToJoin = updateQuery(gamesToJoin, {subscriptionData: { data: { joinedGame:
      { id: "abc15", players: [{ userId: "Henderson", "playerType": "Player", "hand": [], "playState": "Wait" },{ userId: null, "playerType": "Player", "hand": [], "playState": "Wait" }], discardPile: [], "__typename": "Game" }
            }}});
      return () => {};
    });
    const mocks = [
      {
        request: {
          query: GAMES_TO_JOIN,
          variables: { }
        },
        result() {
          return { data: gamesToJoin };
        }
      }
    ];

    const container = enzyme.mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <JoinGame playerName="George"/>
      </MockedProvider>
    );
    await act(async () => {
      await apolloCall(container, 10).then(() => {
        spy.mockReset();
        expect(gamesToJoin.findGamesAwaitingSecondPlayer.items.length).to.equal(1);
      });
    });

  });

  it('Calls the playGame callback when a players game is joined by someone else', async () => {
    let gamesToJoin = { findGamesAwaitingSecondPlayer: { items:
          [{ id: "abc123", players: [{ userId: "Jim", "playerType": "Player", "hand": [], "playState": "Wait" },{ userId: null, "playerType": "Player", "hand": [], "playState": "Wait" }], discardPile: [], "__typename": "Game" } ,
            { id: "abc125", players: [{ userId: "Beam", "playerType": "Player", "hand": [], "playState": "Wait" },{ userId: null, "playerType": "Player", "hand": [], "playState": "Wait" }], discardPile: [], "__typename": "Game" } ]
      } };
    const callback = jest.fn();
    const spy = jest.spyOn(ObservableQuery.prototype, 'subscribeToMore').mockImplementation(({updateQuery}) => {
      if (!updateQuery) return () => {};
      gamesToJoin = updateQuery(gamesToJoin, {subscriptionData: { data: { joinedGame:
      { id: "abc125", players: [{ userId: "Beam", "playerType": "Player", "hand": [], "playState": "Wait" },{ userId: "Jim", "playerType": "Player", "hand": [], "playState": "Wait" }], discardPile: [], "__typename": "Game" }
            }}});
      return () => {};
    });
    const mocks = [
      {
        request: {
          query: GAMES_TO_JOIN,
          variables: { }
        },
        result() {
          return { data: gamesToJoin };
        }
      }
    ];

    const container = enzyme.mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <JoinGame playerName="Beam"/>
      </MockedProvider>
    );
    await act(async () => {
      await apolloCall(container, 10).then(() => {
        spy.mockReset();
        expect(gamesToJoin.findGamesAwaitingSecondPlayer.items.length).to.equal(1);
        expect(callback.mock.calls.length).is.greaterThan(0);
      });
    });

  });
});