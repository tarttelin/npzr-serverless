import me from '../me';
import Game from '../viewmodels/game';
import DeckView from '../views/deck-view';
import PlayerView from "../views/player-view";
import CardManager from "../views/card-manager";
import CardView from "../views/card-view";
import DiscardPileView from "../views/discard-pile-view";

class PlayScreen extends me.Stage {
    constructor(game: Game) {
        super();
        this.game = game;
    }

    onResetEvent() {
        // reset the score
        this.cardManager = new CardManager([this.game.player, this.game.opponent]);
        this.playerView = new PlayerView(this.game.player, this.game, this.cardManager);
        this.opponentView = new PlayerView(this.game.opponent, this.game, this.cardManager);

        me.game.world.addChild(new me.ColorLayer("background", "#003400", 0), 0);

        me.game.world.addChild(new DeckView(CardView.width() / 3,
            me.game.viewport.height / 2 - CardView.height() / 2), 1);
        me.game.world.addChild(new DiscardPileView(CardView.width() / 3,
            me.game.viewport.height / 2 + CardView.height() / 2 + 10,
            this.cardManager, this.game.discardPile), 1);
    }

    onDestroyEvent() {
        // remove the HUD from the game world
        me.game.world.removeChild(this.HUD);
    }
}

export default PlayScreen;