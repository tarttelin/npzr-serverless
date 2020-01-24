import React, {FunctionComponent} from 'react';
import CreateGame from "./CreateGame";
import JoinGame from "./JoinGame";
import {Typography} from "@material-ui/core";

type HomeProps = {
    playerName: string | undefined;
}

const Home: FunctionComponent<HomeProps> = ({playerName}) => (
    <div>
        <Typography variant="h2">
            Ninja Pirate Zombie Robot
        </Typography>
        <Typography variant="body1">
            A 2 player game, either create a new game, or join someone waiting for a second player. If there is some delay
            when clicking create or join a game, it's because the backend only starts running when there are active players playing. After 5 minutes
            of no activity the backend shuts down.
        </Typography>
        <CreateGame/>
        <JoinGame playerName={playerName}/>
    </div>
);

export default Home;