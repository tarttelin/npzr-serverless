import React, { FunctionComponent } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import {SubscribeToMoreOptions} from 'apollo-client';
import { Auth } from 'aws-amplify';
import {GAMES_TO_JOIN, NEW_GAME_SUBSCRIPTION, JOIN_GAME, JOINED_GAME_SUBSCRIPTION} from '../graphql';
import {Game} from "../graphql/model";
import {OperationVariables} from "apollo-client/core/types";

interface JoinGameProps {
  playGame(game: Game): void;
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

const JoinGame: FunctionComponent<JoinGameProps> = ({ playGame }) => {
  const { subscribeToMore, loading, data } = useQuery<JoinGameData>(GAMES_TO_JOIN);

  subscribeToJoinedGames(subscribeToMore, playGame);
  subscribeToNewGames(subscribeToMore);

  if (loading) {
    return (<div>Loading ...</div>);
  } else if (!data) {
    return (<div>Loaded but still not got data??</div>);
  } else if (data.findGamesAwaitingSecondPlayer && data.findGamesAwaitingSecondPlayer.items && data.findGamesAwaitingSecondPlayer.items.length > 0) {
    return (<div>
      { data.findGamesAwaitingSecondPlayer.items.filter(game => {
        return game.players[1].playerType === 'Player' && game.players[1].userId === null;
      }).map( game => <ShowGame key={game.id} game={game} playGame={playGame}/>) }
      </div>);
  } else {
    return (<div>No games to join</div>)
  }
};

interface ShowGameProps extends JoinGameProps {
  game: Game
}

type SubscriptionDataType = {
  data: CreatedGameType;
};

type CreatedGameType = {
  createdGame: Game;
}

const ShowGame: FunctionComponent<ShowGameProps> = ({game, playGame }) => {
  console.log("game " + game.id);
  const [joinGame] = useMutation(JOIN_GAME,
    {
      variables: { gameId: game.id },
      onCompleted: ({ joinGame : jg }) => {
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
      if (!prev || !subscriptionData.data || !subscriptionData.data.createdGame) return prev;
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

const subscribeToJoinedGames = async (subscribeToMore: (fetchMoreOptions: SubscribeToMoreOptions<JoinGameData, OperationVariables, JoinedGameData>) => void, playGame: (game: Game)=> void) => {
  const loggedInUser = (await Auth.currentUserInfo()).username
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
      if (filteredList.findGamesAwaitingSecondPlayer.items.length < prev.findGamesAwaitingSecondPlayer!!.items.length) {
        if (joinedGame.players[0].userId === loggedInUser) {
          playGame(joinedGame);
        }
      }
      return filteredList;
    }
  });
};

export default JoinGame;