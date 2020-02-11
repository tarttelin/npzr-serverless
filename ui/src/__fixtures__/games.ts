
export const gamesToJoin = {
    findGamesAwaitingSecondPlayer: {
        items: [
            {
                id: "abc123",
                players: [{userId: "Jim", "playerType": "Player", "hand": [], "playState": "Wait"}, {
                    userId: null,
                    "playerType": "Player",
                    "hand": [],
                    "playState": "Wait"
                }],
                discardPile: [],
                "__typename": "Game"
            },
            {
                id: "abc125",
                players: [{
                    userId: "Beam",
                    "playerType": "Player",
                    "hand": [],
                    "playState": "Wait"
                }, {userId: null, "playerType": "Player", "hand": [], "playState": "Wait"}],
                discardPile: [],
                "__typename": "Game"
            }
        ]
    }
};

export const gameInProgress = {
    id: "abc123",
    players: [{
        userId: "Jim",
        completed: ["Ninja"],
        stacks: [{
            "id": "stack1",
            "head": [],
            "torso": [{
                __typename: "Card",
                "id": "card12",
                "bodyPart": "Torso",
                "characterType": "Zombie"
            }],
            "legs": []
        },{
            "id": "stack2",
            "head": [],
            "torso": [],
            "legs": []
        }],
        __typename: "Player",
        "playerType": "Player",
        "hand": [
            {
                __typename: "Card",
                "id": "card1",
                "bodyPart": "Head",
                "characterType": "Zombie"
            },{
                __typename: "Card",
                "id": "card2",
                "bodyPart": "Head",
                "characterType": "Ninja"
            },{
                __typename: "Card",
                "id": "card3",
                "bodyPart": "Wild",
                "characterType": "Zombie"
            },{
                __typename: "Card",
                "id": "card4",
                "bodyPart": "Torso",
                "characterType": "Pirate"
            },{
                __typename: "Card",
                "id": "card5",
                "bodyPart": "Head",
                "characterType": "Zombie"
            }
        ],
        "playState": "Play"
    }, {
        userId: "George",
        playerType: "Player",
        hand: [
            {
                __typename: "Card",
                "id": "card7",
                "bodyPart": "Head",
                "characterType": "Robot"
            },{
                __typename: "Card",
                "id": "card8",
                "bodyPart": "Head",
                "characterType": "Ninja"
            },{
                __typename: "Card",
                "id": "card9",
                "bodyPart": "Legs",
                "characterType": "Wild"
            },{
                __typename: "Card",
                "id": "card10",
                "bodyPart": "Torso",
                "characterType": "Zombie"
            },{
                __typename: "Card",
                "id": "card11",
                "bodyPart": "Wild",
                "characterType": "Robot"
            }
        ],
        playState: "Wait",
        completed: [],
        stacks: [{
            "id": "stack3",
            "head": [{
                __typename: "Card",
                "id": "card18",
                "bodyPart": "Head",
                "characterType": "Pirate"
            },{
                __typename: "Card",
                "id": "card19",
                "bodyPart": "Head",
                "characterType": "Zombie"
            }],
            "torso": [{
                __typename: "Card",
                "id": "card17",
                "bodyPart": "Torso",
                "characterType": "Zombie"
            }],
            "legs": []
        },{
            "id": "stack4",
            "head": [],
            "torso": [],
            "legs": []
        }],
        __typename: "Player"}],
    discardPile: [
        {
            __typename: "Card",
            "id": "card51",
            "bodyPart": "Head",
            "characterType": "Ninja"
        },{
            __typename: "Card",
            "id": "card53",
            "bodyPart": "Wild",
            "characterType": "Ninja"
        },{
            __typename: "Card",
            "id": "card55",
            "bodyPart": "Legs",
            "characterType": "Ninja"
        }
    ],
    "__typename": "Game"
}
