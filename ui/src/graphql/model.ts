
export interface Game {
    id: string;
    players: Player[];
    discardPile: Card[];
}

export interface Player {
    playerType: string;
    userId: string;
    hand: Card[];
    stacks: Stack[];
    completed: CharacterType[];
    playState: PlayState;
}

export type PlayerType = "AI" | "Player";

export type PlayState = "Play" | "Move" | "MoveThenPlay" | "Wait" | "Winner" | "Loser";

export type BodyPartType = "Head" | "Torso" | "Legs" | "Wild";

export type CharacterType = "Ninja" | "Pirate" | "Zombie" | "Robot" | "Wild";

export interface Card {
    id: string;
    bodyPart: BodyPartType;
    characterType: CharacterType;
}

export interface Stack {
    id: string;
    head: Card[];
    torso: Card[];
    legs: Card[];
}