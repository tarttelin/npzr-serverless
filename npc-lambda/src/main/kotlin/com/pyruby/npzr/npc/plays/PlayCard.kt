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

        private fun validPosition(card: Card, expectedPosition: Position) = card.bodyPart == expectedPosition || card.bodyPart == Position.Wild

    }
}

data class Play(val card: Card, val stack: Stack, val position: Position)

data class ScoredPlay(val score: Int, val character: Character, val play: Play)