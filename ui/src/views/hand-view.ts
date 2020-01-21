import me from '../me';
import CardView from './card-view';
import Hand from "../viewmodels/hand";
import CardManager from "./card-manager";
import Card from "../viewmodels/card";

class HandView {
    private readonly x: number;
    private readonly y: number;
    private cardManager: CardManager;
    private hand: Hand;

    constructor(x: number, y: number, hand: Hand, cardManager: CardManager) {
        this.x = x;
        this.y = y;
        this.cardManager = cardManager;
        this.hand = hand;
        hand.observe?.addCard.subscribe( card => {
            this.resizeHand();
        });
        hand.observe?.removeCard.subscribe(card => {
            this.resizeHand()
        });
        this.resizeHand();
    }

    resizeHand() {
        me.timer.setTimeout((() => {
            let startX = this.x - this.hand.cards.length * ((CardView.width() + 5) / 2);
            this.hand.cards.forEach(((card: Card, idx: number) => {
                let view = this.cardManager.lookup(card);
                view.moveTo(startX + (idx * (CardView.width() + 10)), this.y);
            }).bind(this));
        }).bind(this), 100);
    }
}

export default HandView;