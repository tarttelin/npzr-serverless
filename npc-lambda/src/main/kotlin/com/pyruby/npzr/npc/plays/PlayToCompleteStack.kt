package com.pyruby.npzr.npc.plays

import com.pyruby.npzr.npc.model.Card
import com.pyruby.npzr.npc.model.Character
import com.pyruby.npzr.npc.model.Player
import com.pyruby.npzr.npc.model.Position
import com.pyruby.npzr.npc.model.Stack
import com.pyruby.npzr.npc.moves.MoveCard
import com.pyruby.npzr.npc.moves.MoveCard.Companion.scoreMove
import com.pyruby.npzr.npc.plays.PlayCard.Companion.cardsOnOpponentStacks
import com.pyruby.npzr.npc.plays.PlayCard.Companion.playCompletesCharacter
import com.pyruby.npzr.npc.plays.PlayCard.Companion.scorePlay

class PlayToCompleteStack: PlayCard, MoveCard {

    override fun playCard(player: Player, opponent: Player): Play? {
        val availablePlays = player.stacks.flatMap { canCompleteStackWithCard(it, player.hand, player.completed) }
                .sortedByDescending { it.score }
        return availablePlays.firstOrNull()?.play
    }

    override fun moveCard(player: Player, opponent: Player): Play? {
        val availablePlays = player.stacks.flatMap { canCompleteStackWithCard(it, cardsOnOpponentStacks(opponent), player.completed) }
                .map { scoreMove(it.play, opponent.completed, player.completed, it.score) }
                .sortedByDescending { it.score }
        return availablePlays.firstOrNull()?.play
    }

    private fun canCompleteStackWithCard(stack: Stack, hand: List<Card>, playerComplete: List<Character>): List<ScoredPlay> {
        if (listOfNotNull(stack.head.firstOrNull(), stack.torso.firstOrNull(), stack.legs.firstOrNull()).size < 2) return emptyList()
        val availablePlays = hand.map { cardCompletesStack(it, stack) }.filterNotNull()
        return availablePlays.map { playsToScore -> scorePlay(playsToScore, playerComplete)}
    }

    private fun cardCompletesStack(c: Card, stack: Stack): ScoredPlay? {
        val headCharacter = playCompletesCharacter(c, stack.torso.firstOrNull(), stack.legs.firstOrNull())
        if (headCharacter != null) {
            return ScoredPlay(0, headCharacter, Play(c, stack, Position.Head))
        }
        val torsoCharacter = playCompletesCharacter(stack.head.firstOrNull(), c, stack.legs.firstOrNull())
        if (torsoCharacter != null) {
            return ScoredPlay(0, torsoCharacter, Play(c, stack, Position.Torso))
        }
        val legsCharacter = playCompletesCharacter(stack.head.firstOrNull(), stack.torso.firstOrNull(), c)
        if (legsCharacter != null) {
            return ScoredPlay(0, legsCharacter, Play(c, stack, Position.Legs))
        }
        return null
    }


}