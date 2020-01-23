import Player from "../viewmodels/player";
import Card from "../viewmodels/card";
import CardView from "./card-view";
import me from "../me";

class CardManager {
    private cards: Map<Card, CardView> =  new Map<Card, CardView>();
    constructor(players: Player[]) {
        players.forEach(player => {
            player.hand.observe?.addCard.subscribe(card => {
                this.registerCard(card[0], player.isOpponent);
            });
            player.hand.cards.forEach(card => {
                this.registerCard(card, player.isOpponent);
            })
        })
    }

    registerCard(card: Card, faceDown: boolean) {
        if (this.cards.has(card)) {
            console.log("Not adding card to world");
            return this.cards.get(card)!;
        }
        let view = new CardView(20, 60, card, faceDown);
        this.cards.set(card, view);
        console.log("Adding card to world");
        me.game.world.addChild(view, this.cards.size);
        return view;
    }

    lookup(card: Card) {
        return this.cards.get(card) || this.registerCard(card, false);
    }
}

export default CardManager;