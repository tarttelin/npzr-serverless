package com.pyruby.npzr.model

import org.amshove.kluent.`should be equal to`
import kotlin.test.Test


class GameTest {

    @Test
    fun `createGame should set the game deck to a shuffled set of 56 cards`() {
        val game = Game.createGame("bob", PlayerType.Player)
        game.deck.size `should be equal to` 56
    }

    @Test
    fun `deck should contain 4 of each non wild card`() {
        val game = Game.createGame("bob", PlayerType.Player)
        val cardGroups = game.deck
                .filter { c -> c.bodyPart != BodyPart.Wild && c.characterType != CharacterType.Wild }
                .groupBy { c -> Pair(c.bodyPart, c.characterType) }
        cardGroups.keys.size `should be equal to` 12
        cardGroups.values.forEach { pile -> pile.size `should be equal to` 4 }
    }

    @Test
    fun `deck should contain 1 of each wild card`() {
        val game = Game.createGame("bob", PlayerType.Player)
        val cardGroups = game.deck
                .filter { c -> c.bodyPart == BodyPart.Wild || c.characterType == CharacterType.Wild }
                .groupBy { c -> Pair(c.bodyPart, c.characterType) }
        cardGroups.keys.size `should be equal to` 8
        cardGroups.values.forEach { pile -> pile.size `should be equal to` 1 }
    }

    @Test
    fun `deck should be shuffled`() {
        val deck1 = Game.createGame("bob", PlayerType.Player).deck
        val deck2 = Game.createGame("bob", PlayerType.Player).deck

        val orderIsDifferent = (0..(deck1.size - 1)).any {idx ->
            deck1[idx].id != deck2[idx].id
        }

        orderIsDifferent `should be equal to` true
    }

    @Test
    fun `Game should contain 2 players, one of which has a userId`() {
        val game = Game.createGame("bob", PlayerType.Player)
        game.players.size `should be equal to` 2
        game.players[0].userId !! `should be equal to` "bob"
        game.players[1].userId.orEmpty() `should be equal to` ""
    }

    @Test
    fun `Each player starts with a single empty stack`() {
        val game = Game.createGame("bob", PlayerType.Player)
        (0..1).forEach { idx ->
            game.players[idx].stacks.size `should be equal to` 1
            game.players[idx].stacks[0].head.size `should be equal to` 0
            game.players[idx].stacks[0].torso.size `should be equal to` 0
            game.players[idx].stacks[0].legs.size `should be equal to` 0
        }
    }
}