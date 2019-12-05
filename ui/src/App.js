import React from 'react';
import { withAuthenticator } from "aws-amplify-react";
import './App.css';
import CreateGame from "./components/CreateGame";
import GetGame from "./components/GetGame";
import JoinGame from "./components/JoinGame";

function App() {
  return (
    <div className="App">
      <CreateGame/>
      <GetGame/>
      <JoinGame/>
    </div>
  );
}

export default withAuthenticator(App);
