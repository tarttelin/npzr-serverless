import React, {useEffect, useState} from 'react';
import { withAuthenticator } from "aws-amplify-react";
import './App.css';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import {Auth} from "aws-amplify";
import PlayGame from "./components/PlayGame";
import Home from "./components/Home";

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
      <Router>
        <div className="app">
          <Route exact path="/" render={(props) => <Home playerName={playerName} {...props}/> } />
          <Route exact path="/game/:id" render={(props) => <PlayGame playerName={playerName} {...props}/> } />
        </div>
      </Router>
  );
};

export default withAuthenticator(App);
