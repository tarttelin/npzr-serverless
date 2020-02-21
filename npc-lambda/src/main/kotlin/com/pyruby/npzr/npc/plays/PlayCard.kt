package com.pyruby.npzr.npc.plays

import com.pyruby.npzr.npc.model.*

interface PlayCard {
    fun playCard(player: Player, opponent: Player): Play?

    companion object {
        fun playCompletesCharacter(head: Card?, torso: Card?, legs: Card?): Character? {
            val characters = HashSet<Character>()
            if (head != null && torso != null && legs != null) {
                if (validPosition(head, Position.Head) && validPosition(torso, Position.Torso) && validPosition(legs, Position.Legs)) {
                    characters.addAll(listOf(head.characterType, torso.characterType, legs.characterType).filter { it != Character.Wild })
                    return if (characters.isEmpty()) Character.Wild else if (characters.size == 1) characters.first() else null
                }
            }
            return null
        }

        fun scorePlay(play: ScoredPlay, playerComplete: List<Character>): ScoredPlay {
            var score = 0
            if (play.play.card.characterType == Character.Wild) score -= 1
            if (play.play.card.bodyPart == Position.Wild) score -= 1
            if (play.character != Character.Wild && !playerComplete.contains(play.character)) score += 3
            return play.copy(score=score)
        }

        fun chooseCharacter(cardCharacter: Character, scored: List<Character>) =
                if (cardCharacter == Character.Wild)
                    Character.values().toList().shuffled().minus(scored).first()
                else
                    cardCharacter

        fun choosePosition(cardPosition: Position) =
                if (cardPosition == Position.Wild)
                    Position.values().toList().minus(Position.Wild).shuffled().first()
                else
                    cardPosition

        fun firstEmpty(stacks: List<Stack>) = stacks.filter { s -> s.head.isEmpty() && s.torso.isEmpty() && s.legs.isEmpty()}.first()

        fun cardsOnOpponentStacks(opponent: Player) = opponent.stacks.flatMap { s -> listOfNotNull(s.head.firstOrNull(), s.torso.firstOrNull(), s.legs.firstOrNull()) }

        private fun validPosition(card: Card, expectedPosition: Position) = card.bodyPart == expectedPosition || card.bodyPart == Position.Wild

    }
}

data class Play(val card: Card, val stack: Stack, val position: Position)

data class ScoredPlay(val score: Int, val character: Character, val play: Play)
