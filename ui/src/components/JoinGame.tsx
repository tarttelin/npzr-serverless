import React, {FunctionComponent, useState} from 'react';
import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import {GAMES_TO_JOIN, NEW_GAME_SUBSCRIPTION, JOIN_GAME, JOINED_GAME_SUBSCRIPTION} from '../graphql';
import {Game} from "../graphql/model";
import { Redirect } from 'react-router-dom';
import {Button} from "@material-ui/core";

interface JoinGameProps {
  playerName?: string;
}

interface GameResults {
  items: [Game];
}
interface JoinGameData {
  findGamesAwaitingSecondPlayer?: GameResults;
}

interface JoinedGameData {
  joinedGame: Game;
}

type CreatedGameType = {
  createdGame: Game;
}

const JoinGame: FunctionComponent<JoinGameProps> = ({ playerName }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [currentGame, playGame] = useState<Game>();
  const { loading, data: gameList } = useQuery<JoinGameData>(GAMES_TO_JOIN);
  useSubscription<JoinedGameData>(JOINED_GAME_SUBSCRIPTION,
      { onSubscriptionData: ({subscriptionData}) => {
        if (subscriptionData?.data?.joinedGame && games.find( game => game.id === subscriptionData.data?.joinedGame.id)) {
          let gameJoined = subscriptionData.data.joinedGame;
          setGames(games.filter(g => g.id !== gameJoined.id));
          if (gameJoined.players.find(p => p.userId === playerName)) {
            playGame(gameJoined);
          }
        }
        }});
  useSubscription<CreatedGameType>(NEW_GAME_SUBSCRIPTION, {
    onSubscriptionData: ({subscriptionData}) => {
      if (subscriptionData.data?.createdGame && !games.find(game => game.id === subscriptionData.data?.createdGame.id)) {
        setGames([subscriptionData.data.createdGame, ...games]);
      }
    }
  });

  if (loading || !gameList) {
    return (<div>Loading ...</div>);
  } else if (games.length === 0 && gameList.findGamesAwaitingSecondPlayer && gameList.findGamesAwaitingSecondPlayer.items && gameList.findGamesAwaitingSecondPlayer.items.length > 0) {
    setGames(gameList.findGamesAwaitingSecondPlayer.items);
  }

  if (currentGame) {
    return (<Redirect to={`/game/${currentGame.id}`}/>)
  } else {
    return <ShowGames games={games} playerName={playerName}/>
  }
};

interface ShowGameProps extends JoinGameProps {
  games: Game[];
  playerName: string | undefined;
}

const ShowGames: FunctionComponent<ShowGameProps> = ({games, playerName }) => {
  const [joinGame, { loading }] = useMutation(JOIN_GAME);
  return (
    <div>
      { games.filter( g => g.players[0].userId !== playerName).map(game => {
        return (<div className="joinGame" key={game.id}>Join game: { loading ? (<span> ...</span>) : (<Button variant="contained" onClick={() => {
          joinGame({
            variables: { gameId: game.id }
          });
        }}>{game.id} -  {game.players[0].userId}</Button>)}</div>)
      })}
    </div>);
};

export default JoinGame;