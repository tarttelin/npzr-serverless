import React, {FunctionComponent, useState} from 'react';
import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import {GAMES_TO_JOIN, NEW_GAME_SUBSCRIPTION, JOIN_GAME, JOINED_GAME_SUBSCRIPTION} from '../graphql';
import {Game} from "../graphql/model";
import PlayGame from "./PlayGame";

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
          console.log("a game has been joined");
          setGames(games.filter(g => g.id !== gameJoined.id));
          if (gameJoined.players.find(p => p.userId === playerName)) {
            console.log("Play the game " + gameJoined.id);
            playGame(gameJoined);
          }
        }
        }});
  useSubscription<CreatedGameType>(NEW_GAME_SUBSCRIPTION, {
    onSubscriptionData: ({subscriptionData}) => {
      if (subscriptionData.data?.createdGame && !games.find(game => game.id === subscriptionData.data?.createdGame.id)) {
        console.log("a game has been created");
        setGames([subscriptionData.data.createdGame, ...games]);
      }
    }
  });

  if (loading || !gameList) {
    console.log("loading");
    return (<div>Loading ...</div>);
  } else if (games.length === 0 && gameList.findGamesAwaitingSecondPlayer && gameList.findGamesAwaitingSecondPlayer.items && gameList.findGamesAwaitingSecondPlayer.items.length > 0) {
    console.log("games loaded");
    setGames(gameList.findGamesAwaitingSecondPlayer.items);
  }

  if (currentGame) {
    return (<PlayGame playerName={playerName} joinedGame={currentGame}/>)
  } else {
    return <ShowGames games={games} playerName={playerName}/>
  }
};

interface ShowGameProps extends JoinGameProps {
  games: Game[];
  playerName: string | undefined;
}

const ShowGames: FunctionComponent<ShowGameProps> = ({games, playerName }) => {
  const [joinGame] = useMutation(JOIN_GAME);
  return (
    <div>
      { games.filter( g => g.players[0].userId !== playerName).map(game => {
        return (<div className="joinGame">Join game: <button onClick={() => {
          console.log("join game button clicked");
          joinGame({
            variables: { gameId: game.id }

          });
        }}>{game.id} -  {game.players[0].userId}</button></div>)
      })}
    </div>);
}

export default JoinGame;