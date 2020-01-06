import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_GAME } from '../graphql';
import { Auth } from "aws-amplify";

const PlayGame = ({joinedGame}) => {
  const [playerName, setPlayerName] = useState(undefined);
  useEffect(() => {
    if (!playerName) {
      getUsername();
    }
  }, [playerName]);
  const getUsername = async () => {
    let name = (await Auth.currentUserInfo()).username;
    setPlayerName(name);
  };
  const { loading, data } = useQuery(GET_GAME, { variables: { gameId: joinedGame.id}});
  if (loading || !data || !playerName ) {
    return (<div>loading</div>)
  } else {
    return (<div>Play game {data.getGame.id} with {opponent(playerName, data.getGame).userId}</div>)
  }
};

const opponent = (playerName, game) => {
  if (playerName && game) {
    return game.players.filter( p => p.userId !== playerName)[0];
  }
  return "Loading"
}

export default PlayGame;