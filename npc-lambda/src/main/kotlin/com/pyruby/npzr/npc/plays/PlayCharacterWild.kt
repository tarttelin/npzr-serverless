package com.pyruby.npzr.npc.plays

import com.pyruby.npzr.npc.model.*
import com.pyruby.npzr.npc.plays.PlayCard.Companion.playCompletesCharacter

class PlayCharacterWild: PlayCard {

    override fun playCard(player: Player, opponent: Player): Play? {
        val wildCharacters = player.hand.filter { c -> c.bodyPart == Position.Wild && c.characterType != Character.Wild }
        val matches = wildCharacters.map { c -> Pair(c, player.hand.filter { it.characterType == c.characterType && it.bodyPart != Position.Wild })}
                .filter { it.second.isNotEmpty()}
        val stackMatches = matches.flatMap { (wildCard, cardsInHand) -> player.stacks.map { stack ->
            playOnStackContainingMatchingCharacter(wildCard, cardsInHand, stack)
        }.filterNotNull()}
        if (stackMatches.isNotEmpty())
            return stackMatches.first()
        else if (matches.isNotEmpty()) {
            val (_, matchingCards) = matches.first()
            return Play(matchingCards.first(), player.stacks.last(), matchingCards.first().bodyPart)
        }
        return null
    }

    private fun playOnStackContainingMatchingCharacter(wildCard: Card, cardsInHand: List<Card>, stack: Stack): Play? {
        cardsInHand.forEach {
            val topCardsOnStack = listOfNotNull(stack.head.firstOrNull(), stack.torso.firstOrNull(), stack.legs.firstOrNull())
            val cardsOfSameCharacter = topCardsOnStack.filter { c -> c.characterType == wildCard.characterType }
            val positionsOnStack = cardsOfSameCharacter.map { c -> c.bodyPart }
            if (positionsOnStack.minus(it.bodyPart).isEmpty()) return null
            val character = playCompletesCharacter(
                    head=if(it.bodyPart == Position.Head) it else if(stack.head.firstOrNull()?.characterType == wildCard.characterType) stack.head.first() else wildCard,
                    torso=if(it.bodyPart == Position.Torso) it else if(stack.torso.firstOrNull()?.characterType == wildCard.characterType) stack.torso.first() else wildCard,
                    legs=if(it.bodyPart == Position.Legs) it else if(stack.legs.firstOrNull()?.characterType == wildCard.characterType) stack.legs.first() else wildCard
            )
            if (character != null) {
                val availablePositions = Position.values().toList().minus(Position.Wild)
                val remainingPositions = availablePositions.minus(it.bodyPart).minus(positionsOnStack)
                return Play(wildCard, stack, remainingPositions.first())
            }
        }
        return null
    }
}