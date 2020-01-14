import Card from "./card";

interface CardContainer {
    cards: Card[];
    addCard(card: Card): void;
    removeCard(card?: Card): void;
}

export default CardContainer;