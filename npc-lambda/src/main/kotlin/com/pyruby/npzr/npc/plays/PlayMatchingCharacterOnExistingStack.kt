package com.pyruby.npzr.npc.plays

import com.pyruby.npzr.npc.model.Card
import com.pyruby.npzr.npc.model.Character
import com.pyruby.npzr.npc.model.Player
import com.pyruby.npzr.npc.model.Position
import com.pyruby.npzr.npc.model.Stack
import com.pyruby.npzr.npc.plays.PlayCard.Companion.scorePlay

class PlayMatchingCharacterOnExistingStack: PlayCard {
    override fun playCard(player: Player, opponent: Player): Play? {
        val availablePlays = player.hand.flatMap { c ->
            player.stacks.flatMap {
                s -> playsOnStack(s, c)
        }}
        return availablePlays.map { scorePlay(ScoredPlay(0, it.card.characterType, it), player.completed) }
                .sortedByDescending { it.score }
                .firstOrNull()?.play
    }

    private fun playsOnStack(stack: Stack, card: Card): List<Play> {
        if (card.characterType == Character.Wild)
            return emptyList()
        return when(card.bodyPart) {
            Position.Head ->
                if (stack.head.firstOrNull()?.characterType == card.characterType) {
                    emptyList()
                } else if (stack.torso.firstOrNull()?.characterType == card.characterType || stack.legs.firstOrNull()?.characterType == card.characterType) {
                    listOf(Play(card, stack, Position.Head))
                } else {
                    emptyList()
                }
            Position.Torso ->
                if (stack.torso.firstOrNull()?.characterType == card.characterType) {
                    emptyList()
                } else if (stack.head.firstOrNull()?.characterType == card.characterType || stack.legs.firstOrNull()?.characterType == card.characterType) {
                    listOf(Play(card, stack, Position.Torso))
                } else {
                    emptyList()
                }
            Position.Legs ->
                if (stack.legs.firstOrNull()?.characterType == card.characterType) {
                    emptyList()
                } else if (stack.head.firstOrNull()?.characterType == card.characterType || stack.torso.firstOrNull()?.characterType == card.characterType) {
                    listOf(Play(card, stack, Position.Legs))
                } else {
                    emptyList()
                }
            Position.Wild -> {
                var plays: List<Play> = emptyList()
                if (stack.head.firstOrNull()?.characterType !in listOf(card.characterType, Character.Wild))
                    plays = plays.plus(playsOnStack(stack, card.copy(bodyPart = Position.Head)))
                if (stack.torso.firstOrNull()?.characterType !in listOf(card.characterType, Character.Wild))
                    plays = plays.plus(playsOnStack(stack, card.copy(bodyPart = Position.Torso)))
                if (stack.legs.firstOrNull()?.characterType !in listOf(card.characterType, Character.Wild))
                    plays = plays.plus(playsOnStack(stack, card.copy(bodyPart = Position.Legs)))

                return plays.map { play -> play.copy(card=card) }
            }
        }
    }
}