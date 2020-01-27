import Card, {BodyPart} from "./card";
import Stack from "./stack";
import {Observables} from "rxjs-observe";
import CardContainer from "./card-container";

class StackSlot implements CardContainer {
    cards: Card[];
    parent: Stack;
    observe?: Observables<StackSlot>;
    readonly position: BodyPart;

    constructor(stack: Stack, position: BodyPart) {
        this.parent = stack;
        this.position = position;
        this.cards = [];
    }

    addCard(card: Card) {
        if (!this.cards.includes(card)) {
            card.parent?.removeCard(card);
            card.parent = this;
            this.cards.push(card);
            this.cards.filter(c => c.id !== card.id).forEach(c => c.isMovable = false);
        }
    }

    removeCard(card?: Card) {
        if (card === undefined) {
            let top = this.cards.pop();
            if (top) top.parent = undefined;
            return top;
        }
        if (this.cards.includes(card)) {
            card.parent = undefined;
            this.cards = this.cards.filter(c => c !== card);
            card.isMovable = true;
            if (this.cards.length > 0) {
                this.cards[this.cards.length - 1].isMovable = true;
            }
            return card;
        }
    }
}

export default StackSlot