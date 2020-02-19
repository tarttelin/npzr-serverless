package com.pyruby.npzr.npc.plays

import com.pyruby.npzr.npc.model.Player
import com.pyruby.npzr.npc.plays.PlayCard.Companion.chooseCharacter
import com.pyruby.npzr.npc.plays.PlayCard.Companion.choosePosition
import com.pyruby.npzr.npc.plays.PlayCard.Companion.firstEmpty
import com.pyruby.npzr.npc.plays.PlayCard.Companion.scorePlay

class PlayHighestScoreAnyCard: PlayCard {

    override fun playCard(player: Player, opponent: Player): Play? {
        val availablePlays = player.hand.map { card -> ScoredPlay(0, chooseCharacter(card.characterType, player.completed), Play(card, firstEmpty(player.stacks), choosePosition(card.bodyPart))) }
                .map { scorePlay(it, player.completed)}
                .sortedByDescending { it.score }
        return availablePlays.first().play
    }


}

