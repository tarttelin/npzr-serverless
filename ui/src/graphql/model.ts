
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

export enum PlayState {
    Play,
    Move,
    MoveWild,
    Wait
}

export enum BodyPartType {
    Head,
    Torso,
    Legs,
    Wild,
    Flipped
}

export enum CharacterType {
    Ninja,
    Pirate,
    Zombie,
    Robot,
    Wild,
    Flipped
}

export interface Card {
    id: String;
    bodyPart: BodyPartType;
    characterType: CharacterType;
}

export interface Stack {
    id: string;
    head: Card[];
    torso: Card[];
    legs: Card[];
}