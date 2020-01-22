import React, {FunctionComponent, useEffect, useState} from 'react';
import {useMutation, useQuery, useSubscription} from '@apollo/react-hooks';
import {GET_GAME, PLAY_CARD, PLAYED_CARD_SUBSCRIPTION} from '../graphql';
import {Card, Game, Player} from "../graphql/model";
import CardViewModel, {BodyPart, Character} from "../viewmodels/card";
import PlayerViewModel from "../viewmodels/player";
import GameViewModel from "../viewmodels/game";
import GameContainer from "../game-container";
import StackSlot from "../viewmodels/stack-slot";
import {ExecutionResult} from "apollo-link";
import {MutationFunctionOptions} from "@apollo/react-common";
import {PlayState} from "../viewmodels/player";
import {observe} from "rxjs-observe";

interface JoinedGameProps {
    joinedGame: Game;
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
        mutation({variables: {gameId, cardId: card.id, position: BodyPart[slot.position], stackId: slot.parent.id}});
    };
}

function updateModel(game: GameViewModel, gameState: Game, playerName: string) {
    console.log("update model");
    const playerState = gameState.players.find(p => p.userId === playerName)!;
    const opponentState = gameState.players.find(p => p.userId !== playerName)!;

    function syncPlayer(playerState: Player, player: PlayerViewModel) {
        playerState.hand.filter(c => !player.hand.cards.map(card => card.id).includes(c.id))
            .forEach(c => {
                player.hand.addCard(convert(c));
            });
        playerState.stacks.filter(s => !player.stacks.map(stack => stack.id).includes(s.id))
            .forEach(s => {
                player.addStack(s.id);
            });
        playerState.stacks.forEach((stack) => {
            let stackViewModel = player.stacks.find(s => s.id === stack.id)!;
            let cardsToAdd = stack.head.filter(s => !stackViewModel.head.cards.map(svm => svm.id).includes(s.id));
            cardsToAdd.reverse().forEach(c => stackViewModel.head.addCard(convert(c)));
            cardsToAdd = stack.torso.filter(s => !stackViewModel.torso.cards.map(svm => svm.id).includes(s.id));
            cardsToAdd.reverse().forEach(c => stackViewModel.torso.addCard(convert(c)));
            cardsToAdd = stack.legs.filter(s => !stackViewModel.legs.cards.map(svm => svm.id).includes(s.id));
            cardsToAdd.reverse().forEach(c => stackViewModel.legs.addCard(convert(c)));
        });
        player.playState = PlayState[playerState.playState];
    }

    syncPlayer(playerState, game.player);
    syncPlayer(opponentState, game.opponent);
    gameState.discardPile.filter(c => !game.discardPile.cards.map(card => card.id).includes(c.id))
        .reverse()
        .forEach(c => {
            game.discardPile.addCard(convert(c));
        });
}

const cards: CardViewModel[] = [];

function convert(card: Card) {
    let existingCard = cards.find(c => c.id === card.id);
    if (existingCard) return existingCard;
    let character: Character = Character[card.characterType];
    let bodyPart: BodyPart = BodyPart[card.bodyPart];
    let {observables, proxy} = observe(new CardViewModel(character, bodyPart, card.id));
    proxy.observe = observables;
    cards.push(proxy);
    return proxy;
}

const PlayGame: FunctionComponent<JoinedGameProps> = ({joinedGame, playerName}) => {
    const [gameView, setGameView] = useState<GameContainer>();
    const [playCard] = useMutation<PlayCardData, PlayCardVars>(PLAY_CARD);
    const {data: cardPlayedData} = useSubscription<PlayedCardData>(PLAYED_CARD_SUBSCRIPTION,
        {
            variables: {gameId: joinedGame.id}
        });
    const {loading: initialLoad, data: getGameData} = useQuery<GetGameData>(GET_GAME, {variables: {gameId: joinedGame.id}});

    let gameState = cardPlayedData?.playedCard || getGameData?.getGame;

    useEffect(() => {
        let gv = new GameContainer(new GameViewModel(playCardCallback(playCard, joinedGame.id)));
        setGameView(gv);
        document.getElementById("screen")!.focus();
    }, [])
    useEffect(() => {
        if (gameView?.game && gameState && playerName) {
            updateModel(gameView!.game, gameState!, playerName!);
        }
    }, [gameView, gameState, playerName]);

    if (initialLoad || !gameState || !playerName) {
        return (<div>loading</div>)
    } else {
        return (
            <div>{opponent(playerName, gameState).playState !== "Wait" ? "Opponent's turn " : "Your turn to " + currentPlayer(playerName, gameState).playState  + " "}
            [ score {currentPlayer(playerName, gameState).completed.map(c => (<span>{c} </span>))}]</div>)
    }
};

const opponent = (playerName: string, game: Game): Player => {
    return game.players.filter(p => p.userId !== playerName)[0];
};

const currentPlayer = (playerName: string, game: Game): Player => {
    return game.players.filter(p => p.userId === playerName)[0];
};

export default PlayGame;