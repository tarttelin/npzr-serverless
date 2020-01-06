import React, { useState, FunctionComponent } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_GAME } from '../graphql';


type GameSearchProps = {
    gameId: string
}

const GameSearch: FunctionComponent<GameSearchProps> = ({ gameId }) => {
    const { loading, data } = useQuery(GET_GAME, { variables: { gameId: gameId } });
    if (loading) {
      return (<div>Loading ...</div>);
    } else if (!data) {
      return (<div>Loaded but still not got data??</div>);
    } else if (data.getGame && data.getGame.id) {
      return (<div id="foundGame">game found: {data.getGame.id}</div>);
    } else {
      return (<div>Game not found</div>)
    }
};

const GetGame = () => {
  const [ id, setId ] = useState<string>('');
  return (
    <div>
      <input type="text" name="gameId" onChange={ event => setId(event.target.value) }/>
      { id && id.length === 36 ? (<GameSearch gameId={id}/>) : (<div>Search for a game</div>) }
    </div>
  )
};

export default GetGame;