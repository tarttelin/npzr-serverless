package com.pyruby.npzr.npc.plays

import com.pyruby.npzr.npc.model.Card
import com.pyruby.npzr.npc.model.Character
import com.pyruby.npzr.npc.model.Player
import com.pyruby.npzr.npc.model.Position
import com.pyruby.npzr.npc.model.Stack
import com.pyruby.npzr.npc.plays.PlayCard.Companion.playCompletesCharacter

class PlayToCompleteStack: PlayCard {

    override fun playCard(player: Player, opponent: Player): Play? {
        val availablePlays = player.stacks.map { canCompleteStackWithCard(it, player.hand, player.completed) }
                .filterNotNull()
                .sortedByDescending { it.score }
        return availablePlays.firstOrNull()?.play
    }

    private fun canCompleteStackWithCard(stack: Stack, hand: List<Card>, playerComplete: List<Character>): ScoredPlay? {
        if (listOfNotNull(stack.head.firstOrNull(), stack.torso.firstOrNull(), stack.legs.firstOrNull()).size < 2) return null
        val availablePlays = hand.map { cardCompletesStack(it, stack) }.filterNotNull()
        if (availablePlays.isEmpty()) return null
        if (availablePlays.size == 1) return scoreCard(availablePlays.first(), playerComplete)
        return availablePlays.map { playsToScore -> scoreCard(playsToScore, playerComplete)}
                .sortedByDescending { scored -> scored.score }
                .first()
    }

    private fun scoreCard(play: ScoredPlay, playerComplete: List<Character>): ScoredPlay {
        var score = 0
        if (play.play.card.characterType == Character.Wild) score -= 1
        if (play.play.card.bodyPart == Position.Wild) score -= 1
        if (play.character != Character.Wild && !playerComplete.contains(play.character)) score += 3
        return play.copy(score=score)
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