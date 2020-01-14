import {observe} from 'rxjs-observe';
import Player from "./player";
import DiscardPile from "./discard-pile";
import Card from "./card";
import StackSlot from "./stack-slot";

class Game {
    player: Player;
    opponent: Player;
    discardPile: DiscardPile;
    playCard: (card: Card, stackSlot: StackSlot) => void;

    constructor(playCard: (card: Card, stackSlot: StackSlot) => void) {
        const initPlayer = () => {
            let { observables, proxy } = observe(new Player(this, false));
            proxy.observe = observables;
            return proxy;
        };
        const initOpponent = () => {
            let { observables, proxy } = observe(new Player(this, true));
            proxy.observe = observables;
            return proxy;
        };
        const initDiscardPile = () => {
            let { observables, proxy } = observe(new DiscardPile());
            proxy.observe = observables;
            return proxy;
        };
        this.player = initPlayer();
        this.opponent = initOpponent();
        this.discardPile = initDiscardPile();
        this.playCard = playCard;
    }

}

export default Game;