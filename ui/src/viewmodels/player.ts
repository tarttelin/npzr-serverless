import Hand from "./hand";
import Stack from "./stack";
import { Observables, observe } from "rxjs-observe";
import {Character} from "./card";

export enum PlayState {
    Play,
    Move,
    MoveThenPlay,
    Wait,
    Winner,
    Loser
}

class Player {
    hand: Hand;
    stacks: Stack[];
    playState: PlayState;
    observe?: Observables<Player>;
    isOpponent: boolean;
    score: Character[] = [];

    constructor(opponent: boolean = false) {
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
        this.stacks.push(new Stack(id));
    }

    setScore(characters: Character[]) {
        this.score = characters;
    }
}

export default Player;