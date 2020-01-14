import CardManager from "./card-manager";
import me from "../me";
import Card from "../viewmodels/card";
import DiscardPile from "../viewmodels/discard-pile";
import CardView from "./card-view";

class DiscardPileView extends me.Entity {
    private cardManager: CardManager;

    constructor(x: number, y: number, cardManager: CardManager, discardPile: DiscardPile) {
        super(x, y, { width: CardView.width() + 2, height: CardView.height() + 2 });
        this.cardManager = cardManager;
        discardPile.observe?.addCard.subscribe( card => {
            this.moveToPile(card[0]);
        });
        discardPile.observe?.removeCard.subscribe(card => {
            this.moveToPile(card[0]);
        });
        this.color = 'white';
    }

    update() {
        return true;
    }

    draw(renderer: any) {
        renderer.setColor(this.color);
        renderer.stroke(new me.Rect(0, 0, this.width, this.height));
    }

    moveToPile(card?: Card) {
        if (!card) return;
        console.log('move to discard pile');
        let view = this.cardManager.lookup(card);
        view.moveTo(this.pos.x + 1, this.pos.y + 1);
    }
}

export default DiscardPileView;