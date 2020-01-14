import CardContainer from "./card-container";
import Card from "./card";
import {Observables} from "rxjs-observe";

class DiscardPile implements CardContainer {
    cards: Card[];
    observe?: Observables<DiscardPile>;


    constructor() {
        this.cards = [];
    }

    addCard(card: Card): void {
        if (!this.cards.includes(card)) {
            card.parent?.removeCard(card);
            card.parent = this;
            this.cards.push(card);
            card.isMovable = false;
        }
    }

    removeCard(card?: Card): void {
        // do nothing for now
    }

}

export default DiscardPile;