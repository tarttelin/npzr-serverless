import React, { useState, useEffect, FunctionComponent } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_GAME } from '../graphql';
import { Auth } from "aws-amplify";
import {Game, Player} from "../graphql/model";

interface JoinedGameProps {
  joinedGame: Game;
  playerName?: string;
}

const PlayGame: FunctionComponent<JoinedGameProps> = ({joinedGame, playerName}) => {

  const { loading, data } = useQuery(GET_GAME, { variables: { gameId: joinedGame.id}});
  if (loading || !data || !playerName ) {
    return (<div>loading</div>)
  } else {
    return (<div>Play game {data.getGame.id} with {opponent(playerName, data.getGame).userId}</div>)
  }
};

const opponent = (playerName: string, game: Game): Player => {
  return game.players.filter( p => p.userId !== playerName)[0];
};

export default PlayGame;