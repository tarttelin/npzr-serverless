import React, {FunctionComponent, useEffect, useState} from 'react';
import {useMutation, useQuery} from '@apollo/react-hooks';
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
import Hand from "../viewmodels/hand";
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

interface PlayCardVars {
  gameId: string,
  cardId: string,
  stackId: string,
  position: string
}

function playCardCallback(mutation: (options?: MutationFunctionOptions<PlayCardData, PlayCardVars>) => Promise<ExecutionResult<PlayCardData>>, gameId: string) {
  return (card: CardViewModel, slot: StackSlot) => {
    mutation({variables: { gameId, cardId: card.id, position: BodyPart[slot.position], stackId: slot.parent.id}});
  };
}

function updateModel(game: GameViewModel, gameState: Game, playerName: string) {
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
  let { observables, proxy } = observe(new CardViewModel(character, bodyPart, card.id));
  proxy.observe = observables;
  cards.push(proxy);
  return proxy;
}

const PlayGame: FunctionComponent<JoinedGameProps> = ({joinedGame, playerName}) => {
  const [gameView, setGameView] = useState<GameContainer>();
  const [playCard] = useMutation<PlayCardData, PlayCardVars>(PLAY_CARD);
  const { loading, data, subscribeToMore } = useQuery(GET_GAME, { variables: { gameId: joinedGame.id}});
  subscribeToMore({
    document: PLAYED_CARD_SUBSCRIPTION,
    variables: { gameId: joinedGame.id },
    updateQuery: (prev: GetGameData, { subscriptionData }) => {
      if (!prev || !subscriptionData.data || !subscriptionData.data.playedCard) {
        return prev;
      }
      return Object.assign({}, prev, {
        getGame: subscriptionData.data.playedCard
      });
    }
  });

  useEffect(() => {
    if (!gameView) {
      setGameView(new GameContainer(new GameViewModel(playCardCallback(playCard, joinedGame.id))));
      setTimeout(() => {
        if (data?.getGame) {
          console.log("update model");
          updateModel(gameView!.game, data.getGame, playerName!);
          gameView!.loaded()
        }
      }, 5000);
    }
    else if (data?.getGame) {
      console.log("update model");
      updateModel(gameView!.game, data.getGame, playerName!);
    }
  }, [data]);

  if (loading || !data || !playerName ) {
    return (<div>loading</div>)
  } else {
    return (<div id="screen">Play game {data.getGame.id} with {opponent(playerName, data.getGame).userId}</div>)
  }
};

const opponent = (playerName: string, game: Game): Player => {
  return game.players.filter( p => p.userId !== playerName)[0];
};

export default PlayGame;