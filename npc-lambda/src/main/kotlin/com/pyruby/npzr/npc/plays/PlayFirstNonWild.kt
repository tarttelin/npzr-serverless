package com.pyruby.npzr.npc.plays

import com.pyruby.npzr.npc.model.Character
import com.pyruby.npzr.npc.model.Player
import com.pyruby.npzr.npc.model.Position

class PlayFirstNonWild: PlayCard {

    override fun playCard(player: Player, opponent: Player): Play? {
        val card = player.hand.find { card -> card.bodyPart != Position.Wild && card.characterType != Character.Wild }
        return if (card != null) {
            Play(card, player.stacks.last(), card.bodyPart)
        } else {
            null
        }
    }
}