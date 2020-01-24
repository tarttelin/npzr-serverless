import { expect } from 'chai';
import React from 'react';
import { act } from 'react-dom/test-utils';
import enzyme from 'enzyme';
import { MockedProvider } from '@apollo/react-testing';
import GetGame from "./GetGame";
import { GET_GAME } from "../graphql";

declare let apolloCall: any;

describe('Load a game', () => {
  it('Loads a game by id', async () => {

    const mocks = [
      {
        request: {
          query: GET_GAME,
          variables: { gameId: "5b40a0f8-1864-4677-80d5-db737b17ad65" }
        },
        result() {
          return { data: { getGame: { id: "abc123", players: [], discardPile: [], "__typename": "Game" } } };
        }
      }
    ];

    const container = enzyme.mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <GetGame/>
      </MockedProvider>
    );

    await act(async () => {
      container.find('input').simulate('change', { target: { value: "5b40a0f8-1864-4677-80d5-db737b17ad65" } });

      await apolloCall(container, 100).then(() => {
        expect(container.find('#foundGame').text()).to.equal("game found: abc123");
      });

    });
  });

  it('Does not try to load the game when id is not the length of a UUID', async () => {
    const mocks = [
      {
        request: {
          query: GET_GAME,
          variables: { gameId: "Too short" }
        },
        result() {
          return { data: { getGame: { id: "abc123", players: [], discardPile: [], "__typename": "Game" } } };
        }
      }
    ];

    const container = enzyme.mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <GetGame/>
      </MockedProvider>
    );

    await act(async () => {
      container.find('input').simulate('change', { target: { value: "Too short" } });

      await apolloCall(container, 100).then(() => {
        expect(container.exists('#foundGame')).to.equal(false);
        expect(container.find('div div').text()).to.equal("Search for a game");
      });

    });
  })
});