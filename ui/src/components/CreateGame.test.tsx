import { expect } from 'chai';
import React from 'react';
import { act } from 'react-dom/test-utils';
import enzyme from 'enzyme';
import { MockedProvider } from '@apollo/react-testing';
import CreateGame from "./CreateGame";
import { CREATE_GAME } from "../graphql";
import {gameInProgress} from "../__fixtures__/games";
import { Redirect, MemoryRouter } from 'react-router-dom';

declare let apolloCall: any;

describe('Create a new game', () => {
  it('calls the createGame mutation', async () => {
    let mutationCalled = false;
    const expectedGame = gameInProgress;

    const mocks = [
      {
        request: {
          query: CREATE_GAME,
          variables: { opponent: 'Player' }
        },
        result() {
          mutationCalled = true;
          return { data: { createGame: expectedGame } };
        }
      }
    ];

    const container = enzyme.mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CreateGame/>
      </MockedProvider>
    );

    expect(container.exists("#createdResult")).to.equal(false);

    await act(async () => {
      container.find('button').at(0).simulate('click');

      await apolloCall(container).then(() => {
        expect(mutationCalled).to.equal(true);
        expect(container.find('#createdResult').text()).to.equal("game created: abc123");
      });

    });
  });

  it('Redirects to play game when choosing NPC opponent', async () => {
    const expectedGame = gameInProgress;
    expectedGame.players[1].playerType = "AI";

    const mocks = [
      {
        request: {
          query: CREATE_GAME,
          variables: { opponent: 'AI' }
        },
        result() {
          return { data: { createGame: expectedGame } };
        }
      }
    ];

    const container = enzyme.mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <CreateGame/>
        </MemoryRouter>
      </MockedProvider>
    );

    expect(container.exists("#createdResult")).to.equal(false);

    await act(async () => {
      container.find('button').at(1).simulate('click');

      await apolloCall(container).then(() => {
        expect(container.find(Redirect).prop("to")).to.equal("/game/" + expectedGame.id);
      });

    });
  });
});