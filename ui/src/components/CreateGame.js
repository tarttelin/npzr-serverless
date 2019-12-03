import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { createGame as CREATE_GAME } from '../graphql';

const CreateGame = () => {
  const [createGame, { data }] = useMutation(CREATE_GAME);
  return (
    <div>
        <button onClick={() => createGame({ variables: { userId: "chris", playerType: "Player" } })}>Create</button>
        { data !== undefined && (<div>game created: {data.createGame.id}</div>)}
    </div>

  )
};

export default CreateGame;