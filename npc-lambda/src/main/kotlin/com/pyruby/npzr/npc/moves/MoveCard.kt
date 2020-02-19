package com.pyruby.npzr.npc.moves

import com.pyruby.npzr.npc.model.Character
import com.pyruby.npzr.npc.model.Player
import com.pyruby.npzr.npc.plays.Play

interface MoveCard {
    fun moveCard(player: Player, opponent: Player): Play?
}

data class ScoredMove(val score: Int, val character: Character, val play: Play)