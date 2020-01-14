import React, {useEffect, useState} from 'react';
import { withAuthenticator } from "aws-amplify-react";
import './App.css';
import CreateGame from "./components/CreateGame";
import GetGame from "./components/GetGame";
import JoinGame from "./components/JoinGame";
import PlayGame from "./components/PlayGame";
import {Game} from "./graphql/model";
import {Auth} from "aws-amplify";

const App: React.FC = () => {
  const [ game, setGame ] = useState<Game>();
  const [playerName, setPlayerName] = useState<string>();
  useEffect(() => {
    if (!playerName) {
      getUsername();
    }
  }, [playerName]);
  const getUsername = async () => {
    let name = (await Auth.currentUserInfo()).username;
    setPlayerName(name);
  };
  return (
    <div className="App">
      { game && (<PlayGame joinedGame={game} playerName={playerName}/>) }
      { !game &&
      (<>
        <CreateGame/>
        <GetGame/>
        <JoinGame playGame={setGame} playerName={playerName}/>
      </>)
      }
    </div>
  );
};

export default withAuthenticator(App);
