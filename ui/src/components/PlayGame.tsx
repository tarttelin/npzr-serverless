import React, {FunctionComponent, useState} from 'react';
import {RouteComponentProps} from "react-router";
import {useMutation, useQuery, useSubscription} from '@apollo/react-hooks';
import {GET_GAME, PLAY_CARD, PLAYED_CARD_SUBSCRIPTION} from '../graphql';
import {Game} from "../graphql/model";
import CardViewModel, {BodyPart} from "../viewmodels/card";
import GameViewModel from "../viewmodels/game";
import StackSlot from "../viewmodels/stack-slot";
import {ExecutionResult} from "apollo-link";
import {MutationFunctionOptions} from "@apollo/react-common";
import authClient from "../auth";
import PlayGameComponent from "./PlayGameComponent";

type GameIdType = { id: string };

interface PlayGameProps extends RouteComponentProps<GameIdType> {
    playerName?: string;
}

interface GetGameData {
    getGame: Game;
}

interface PlayCardData {
    playCard: Game;
}

interface PlayedCardData {
    playedCard: Game;
}

interface PlayCardVars {
    gameId: string,
    cardId: string,
    stackId: string,
    position: string
}

function playCardCallback(mutation: (options?: MutationFunctionOptions<PlayCardData, PlayCardVars>) => Promise<ExecutionResult<PlayCardData>>, gameId: string) {
    return (card: CardViewModel, slot: StackSlot) => {
        let parent = card.parent;
        mutation({
            variables: {
                gameId,
                cardId: card.id,
                position: BodyPart[slot.position],
                stackId: slot.parent.id
            }
        }).catch(() => {
            parent?.addCard(card);
        });
    };
}


const PlayGame: FunctionComponent<PlayGameProps> = ({match, playerName}) => {
    const [playCard, {error: mutationError}] = useMutation<PlayCardData, PlayCardVars>(PLAY_CARD);
    const {data: cardPlayedData} = useSubscription<PlayedCardData>(PLAYED_CARD_SUBSCRIPTION,
        {
            variables: {gameId: match.params.id},
            client: authClient("playedCard")
        });
    const [gameView] = useState<GameViewModel>(new GameViewModel(playCardCallback(playCard, match.params.id)));
    const {loading: initialLoad, data: getGameData} = useQuery<GetGameData>(GET_GAME, {variables: {gameId: match.params.id}});

    let gameState = cardPlayedData?.playedCard || getGameData?.getGame;
    return (
        <>
            {(initialLoad || !gameState || !playerName) ? (<div>Loading</div>) : (
                <PlayGameComponent gameState={gameState} game={gameView} playerName={playerName}
                                   errorMessage={mutationError?.message}/>
            )}
        </>
    );
};


export default PlayGame;