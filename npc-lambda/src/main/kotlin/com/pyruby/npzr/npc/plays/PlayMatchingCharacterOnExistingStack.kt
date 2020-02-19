package com.pyruby.npzr.npc.plays

import com.pyruby.npzr.npc.model.Player
import com.pyruby.npzr.npc.model.Position
import com.pyruby.npzr.npc.plays.PlayCard.Companion.scorePlay

class PlayMatchingCharacterOnExistingStack: PlayCard {
    override fun playCard(player: Player, opponent: Player): Play? {
        val availablePlays = player.hand.flatMap { c ->
            player.stacks.map {
                s -> Pair(s, listOfNotNull(s.head.firstOrNull(), s.torso.firstOrNull(), s.legs.firstOrNull())
                    .filter { it.characterType == c.characterType && it.bodyPart != c.bodyPart })
            }
                    .filter { (stack, matches) -> matches.isNotEmpty()}
                    .map { (stack, matches) -> Play(c, stack, if (c.bodyPart == Position.Wild) Position.values().asList().minus(matches.map { it.bodyPart }).first() else c.bodyPart) }
        }
        return availablePlays.map { scorePlay(ScoredPlay(0, it.card.characterType, it), player.completed) }
                .sortedByDescending { it.score }
                .firstOrNull()?.play
    }
}