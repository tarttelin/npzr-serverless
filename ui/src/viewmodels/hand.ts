import Card from "./card";
import CardContainer from "./card-container";
import {Observables} from "rxjs-observe";


class Hand implements CardContainer {
    cards: Card[];
    observe?: Observables<Hand>;

    constructor() {
        this.cards = [];
    }

    addCard(card: Card) {
        if (!this.cards.includes(card)) {
            this.cards.push(card);
            card.parent = this;
        }
    }

    removeCard(card: Card) {
        if (card.parent === this) {
            this.cards = this.cards.filter(c => c !== card);
        }
    }
}

export default Hand;