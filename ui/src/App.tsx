import React, {useEffect, useState} from 'react';
import { withAuthenticator } from "aws-amplify-react";
import './App.css';
import CreateGame from "./components/CreateGame";
import JoinGame from "./components/JoinGame";
import {Auth} from "aws-amplify";

const App: React.FC = () => {
  const [playerName, setPlayerName] = useState<string>();
  useEffect(() => {
    const setUsername = async () => {
      let name = (await Auth.currentUserInfo()).username;
      setPlayerName(name);
      console.log("Name set to " + name);
    };
    setUsername();
  }, []);

  return (
    <div className="App">
      <CreateGame/>
      {/*<GetGame/>*/}
      <JoinGame playerName={playerName}/>
    </div>
  );
};

export default withAuthenticator(App);
