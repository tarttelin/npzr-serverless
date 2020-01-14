import CardContainer from "./card-container";
import {Observables} from "rxjs-observe";

export enum Character {
    Ninja,
    Pirate,
    Zombie,
    Robot,
    Wild
}

export enum BodyPart {
    Head,
    Torso,
    Legs,
    Wild
}

class Card {
    character: Character;
    bodyPart: BodyPart;
    id: string;
    isMovable: boolean;
    parent?: CardContainer;
    observe?: Observables<Card>;

    constructor(character: Character, bodyPart: BodyPart, id: string) {
        this.character = character;
        this.bodyPart = bodyPart;
        this.id = id;
        this.isMovable = true;
    }
}

export default Card;