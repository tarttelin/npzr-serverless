package com.pyruby.npzr.npc.moves

import com.pyruby.npzr.npc.model.Player
import com.pyruby.npzr.npc.moves.MoveCard.Companion.scoreMove
import com.pyruby.npzr.npc.plays.Play
import com.pyruby.npzr.npc.plays.PlayCard.Companion.cardsOnOpponentStacks
import com.pyruby.npzr.npc.plays.PlayCard.Companion.choosePosition
import com.pyruby.npzr.npc.plays.PlayCard.Companion.firstEmpty

class MoveHighestScoreAnyCard: MoveCard {

    override fun moveCard(player: Player, opponent: Player): Play? {
        val cards = cardsOnOpponentStacks(opponent)
        val scoredMoves = cards.map { scoreMove(Play(it, firstEmpty(player.stacks), choosePosition(it.bodyPart)), opponent.completed, player.completed) }
        return scoredMoves.sortedByDescending { it.score }.first().play
    }
}