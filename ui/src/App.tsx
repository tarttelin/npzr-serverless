import React, { useState } from 'react';
import { withAuthenticator } from "aws-amplify-react";
import './App.css';
import CreateGame from "./components/CreateGame";
import GetGame from "./components/GetGame";
import JoinGame from "./components/JoinGame";
import PlayGame from "./components/PlayGame";
import {Game} from "./graphql/model";

const App: React.FC = () => {
  const [ game, setGame ] = useState<Game>();
  return (
    <div className="App">
      { game && (<PlayGame joinedGame={game}/>) }
      { !game &&
      (<>
        <CreateGame/>
        <GetGame/>
        <JoinGame playGame={setGame}/>
      </>)
      }
    </div>
  );
};

export default withAuthenticator(App);
