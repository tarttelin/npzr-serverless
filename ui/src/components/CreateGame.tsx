import React from 'react';
import {useMutation} from '@apollo/react-hooks';
import {CREATE_GAME} from '../graphql';
import {Game} from "../graphql/model";
import {Button} from "@material-ui/core";
import { Redirect } from 'react-router-dom';

interface CreateGameVars {
    opponent: string;
}

interface CreateGameData {
    createGame: Game;
}

const CreateGame = () => {
  const [createGame, { data, loading }] = useMutation<CreateGameData, CreateGameVars>(CREATE_GAME);
  if (data && data.createGame.players[1].playerType === "AI") {
      return (<Redirect to={`/game/${data?.createGame.id}`}/>);
  }
  return (
    <div>
        { data !== undefined ? (<div id="createdResult">game created: {data.createGame.id}</div>) :
            loading ? (<div>Creating game</div>) :
            (<>
                <Button variant="contained" color="primary" onClick={() => createGame({ variables: { opponent: 'Player' } })}>Live opponent</Button>
                <Button variant="contained" color="secondary" onClick={() => createGame({ variables: { opponent: 'AI' } })}>Robot</Button>
            </>)}
    </div>

  )
};

export default CreateGame;