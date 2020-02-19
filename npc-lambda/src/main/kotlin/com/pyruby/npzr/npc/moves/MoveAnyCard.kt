package com.pyruby.npzr.npc.moves

import com.pyruby.npzr.npc.model.Character
import com.pyruby.npzr.npc.model.Player
import com.pyruby.npzr.npc.model.Position
import com.pyruby.npzr.npc.plays.Play
import com.pyruby.npzr.npc.plays.PlayCard.Companion.chooseCharacter
import com.pyruby.npzr.npc.plays.PlayCard.Companion.choosePosition
import com.pyruby.npzr.npc.plays.PlayCard.Companion.firstEmpty

class MoveAnyCard: MoveCard {

    override fun moveCard(player: Player, opponent: Player): Play? {
        val cards = opponent.stacks.flatMap { s -> listOfNotNull(s.head.firstOrNull(), s.torso.firstOrNull(), s.legs.firstOrNull()) }
        val scoredMoves = cards.map { scoreMove(Play(it, firstEmpty(player.stacks), choosePosition(it.bodyPart)), opponent.completed, player.completed) }
        return scoredMoves.sortedByDescending { it.score }.first().play
    }

    private fun scoreMove(play: Play, opponentCompleted: List<Character>, playerCompleted: List<Character>): ScoredMove {
        var score = 0
        if (opponentCompleted.contains(play.card.characterType)) score -= 2
        if (!playerCompleted.contains(play.card.characterType)) score += 3
        if (play.card.bodyPart == Position.Wild) score += 1
        if (play.card.characterType == Character.Wild) score += 2
        return ScoredMove(score, chooseCharacter(play.card.characterType, playerCompleted), play)
    }
}