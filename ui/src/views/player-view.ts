import me from '../me';
import Player from "../viewmodels/player";
import HandView from "./hand-view";
import StackSlotView from "./stack-slot-view";
import Stack from "../viewmodels/stack";
import Game from "../viewmodels/game";
import CardView from "./card-view";
import Hand from "../viewmodels/hand";
import CardManager from "./card-manager";

class PlayerView {
    player: Player;
    handView?: HandView;
    stackViews: StackSlotView[][];
    private readonly _game: Game;
    private readonly _cardManager: CardManager;

    constructor(player: Player, game: Game, cardManager: CardManager) {
        this.player = player;
        this._game = game;
        this._cardManager = cardManager;
        this.stackViews = [];
        this.showHand(player.hand);
        player.stacks.forEach(stack => this.addStack(stack));
        player.observe?.addStack.subscribe(value => this.addStack(player.stacks[player.stacks.length - 1]));
    }

    addStack(stack: Stack) {
        let [x, y] = [me.game.viewport.width/2, this.player.isOpponent ? me.game.viewport.height / 2 - 20 - 3 * CardView.height() : me.game.viewport.height / 2 + 20 ];
        let head = new StackSlotView(x, y, this._game, stack.head, this._cardManager);
        let torso = new StackSlotView(x, y + CardView.height(), this._game, stack.torso, this._cardManager);
        let legs = new StackSlotView(x, y + CardView.height() * 2, this._game, stack.legs, this._cardManager);
        this.stackViews.push([head, torso, legs]);
        me.game.world.addChild(head, this.stackViews.length);
        me.game.world.addChild(torso, this.stackViews.length);
        me.game.world.addChild(legs, this.stackViews.length);
        this.resizeStacks();
    }

    resizeStacks() {
        this.stackViews.forEach(((stack: StackSlotView[], idx: number) => {
            let startX = me.game.viewport.width / 2 - this.stackViews.length * (CardView.width() / 2 + 5);
            stack.map(slot => slot.moveTo(startX + 10 + (idx * (CardView.width() + 10))));
        }));
    }

    showHand(hand: Hand) {
        this.handView = new HandView(
            me.game.viewport.width / 2,
            this.player.isOpponent ? 5 : me.game.viewport.height - CardView.height() - 10,
            hand, this._cardManager);
    }
}

export default PlayerView;