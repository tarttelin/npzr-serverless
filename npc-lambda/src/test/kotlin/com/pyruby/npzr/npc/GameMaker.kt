package com.pyruby.npzr.npc

import com.pyruby.npzr.npc.model.*
import kotlin.random.Random

class GameMaker {

    private var _playerHand = listOf(card(), card(), card(), card(), card())
    var opponentHand = listOf(card(), card(), card(), card(), card())
    private var _playerStacks: List<Stack> = listOf(Stack("Stack", emptyList(), "10", emptyList(), emptyList()))
    var opponentStacks: List<Stack> = listOf(Stack("Stack", emptyList(), "20", emptyList(), emptyList()))
    var playerCompleted: List<Character> = emptyList()
    var opponentCompleted: List<Character> = emptyList()
    var discardPile: List<Card> = emptyList()

    fun readyToPlay() = Game("Game", discardPile, "123", listOf(
            Player("Player", opponentCompleted, opponentHand, "Wait", "Player", opponentStacks, "Joe"),
            Player("Player", playerCompleted, _playerHand, "Play", "AI", _playerStacks, "Robot")
    ))

    fun readyToMove() = Game("Game", discardPile, "123", listOf(
            Player("Player", opponentCompleted, opponentHand, "Wait", "Player", opponentStacks, "Joe"),
            Player("Player", playerCompleted, _playerHand, "Move", "AI", _playerStacks, "Robot")
    ))

    fun playerHand(vararg cards: Card) = apply { _playerHand = cards.toList() }

    fun playerStacks(vararg stacks: Stack) = apply {
        _playerStacks = stacks.toList().plus(Stack("Stack", emptyList(), "10", emptyList(), emptyList()))
    }

    fun playerScore(vararg characters: Character) = apply { playerCompleted = characters.toList() }

    companion object {
        private var stackCount = 1
        fun card(position: Position? =  null, character: Character? = null) = Card("Card", position ?: randomPosition(), character ?: randomCharacter(), Random.nextInt().toString())
        fun stack(head: Card? = null, torso: Card? = null, legs: Card? = null) = Stack("Stack",
                id=(stackCount++).toString(),
                head=if (head != null) listOf(head) else emptyList(),
                torso=if (torso != null) listOf(torso) else emptyList(),
                legs=if (legs != null) listOf(legs) else emptyList()
                )
        private fun randomPosition() = Position.values()[Random.nextInt(0, Position.values().size)]
        private fun randomCharacter() = Character.values()[Random.nextInt(0, Character.values().size)]
    }

}