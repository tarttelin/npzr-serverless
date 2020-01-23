import React, {FunctionComponent, useEffect, useState} from 'react';
import CreateGame from "./CreateGame";
import JoinGame from "./JoinGame";

type HomeProps = {
    playerName: string | undefined;
}

const Home: FunctionComponent<HomeProps> = ({playerName}) => (
    <div>
        <CreateGame/>
        <JoinGame playerName={playerName}/>
    </div>
);

export default Home;