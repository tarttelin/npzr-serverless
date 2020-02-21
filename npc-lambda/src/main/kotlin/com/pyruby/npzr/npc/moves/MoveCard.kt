package com.pyruby.npzr.npc.moves

import com.pyruby.npzr.npc.model.Character
import com.pyruby.npzr.npc.model.Player
import com.pyruby.npzr.npc.model.Position
import com.pyruby.npzr.npc.plays.Play
import com.pyruby.npzr.npc.plays.PlayCard

interface MoveCard {
    fun moveCard(player: Player, opponent: Player): Play?

    companion object {
        fun scoreMove(play: Play, opponentCompleted: List<Character>, playerCompleted: List<Character>, playScore: Int = 0): ScoredMove {
            var score = playScore
            if (opponentCompleted.contains(play.card.characterType)) score -= 2
            if (!playerCompleted.contains(play.card.characterType)) score += 3
            if (play.card.bodyPart == Position.Wild) score += 1
            if (play.card.characterType == Character.Wild) score += 2
            return ScoredMove(score , PlayCard.chooseCharacter(play.card.characterType, playerCompleted), play)
        }
    }
}

data class ScoredMove(val score: Int, val character: Character, val play: Play)