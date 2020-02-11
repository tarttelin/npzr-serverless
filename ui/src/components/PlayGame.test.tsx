import React from 'react';
import enzyme from 'enzyme';
import {MockedProvider} from '@apollo/react-testing';
import PlayGame from "./PlayGame";
import {GET_GAME, PLAY_CARD, PLAYED_CARD_SUBSCRIPTION} from "../graphql";
import GameContainer from "../game-container";
import {act} from "react-dom/test-utils";
import {gameInProgress} from "../__fixtures__/games";
import PlayGameComponent from "./PlayGameComponent";

jest.mock('../game-container');
jest.mock('../screens/play');
jest.mock('../auth');
declare let apolloCall: any;

describe("Play game", () => {
    beforeEach(() => {
        GameContainer.mockClear();
    });

    it("Loads the game and constructs the game container", async () => {
        const expectedGame = gameInProgress;
        const mocks = [{
            request: {
                query: GET_GAME,
                variables: { gameId: expectedGame.id }
            },
            result: {
                data: {getGame: expectedGame}
            }
        }, {
            request: {
                query: PLAYED_CARD_SUBSCRIPTION,
                variables: { gameId: expectedGame.id}
            },
            result: {

            }
        }
        ];
        let container = enzyme.mount(
            <MockedProvider mocks={mocks} addTypename={false}>
                <PlayGame playerName="George" match={{params: {id: expectedGame.id}}}/>
            </MockedProvider>);
        await act(async () => {
            await apolloCall(container, 10).then(() => {
                expect(GameContainer).toHaveBeenCalled();
                const game = container.find(PlayGameComponent).at(0).prop("game")
                expect(game.playCard).not.toBeNull()
            });
        });
    });

    it("Calls playCard mutation from game view model, returning error message from server", async () => {
        const expectedGame = gameInProgress;
        const mocks = [{
            request: {
                query: GET_GAME,
                variables: { gameId: expectedGame.id }
            },
            result: {
                data: {getGame: expectedGame}
            }
        }, {
            request: {
                query: PLAYED_CARD_SUBSCRIPTION,
                variables: { gameId: expectedGame.id}
            },
            result: {

            }
        }, {
            request: {
                query: PLAY_CARD,
                variables: { gameId: expectedGame.id, cardId: "card7", stackId: "stack3", position: "Head" }
            },
            result: () => {
                return { errors: [ new Error( "illegal play") ]};
            }
        }
        ];
        let container = enzyme.mount(
            <MockedProvider mocks={mocks} addTypename={false}>
                <PlayGame playerName="George" match={{params: {id: expectedGame.id}}}/>
            </MockedProvider>);
        await act(async () => {
            await apolloCall(container, 10).then(async () => {
                const game = container.find(PlayGameComponent).at(0).prop("game");
                console.log(`game ${game.player.hand.cards[0].id} stack ${game.player.stacks[0].id}`)
                game.playCard(game.player.hand.cards[0], game.player.stacks[0].head);
                await apolloCall(container, 10).then(() => {
                    expect(container.find(PlayGameComponent).at(0).prop("errorMessage")).toEqual("GraphQL error: illegal play");
                });
            });
        });
    });
});