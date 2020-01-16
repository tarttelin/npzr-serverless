import React, { FunctionComponent } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import {SubscribeToMoreOptions} from 'apollo-client';
import {GAMES_TO_JOIN, NEW_GAME_SUBSCRIPTION, JOIN_GAME, JOINED_GAME_SUBSCRIPTION} from '../graphql';
import {Game} from "../graphql/model";
import {OperationVariables} from "apollo-client/core/types";

interface JoinGameProps {
  playGame(game: Game): void;
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

const JoinGame: FunctionComponent<JoinGameProps> = ({ playGame, playerName }) => {
  const { subscribeToMore, loading, data } = useQuery<JoinGameData>(GAMES_TO_JOIN);

  subscribeToJoinedGames(playerName!, subscribeToMore, playGame);
  subscribeToNewGames(subscribeToMore);

  if (loading) {
    return (<div>Loading ...</div>);
  } else if (!data) {
    return (<div>Loaded but still not got data??</div>);
  } else if (data.findGamesAwaitingSecondPlayer && data.findGamesAwaitingSecondPlayer.items && data.findGamesAwaitingSecondPlayer.items.length > 0) {
    return (<div>
      { data.findGamesAwaitingSecondPlayer.items.filter(game => {
        return game.players[1].playerType === 'Player' && game.players[1].userId === null;
      }).map( game => <ShowGame key={game.id} game={game} playGame={playGame} playerName={playerName}/>) }
      </div>);
  } else {
    return (<div>No games to join</div>)
  }
};

interface ShowGameProps extends JoinGameProps {
  game: Game;
  playGame: (game: Game) => void;
}

type CreatedGameType = {
  createdGame: Game;
}

const ShowGame: FunctionComponent<ShowGameProps> = ({game, playGame }) => {
  const [joinGame] = useMutation(JOIN_GAME,
    {
      variables: { gameId: game.id },
      onCompleted: ({ joinGame : jg }) => {
        console.log("clicked join");
        playGame(jg);
      }
    });
  return (<div className="joinGame">Join game: <button onClick={() => {
    joinGame();
  }}>{game.id} -  {game.players[0].userId}</button></div>)
};

const subscribeToNewGames = (subscribeToMore: (fetchMoreOptions: SubscribeToMoreOptions<JoinGameData, OperationVariables, CreatedGameType>) => void) => {
  subscribeToMore({
    document: NEW_GAME_SUBSCRIPTION,
    variables: {},
    updateQuery: (prev: JoinGameData, { subscriptionData }) => {
      if (!prev || !subscriptionData.data || !subscriptionData.data.createdGame) {
        return prev;
      }
      const newGame = subscriptionData.data.createdGame;
      return Object.assign({}, prev, {
        findGamesAwaitingSecondPlayer: {
          items: [newGame, ...prev.findGamesAwaitingSecondPlayer!!.items.filter(game => game.id !== newGame.id)],
          __typename: "GameConnection"
        }
      });
    }
  });
};

const subscribeToJoinedGames = (loggedInUser: string, subscribeToMore: (fetchMoreOptions: SubscribeToMoreOptions<JoinGameData, OperationVariables, JoinedGameData>) => void, playGame: (game: Game)=> void) => {
  subscribeToMore({
    document: JOINED_GAME_SUBSCRIPTION,
    variables: {},
    updateQuery: (prev, {subscriptionData}) => {
      if (!prev || !subscriptionData.data || !subscriptionData.data.joinedGame) return prev;
      const joinedGame = subscriptionData.data.joinedGame;

      const filteredList =  Object.assign({}, prev, {
        findGamesAwaitingSecondPlayer: {
          items: [...prev.findGamesAwaitingSecondPlayer!!.items.filter(game => game.id !== joinedGame.id)],
          __typename: "GameConnection"
        }
      });
      console.log("game joined");
      if (filteredList.findGamesAwaitingSecondPlayer.items.length < prev.findGamesAwaitingSecondPlayer!!.items.length) {
        if (joinedGame.players[0].userId === loggedInUser) {
          playGame(joinedGame);
        } else {
          console.log(`Didn't start game. Player ${joinedGame.players[0].userId} not logged in user ${loggedInUser}`);
        }
      }
      return filteredList;
    }
  });
};

export default JoinGame;