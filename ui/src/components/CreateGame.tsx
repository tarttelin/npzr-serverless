import React from 'react';
import {useMutation} from '@apollo/react-hooks';
import {CREATE_GAME} from '../graphql';
import {Game} from "../graphql/model";
import {Button} from "@material-ui/core";

interface CreateGameVars {
    opponent: string;
}

interface CreateGameData {
    createGame: Game;
}

const CreateGame = () => {
  const [createGame, { data, loading }] = useMutation<CreateGameData, CreateGameVars>(CREATE_GAME);
  return (
    <div>
        { data !== undefined ? (<div id="createdResult">game created: {data.createGame.id}</div>) :
            loading ? (<div>Creating game</div>) :
            (<Button variant="contained" color="primary" onClick={() => createGame({ variables: { opponent: 'Player' } })}>Create</Button>)}
    </div>

  )
};

export default CreateGame;