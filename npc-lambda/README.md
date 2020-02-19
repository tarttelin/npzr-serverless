# NPC play rules

### Play

1. Card to complete a stack - inc character wild
    * Lay it
1. Character wild card?
    * 1 on stack, different part in hand?
        * Lay wild in missing spot
        * Lay last part in hand
    * 1 of that character in hand
        * None of that character on your stack?
            * Lay matching non-wild
1. All character parts in play plus hand to complete character?
    * Lay card
1. Two of same card in hand?
    * None of that card on your stacks?
        * Lay it
1. 2 completes stacks?
    * 2 or more wild cards?
        * loop for each wild
            * can complete new character?
                * Lay it
1. 3 completed stacks?
    * 1 or more wild?
        * loop for each wild
            * can complete new character?
                * Winner! 
            * 2 or more wild?
                * Can complete any set?
                    * Lay it
1. Loop for each non wild
    * card not on stack
        * card matches character on existing stack
            * lay on that stack
        * lay on first empty stack
1. Lay in first valid empty stack slot (wild cards only left)

### Move

1. Card to complete a character?
    * Move and complete
1. Have card I have not, both in hand, on my stacks or character already complete?
    * move it
1. Have 2 cards that would complete a set that the other player needs?
    * Move top most
1. Have card for character other player has not completed?
    * move it
1. Move first available card