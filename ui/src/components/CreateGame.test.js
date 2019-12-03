import { expect } from 'chai';
import React from 'react';
import { act } from 'react-dom/test-utils';
import enzyme from 'enzyme';
import { MockedProvider } from '@apollo/react-testing';
import CreateGame from "./CreateGame";
import { createGame } from "../graphql";

describe('Create a new game', () => {
  it('calls the createGame mutation', async () => {
    let mutationCalled = false;

    const mocks = [
      {
        request: {
          query: createGame,
          variables: { userId: "chris", playerType: "Player" }
        },
        result() {
          mutationCalled = true;
          return { data: { createGame: { id: "abc123" } } };
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
      container.find('button').simulate('click');

      await apolloCall(container).then(() => {
        expect(mutationCalled).to.equal(true);
        expect(container.find('#createdResult').text()).to.equal("game created: abc123");
      });

    });
  });
});