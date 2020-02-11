import { expect } from 'chai';
import React from 'react';
import { act } from 'react-dom/test-utils';
import enzyme from 'enzyme';
import { MockedProvider } from '@apollo/react-testing';
import JoinGame from "./JoinGame";
import { GAMES_TO_JOIN, JOINED_GAME_SUBSCRIPTION, NEW_GAME_SUBSCRIPTION, JOIN_GAME } from "../graphql";
import {gamesToJoin} from "../__fixtures__/games";

declare let apolloCall: any;

describe('Games available to join', () => {
  it('Lists games to join', async () => {
    const mocks = [
      {
        request: {
          query: GAMES_TO_JOIN,
          variables: { }
        },
        result() {
          return { data: gamesToJoin };
        }
      },
      {
        request: {
          query: JOINED_GAME_SUBSCRIPTION,
          variables: {}
        },
        result() {
          return { subscriptionData: {}}
        }
      },
      {
        request: {
          query: NEW_GAME_SUBSCRIPTION,
          variables: {}
        },
        result() {
          return { subscriptionData: {}}
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
        expect(container.find('.joinGame')).to.have.lengthOf(2);
      });
    });

  });
  it('Joining a game calls the join game mutation', async () => {
    let joinGameCalled = false;
    const mocks = [
      {
        request: {
          query: GAMES_TO_JOIN,
          variables: { }
        },
        result() {
          return { data: gamesToJoin };
        }
      },
      {
        request: {
          query: JOINED_GAME_SUBSCRIPTION,
          variables: {}
        },
        result() {
          return { subscriptionData: {}}
        }
      },
      {
        request: {
          query: NEW_GAME_SUBSCRIPTION,
          variables: {}
        },
        result() {
          return { subscriptionData: {}}
        }
      },
      {
        request: {
          query: JOIN_GAME,
          variables: { gameId: "abc123" }
        },
        result() {
          joinGameCalled = true;
          return {
            data: {
              joinGame: {
                id: "abc123"
              }
            }
          }

        }
      }
    ];

    const container = enzyme.mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <JoinGame playerName="George"/>
      </MockedProvider>
    );
    await act(async () => {
      await apolloCall(container, 10).then(async () => {
        container.find('.joinGame button').at(0).simulate('click');
        await apolloCall(container, 10).then( () => {
          expect(joinGameCalled).to.be.true
        })
      });
    });
  });

});