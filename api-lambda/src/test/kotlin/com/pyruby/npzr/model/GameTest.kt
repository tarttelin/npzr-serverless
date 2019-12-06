package com.pyruby.npzr.model

import org.amshove.kluent.*
import org.junit.jupiter.api.DynamicTest
import org.junit.jupiter.api.TestFactory
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

    @TestFactory
    fun `User can only join a valid game`() = listOf(
            Game.createGame("bob", PlayerType.AI) to false,
            Game.createGame("bob", PlayerType.Player).copy(players=listOf(Player("bob", PlayerType.Player), Player("bill", PlayerType.Player))) to false,
            Game.createGame("bob", PlayerType.Player) to true
        ).map { (input, expected) ->
            DynamicTest.dynamicTest("Given game can be joined $expected") {
                if (expected) {
                    invoking { input.join("terry") } shouldNotThrow AnyException
                } else {
                    invoking { input.join("terry") } shouldThrow AnyException
                }
            }
    }

    @Test
    fun `Cards are dealt to each player when someone joins a game`() {
        val initialGame = Game.createGame("bob", PlayerType.Player)
        val joinedGame = initialGame.join("bill")
        joinedGame.deck.size `should equal` initialGame.deck.size - 10
        joinedGame.players.forEach { player -> player.hand.size `should equal` 5 }
    }

    @Test
    fun `Player 2 name is set when player joins the game`() {
        val initialGame = Game.createGame("bob", PlayerType.Player)
        val joinedGame = initialGame.join("bill")
        joinedGame.player2 `should equal` "bill"
    }

    @Test
    fun `Player 1 playState is set to Draw when player 2 joins the game`() {
        val initialGame = Game.createGame("bob", PlayerType.Player)
        val joinedGame = initialGame.join("bill")
        joinedGame.players[0].playState `should equal` PlayState.Draw
        joinedGame.players[1].playState `should equal` PlayState.Wait
    }
}