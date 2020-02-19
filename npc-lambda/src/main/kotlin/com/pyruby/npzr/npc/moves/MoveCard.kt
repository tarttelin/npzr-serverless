package com.pyruby.npzr.npc.moves

import com.pyruby.npzr.npc.model.Player
import com.pyruby.npzr.npc.plays.Play

interface MoveCard {
    fun moveCard(player: Player, opponent: Player): Play?
}