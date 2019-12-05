import { expect } from 'chai';
import React from 'react';
import { act } from 'react-dom/test-utils';
import enzyme from 'enzyme';
import { MockedProvider } from '@apollo/react-testing';
import JoinGame from "./JoinGame";
import { GAMES_TO_JOIN } from "../graphql";

describe('Games available to join', () => {
  it('Lists games to join', async () => {

    const mocks = [
      {
        request: {
          query: GAMES_TO_JOIN,
          variables: { }
        },
        result() {
          return { data: { findGamesAwaitingSecondPlayer: { items:
                  [{ id: "abc123", players: [{ userId: "Jim", "playerType": "Player", "hand": [], "playState": "Wait" }], discardPile: [], "__typename": "Game" } ,
                  { id: "abc125", players: [{ userId: "Beam", "playerType": "Player", "hand": [], "playState": "Wait" }], discardPile: [], "__typename": "Game" } ]
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
      await apolloCall(container, 100).then(() => {
        expect(container.find('.joinGame')).to.have.lengthOf(2);
      });
    });

  });

  it('Shows no games available when search returns empty list', async () => {
    const mocks = [
      {
        request: {
          query: GAMES_TO_JOIN,
          variables: { }
        },
        result() {
          return { data: { findGamesAwaitingSecondPlayer: { items: [] } } };
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
        expect(container.find('.joinGame')).to.have.lengthOf(0);
        expect(container.find('div').text()).to.equal("No games to join");
      });
    });
  });
});