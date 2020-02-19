package com.pyruby.npzr.npc.plays

import com.pyruby.npzr.npc.model.Character
import com.pyruby.npzr.npc.model.Player
import com.pyruby.npzr.npc.model.Position
import com.pyruby.npzr.npc.plays.PlayCard.Companion.scorePlay

class PlayHighestScoreAnyCard: PlayCard {

    override fun playCard(player: Player, opponent: Player): Play? {
        val availablePlays = player.hand.map { card -> ScoredPlay(0, chooseCharacter(card.characterType, player.completed), Play(card, player.stacks.last(), choosePosition(card.bodyPart))) }
                .map { scorePlay(it, player.completed)}
                .sortedByDescending { it.score }
        return availablePlays.first().play
    }

    private fun chooseCharacter(cardCharacter: Character, scored: List<Character>) =
            if (cardCharacter == Character.Wild)
                Character.values().toList().shuffled().minus(scored).first()
            else
                cardCharacter

    private fun choosePosition(cardPosition: Position) =
            if (cardPosition == Position.Wild)
                Position.values().toList().minus(Position.Wild).shuffled().first()
            else
                cardPosition
}