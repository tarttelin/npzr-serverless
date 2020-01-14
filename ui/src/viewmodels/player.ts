import Hand from "./hand";
import Stack from "./stack";
import Game from "./game";
import { Observables, observe } from "rxjs-observe";

export enum PlayState {
    Play,
    Move,
    MoveThenPlay,
    Wait
}

class Player {
    hand: Hand;
    stacks: Stack[];
    playState: PlayState;
    observe?: Observables<Player>;
    game: Game;
    isOpponent: boolean;

    constructor(game: Game, opponent: boolean = false) {
        this.game = game;
        this.stacks = [];
        const initHand = () => {
            let { observables, proxy } = observe(new Hand());
            proxy.observe = observables;
            return proxy;
        };
        this.hand = initHand();
        this.playState = PlayState.Play;
        this.isOpponent = opponent;
    }

    addStack(id: string) {
        this.stacks.push(new Stack(this, id));
    }
}

export default Player;