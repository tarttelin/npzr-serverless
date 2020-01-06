import React from 'react';
import {useMutation} from '@apollo/react-hooks';
import {CREATE_GAME} from '../graphql';
import {Game} from "../graphql/model";

interface CreateGameVars {
    opponent: string;
}

interface CreateGameData {
    createGame: Game;
}

const CreateGame = () => {
  const [createGame, { data }] = useMutation<CreateGameData, CreateGameVars>(CREATE_GAME);
  return (
    <div>
        <button onClick={() => createGame({ variables: { opponent: 'Player' } })}>Create</button>
        { data !== undefined && (<div id="createdResult">game created: {data.createGame.id}</div>)}
    </div>

  )
};

export default CreateGame;