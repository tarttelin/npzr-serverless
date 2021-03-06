package com.pyruby.npzr.npc.moves

import com.pyruby.npzr.npc.model.Player
import com.pyruby.npzr.npc.model.Position
import com.pyruby.npzr.npc.plays.Play
import com.pyruby.npzr.npc.plays.PlayCard
import com.pyruby.npzr.npc.plays.PlayCard.Companion.cardsOnOpponentStacks
import com.pyruby.npzr.npc.plays.ScoredPlay

class MoveMatchingCharacterToExistingStack: MoveCard {

    override fun moveCard(player: Player, opponent: Player): Play? {
        val availableMoves = cardsOnOpponentStacks(opponent).flatMap { c ->
            player.stacks.map {
                s -> Pair(s, listOfNotNull(s.head.firstOrNull(), s.torso.firstOrNull(), s.legs.firstOrNull())
                    .filter { it.characterType == c.characterType && it.bodyPart != c.bodyPart })
            }
                    .filter { (_, matches) -> matches.isNotEmpty()}
                    .map { (stack, matches) -> Play(c, stack, if (c.bodyPart == Position.Wild) Position.values().asList().minus(matches.map { it.bodyPart }).first() else c.bodyPart) }
        }
        return availableMoves
                .map { PlayCard.scorePlay(ScoredPlay(0, it.card.characterType, it), player.completed) }
                .map { MoveCard.scoreMove(it.play, opponent.completed, player.completed, it.score) }
                .sortedByDescending { it.score }
                .firstOrNull()?.play
    }
}