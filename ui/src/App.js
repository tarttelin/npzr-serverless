import React from 'react';
import { withAuthenticator } from "aws-amplify-react";
import './App.css';
import CreateGame from "./components/CreateGame";

function App() {
  return (
    <div className="App">
      <CreateGame/>
    </div>
  );
}

export default withAuthenticator(App);
