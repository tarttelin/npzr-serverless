import { Game } from "../graphql/model";
import GameViewModel from "../viewmodels/game";
import React, {FunctionComponent, useEffect, useState} from "react";
import GameContainer from "../game-container";
import GameViewWrapper from "../viewmodels/game-wrapper";


interface PlayGameComponentProps {
    gameState: Game;
    game: GameViewModel;
    playerName: string;
    errorMessage: string | undefined;
}

const PlayGameComponent: FunctionComponent<PlayGameComponentProps> = ({gameState, game, playerName, errorMessage}) => {
    const [gameView, setGameView] = useState<GameContainer>();
    const gameWrapper = new GameViewWrapper(game, playerName);
    useEffect(() => {
        if (!gameView) {
            setGameView(new GameContainer(game));
        }
        gameWrapper.updateView(gameState);
    },[gameState]);

    return  <div>
        <div>{gameWrapper.opponent(gameState).playState !== "Wait" ? "Opponent's turn " : "Your turn to " + gameWrapper.currentPlayer(gameState).playState  + " "}
            [ score {gameWrapper.currentPlayer(gameState).completed.map(c => (<span>{c} </span>))}]
            { errorMessage ? <span>{ errorMessage }</span> : <span>no error</span>}
        </div>
        <div id="screen"/>
    </div>
};






export default PlayGameComponent;