import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import {GAMES_TO_JOIN} from '../graphql';

const JoinGame = () => {
  const { loading, data } = useQuery(GAMES_TO_JOIN, { variables: {  } });
  if (loading) {
    return (<div>Loading ...</div>);
  } else if (!data) {
    return (<div>Loaded but still not got data??</div>);
  } else if (data.findGamesAwaitingSecondPlayer && data.findGamesAwaitingSecondPlayer.items && data.findGamesAwaitingSecondPlayer.items.length > 0) {
    return (<div>
      { data.findGamesAwaitingSecondPlayer.items.map( game => (<div className="joinGame" key={game.id}>Join game: {game.id} -  {game.players[0].userId}</div>)) }
      </div>);
  } else {
    return (<div>No games to join</div>)
  }
};

export default JoinGame;