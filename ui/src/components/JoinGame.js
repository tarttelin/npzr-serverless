import React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Auth } from 'aws-amplify';
import {GAMES_TO_JOIN, NEW_GAME_SUBSCRIPTION, JOIN_GAME, JOINED_GAME_SUBSCRIPTION} from '../graphql';

const JoinGame = ({ playGame }) => {
  const { subscribeToMore, loading, data } = useQuery(GAMES_TO_JOIN, { variables: {  } });

  subscribeToJoinedGames(subscribeToMore, playGame);
  subscribeToNewGames(subscribeToMore);

  if (loading) {
    return (<div>Loading ...</div>);
  } else if (!data) {
    return (<div>Loaded but still not got data??</div>);
  } else if (data.findGamesAwaitingSecondPlayer && data.findGamesAwaitingSecondPlayer.items && data.findGamesAwaitingSecondPlayer.items.length > 0) {
    return (<div>
      { data.findGamesAwaitingSecondPlayer.items.filter(game => game.players[1].playerType === "Player" && game.players[1].userId === null).map( game => <ShowGame key={game.id} game={game} playGame={playGame}/>) }
      </div>);
  } else {
    return (<div>No games to join</div>)
  }
};

const ShowGame = ({game, playGame }) => {
  console.log("game " + game.id);
  const [joinGame] = useMutation(JOIN_GAME,
    {
      variables: { gameId: game.id },
      onCompleted: ({ joinGame : jg }) => {
        playGame(jg);
      }
    });
  return (<div className="joinGame">Join game: <a href="#" onClick={() => {
    joinGame();
  }}>{game.id} -  {game.players[0].userId}</a></div>)
};

const subscribeToNewGames = (subscribeToMore) => {
  subscribeToMore({
    document: NEW_GAME_SUBSCRIPTION,
    variables: {},
    updateQuery: (prev, {subscriptionData}) => {
      if (!prev || !subscriptionData.data || !subscriptionData.data.createdGame) return prev;
      const newGame = subscriptionData.data.createdGame;
      return Object.assign({}, prev, {
        findGamesAwaitingSecondPlayer: {
          items: [newGame, ...prev.findGamesAwaitingSecondPlayer.items.filter(game => game.id !== newGame.id)],
          __typename: "GameConnection"
        }
      });
    }
  });
};

const subscribeToJoinedGames = (subscribeToMore, playGame) => {
  subscribeToMore({
    document: JOINED_GAME_SUBSCRIPTION,
    variables: {},
    updateQuery: async (prev, {subscriptionData}) => {
      if (!prev || !subscriptionData.data || !subscriptionData.data.joinedGame) return prev;
      const joinedGame = subscriptionData.data.joinedGame;

      const filteredList =  Object.assign({}, prev, {
        findGamesAwaitingSecondPlayer: {
          items: [...prev.findGamesAwaitingSecondPlayer.items.filter(game => game.id !== joinedGame.id)],
          __typename: "GameConnection"
        }
      });
      if (filteredList.findGamesAwaitingSecondPlayer.items.length < prev.findGamesAwaitingSecondPlayer.items.length) {
        if (joinedGame.players[0].userId === (await Auth.currentUserInfo()).username) {
          playGame(joinedGame);
        }
      }
      return filteredList;
    }
  });
};

export default JoinGame;