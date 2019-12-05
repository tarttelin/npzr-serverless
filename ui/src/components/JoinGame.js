import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import {GAMES_TO_JOIN, NEW_GAME_SUBSCRIPTION} from '../graphql';

const JoinGame = () => {
  const { subscribeToMore, loading, data } = useQuery(GAMES_TO_JOIN, { variables: {  } });
  subscribeToMore( {
    document: NEW_GAME_SUBSCRIPTION,
    variables: {  },
    updateQuery: (prev, { subscriptionData }) => {
      if (!prev || !subscriptionData.data || !subscriptionData.data) return prev;
      const newGame = subscriptionData.data.createdGame;

      return Object.assign({}, prev, {
        findGamesAwaitingSecondPlayer: {
          items: [newGame, ...prev.findGamesAwaitingSecondPlayer.items.filter(game => game.id !== newGame.id)],
          __typename: "GameConnection"
        }
      });
    }
  });
  if (loading) {
    return (<div>Loading ...</div>);
  } else if (!data) {
    return (<div>Loaded but still not got data??</div>);
  } else if (data.findGamesAwaitingSecondPlayer && data.findGamesAwaitingSecondPlayer.items && data.findGamesAwaitingSecondPlayer.items.length > 0) {
    return (<div>
      { data.findGamesAwaitingSecondPlayer.items.filter(game => game.players[1].playerType === "Player").map( game => (<div className="joinGame" key={game.id}>Join game: {game.id} -  {game.players[0].userId}</div>)) }
      </div>);
  } else {
    return (<div>No games to join</div>)
  }
};

export default JoinGame;