package com.pyruby.npzr.model

import com.pyruby.npzr.PlayException
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
        joinedGame.deck.size `should equal` initialGame.deck.size - 11
        joinedGame.players.map { player -> player.hand.size }.sum() `should equal` 11
    }

    @Test
    fun `Player 2 name is set when player joins the game`() {
        val initialGame = Game.createGame("bob", PlayerType.Player)
        val joinedGame = initialGame.join("bill")
        joinedGame.player2 `should equal` "bill"
    }

    @Test
    fun `One of the players playState is set to Draw when player 2 joins the game`() {
        val initialGame = Game.createGame("bob", PlayerType.Player)
        val joinedGame = initialGame.join("bill")
        joinedGame.players.filter{ p -> p.playState == PlayState.Play }.count() `should equal` 1
        joinedGame.players.filter{ p -> p.playState == PlayState.Wait }.count() `should equal` 1
    }

    @Test
    fun `A player can play a card from their hand onto a valid stack position`() {
        val pendingGame = Game.createGame("bob", PlayerType.Player)
        val initialGame = pendingGame.join("bill")
        val activePlayer = initialGame.activePlayer()!!
        activePlayer `should not be` null
        val cardToPlay = activePlayer.hand.get(0)
        cardToPlay.bodyPart = BodyPart.Head
        cardToPlay.characterType = CharacterType.Ninja
        val updatedGame = initialGame.playCard(activePlayer.userId!!, cardToPlay.id!!, activePlayer.stacks[0].id, BodyPart.Head)
        updatedGame.activePlayer()?.userId `should not equal` activePlayer.userId
        val originalPlayer = updatedGame.players.find { p -> p.userId == activePlayer.userId }!!
        originalPlayer.stacks[0].head[0] `should equal` cardToPlay
        originalPlayer.hand[0] `should not equal` cardToPlay
        originalPlayer.completed `should equal` emptyList()
        originalPlayer.stacks.size `should equal` 2
        originalPlayer.hand.size `should equal` 5
        originalPlayer.playState `should equal` PlayState.Wait
    }

    @Test
    fun `A player can play another card after playing a wild card`() {
        val pendingGame = Game.createGame("bob", PlayerType.Player)
        val initialGame = pendingGame.join("bill")
        val activePlayer = initialGame.activePlayer()!!
        activePlayer `should not be` null
        val cardToPlay = activePlayer.hand.get(0)
        cardToPlay.bodyPart = BodyPart.Head
        cardToPlay.characterType = CharacterType.Wild
        val updatedGame = initialGame.playCard(activePlayer.userId!!, cardToPlay.id!!, activePlayer.stacks[0].id, BodyPart.Head)
        updatedGame.activePlayer()?.userId `should equal` activePlayer.userId
        updatedGame.activePlayer()?.playState `should equal` PlayState.Play
    }

    @Test
    fun `A player cannot play a card from their hand onto an invalid stack position`() {
        val pendingGame = Game.createGame("bob", PlayerType.Player)
        val initialGame = pendingGame.join("bill")
        val activePlayer = initialGame.activePlayer()!!
        activePlayer `should not be` null
        val cardToPlay = activePlayer.hand.get(0)
        cardToPlay.bodyPart = BodyPart.Head
        cardToPlay.characterType = CharacterType.Ninja
        invoking { initialGame.playCard(activePlayer.userId!!, cardToPlay.id!!, activePlayer.stacks[0].id, BodyPart.Legs) } `should throw` PlayException::class
    }

    @Test
    fun `A player cannot play when it is not their turn`() {
        val pendingGame = Game.createGame("bob", PlayerType.Player)
        val initialGame = pendingGame.join("bill")
        val activePlayer = initialGame.activePlayer()!!
        val opponent = initialGame.players.find { it.userId != activePlayer.userId }!!
        val cardToPlay = opponent.hand.get(0)
        cardToPlay.bodyPart = BodyPart.Head
        cardToPlay.characterType = CharacterType.Ninja
        invoking { initialGame.playCard(opponent.userId!!, cardToPlay.id!!, opponent.stacks[0].id, BodyPart.Head) } `should throw` PlayException::class
    }

    @Test
    fun `A player cannot play a card that is not in their hand`() {
        val pendingGame = Game.createGame("bob", PlayerType.Player)
        val initialGame = pendingGame.join("bill")
        val activePlayer = initialGame.activePlayer()!!
        val cardToPlay = Card("unmatchedId", BodyPart.Head, CharacterType.Ninja)
        invoking { initialGame.playCard(activePlayer.userId!!, cardToPlay.id!!, activePlayer.stacks[0].id, BodyPart.Head) } `should throw` PlayException::class
    }

    @Test
    fun `A player cannot play a card on a non-existent stack`() {
        val pendingGame = Game.createGame("bob", PlayerType.Player)
        val initialGame = pendingGame.join("bill")
        val activePlayer = initialGame.activePlayer()!!
        val cardToPlay = activePlayer.hand[0]
        invoking { initialGame.playCard(activePlayer.userId!!, cardToPlay.id!!, "unmatchedId", BodyPart.Head) } `should throw` PlayException::class
    }

    @Test
    fun `A player can play a card from their hand onto a valid stack position on their opponent's stack`() {
        val pendingGame = Game.createGame("bob", PlayerType.Player)
        val initialGame = pendingGame.join("bill")
        val activePlayer = initialGame.activePlayer()!!
        val opponent = initialGame.players.find { it.userId != activePlayer.userId }!!
        val cardToPlay = activePlayer.hand[0]
        cardToPlay.bodyPart = BodyPart.Head
        cardToPlay.characterType = CharacterType.Ninja
        val updatedGame = initialGame.playCard(activePlayer.userId!!, cardToPlay.id!!, opponent.stacks[0].id, BodyPart.Head)
        updatedGame.activePlayer()?.userId `should not equal` activePlayer.userId
        val originalPlayer = updatedGame.activePlayer()!!
        originalPlayer.stacks[0].head[0] `should equal` cardToPlay
        originalPlayer.completed `should equal` emptyList()
        originalPlayer.stacks.size `should equal` 2
        originalPlayer.hand.size `should equal` 6
        originalPlayer.playState `should equal` PlayState.Play
    }

    @Test
    fun `Each player has one empty stack available`() {
        val pendingGame = Game.createGame("bob", PlayerType.Player)
        val initialGame = pendingGame.join("bill")
        val activePlayer = initialGame.activePlayer()!!
        val cardToPlay = activePlayer.hand.get(0)
        cardToPlay.bodyPart = BodyPart.Head
        cardToPlay.characterType = CharacterType.Ninja
        val updatedGame = initialGame.playCard(activePlayer.userId!!, cardToPlay.id!!, activePlayer.stacks[0].id, BodyPart.Head)
        val originalPlayer = updatedGame.players.find { p -> p.userId == activePlayer.userId }!!
        originalPlayer.stacks.size `should equal` 2
        updatedGame.activePlayer()!!.stacks.size `should equal` 1
    }

    @Test
    fun `When a player completes a stack then their play state changes to move`() {
        val pendingGame = Game.createGame("bob", PlayerType.Player)
        val initialGame = pendingGame.join("bill")
        val activePlayer = initialGame.activePlayer()!!
        activePlayer `should not be` null
        val cardToPlay = activePlayer.hand.get(0)
        cardToPlay.bodyPart = BodyPart.Head
        cardToPlay.characterType = CharacterType.Ninja
        val stack = activePlayer.stacks[0].play(Card("123", BodyPart.Torso, CharacterType.Ninja), BodyPart.Torso)
            .play(Card("323", BodyPart.Legs, CharacterType.Ninja), BodyPart.Legs)
        val expectedGame = initialGame.copy(players = listOf(activePlayer.copy(stacks = listOf(stack)), initialGame.players.find { p -> p.userId != activePlayer.userId }!!))
        val updatedGame = expectedGame.playCard(activePlayer.userId!!, cardToPlay.id!!, activePlayer.stacks[0].id, BodyPart.Head)
        updatedGame.activePlayer()?.userId `should equal` activePlayer.userId
        val originalPlayer = updatedGame.activePlayer()!!
        originalPlayer.playState `should equal` PlayState.Move
    }

    @Test
    fun `When a player completes their last character stack then their play state changes to winner`() {
        val pendingGame = Game.createGame("bob", PlayerType.Player)
        val initialGame = pendingGame.join("bill")
        val gameNearlyWon = initialGame.copy(players=initialGame.players.map {
            if (it.userId == initialGame.activePlayer()?.userId)
                initialGame.activePlayer()!!.copy(completed = listOf(CharacterType.Pirate, CharacterType.Zombie, CharacterType.Robot))
            else
                it
        })
        val activePlayer = gameNearlyWon.activePlayer()!!
        activePlayer `should not be` null
        val cardToPlay = activePlayer.hand.get(0)
        cardToPlay.bodyPart = BodyPart.Head
        cardToPlay.characterType = CharacterType.Ninja
        val stack = activePlayer.stacks[0].play(Card("123", BodyPart.Torso, CharacterType.Ninja), BodyPart.Torso)
            .play(Card("323", BodyPart.Legs, CharacterType.Ninja), BodyPart.Legs)
        val expectedGame = gameNearlyWon.copy(players = listOf(activePlayer.copy(stacks = listOf(stack)), gameNearlyWon.players.find { p -> p.userId != activePlayer.userId }!!))
        val updatedGame = expectedGame.playCard(activePlayer.userId!!, cardToPlay.id!!, activePlayer.stacks[0].id, BodyPart.Head)
        updatedGame.activePlayer()?.userId `should equal` activePlayer.userId
        val originalPlayer = updatedGame.activePlayer()!!
        originalPlayer.playState `should equal` PlayState.Winner
        val opponentPlayer = updatedGame.players.find { it.userId != originalPlayer.userId }!!
        opponentPlayer.playState `should equal` PlayState.Loser
    }

    @Test
    fun `When a player completes their own stack they score the completed character`() {
        val pendingGame = Game.createGame("bob", PlayerType.Player)
        val initialGame = pendingGame.join("bill")
        val activePlayer = initialGame.activePlayer()!!
        activePlayer `should not be` null
        val cardToPlay = activePlayer.hand.get(0)
        cardToPlay.bodyPart = BodyPart.Head
        cardToPlay.characterType = CharacterType.Ninja
        val stack = activePlayer.stacks[0].play(Card("123", BodyPart.Torso, CharacterType.Ninja), BodyPart.Torso)
            .play(Card("323", BodyPart.Legs, CharacterType.Ninja), BodyPart.Legs)
        val expectedGame = initialGame.copy(players = listOf(activePlayer.copy(stacks = listOf(stack)), initialGame.players.find { p -> p.userId != activePlayer.userId }!!))
        val updatedGame = expectedGame.playCard(activePlayer.userId!!, cardToPlay.id!!, activePlayer.stacks[0].id, BodyPart.Head)
        updatedGame.activePlayer()?.userId `should equal` activePlayer.userId
        val originalPlayer = updatedGame.players.find { p -> p.userId == activePlayer.userId }!!
        originalPlayer.stacks[0].head.size `should equal` 0
        updatedGame.discardPile.size `should equal` 3
        originalPlayer.completed `should equal` listOf(CharacterType.Ninja)
        originalPlayer.stacks.size `should equal` 1
        originalPlayer.playState `should equal` PlayState.Move
    }

    @Test
    fun `When a player completes a stack the cards on the stack are moved to the discard pile`() {
        val pendingGame = Game.createGame("bob", PlayerType.Player)
        val initialGame = pendingGame.join("bill")
        val activePlayer = initialGame.activePlayer()!!
        activePlayer `should not be` null
        val cardToPlay = activePlayer.hand.get(0)
        cardToPlay.bodyPart = BodyPart.Head
        cardToPlay.characterType = CharacterType.Ninja
        val stack = activePlayer.stacks[0].play(Card("123", BodyPart.Torso, CharacterType.Ninja), BodyPart.Torso)
            .play(Card("323", BodyPart.Legs, CharacterType.Ninja), BodyPart.Legs)
                .play(Card("334", BodyPart.Head, CharacterType.Pirate), BodyPart.Head)
        val expectedGame = initialGame.copy(players = listOf(activePlayer.copy(stacks = listOf(stack)), initialGame.players.find { p -> p.userId != activePlayer.userId }!!))
        val updatedGame = expectedGame.playCard(activePlayer.userId!!, cardToPlay.id!!, activePlayer.stacks[0].id, BodyPart.Head)
        updatedGame.activePlayer()?.userId `should equal` activePlayer.userId
        val originalPlayer = updatedGame.players.find { p -> p.userId == activePlayer.userId }!!
        originalPlayer.stacks[0].head.size `should equal` 0
        updatedGame.discardPile.size `should equal` 4
    }

    @Test
    fun `When a player completes an opponents stack the opponent scores the completed character`() {
        val pendingGame = Game.createGame("bob", PlayerType.Player)
        val initialGame = pendingGame.join("bill")
        val activePlayer = initialGame.activePlayer()!!
        val opponentPlayer = initialGame.players.find { it.userId != activePlayer.userId }!!
        val cardToPlay = activePlayer.hand.get(0)
        cardToPlay.bodyPart = BodyPart.Head
        cardToPlay.characterType = CharacterType.Ninja
        val stack = opponentPlayer.stacks[0].play(Card("123", BodyPart.Torso, CharacterType.Ninja), BodyPart.Torso)
            .play(Card("323", BodyPart.Legs, CharacterType.Ninja), BodyPart.Legs)
                .play(Card("334", BodyPart.Head, CharacterType.Pirate), BodyPart.Head)
        val expectedGame = initialGame.copy(players = listOf(opponentPlayer.copy(stacks = listOf(stack)), activePlayer))
        val updatedGame = expectedGame.playCard(activePlayer.userId!!, cardToPlay.id!!, opponentPlayer.stacks[0].id, BodyPart.Head)
        updatedGame.activePlayer()?.userId `should equal` activePlayer.userId
        val originalOpponent = updatedGame.players.find { p -> p.userId != activePlayer.userId }!!
        originalOpponent.stacks[0].head.size `should equal` 0
        originalOpponent.completed `should equal` listOf(CharacterType.Ninja)
    }

    @Test
    fun `When a player plays a wild card as the last card in their hand and does not complete a stack it is the opponent's turn`() {
        val pendingGame = Game.createGame("bob", PlayerType.Player)
        val initialGame = pendingGame.join("bill")
        val activePlayer = initialGame.activePlayer()!!
        val opponentPlayer = initialGame.players.find { it.userId != activePlayer.userId }!!
        val expectedGame = initialGame.copy(players = listOf(activePlayer.copy(hand=activePlayer.hand.subList(0,1)), opponentPlayer))
        val cardToPlay = activePlayer.hand.get(0)
        cardToPlay.bodyPart = BodyPart.Head
        cardToPlay.characterType = CharacterType.Wild
        val updatedGame = expectedGame.playCard(activePlayer.userId!!, cardToPlay.id!!, activePlayer.stacks[0].id, BodyPart.Head)
        updatedGame.activePlayer()?.userId `should equal` opponentPlayer.userId
        updatedGame.activePlayer()?.playState `should equal` PlayState.Play
    }

    @Test
    fun `When the last card is drawn from the deck, the discard pile is shuffled and becomes the deck`() {
        val pendingGame = Game.createGame("bob", PlayerType.Player)
        val initialGame = pendingGame.join("bill").copy(discardPile = pendingGame.deck, deck = emptyList())
        val activePlayer = initialGame.activePlayer()!!
        activePlayer `should not be` null
        val cardToPlay = activePlayer.hand.get(0)
        cardToPlay.bodyPart = BodyPart.Head
        cardToPlay.characterType = CharacterType.Ninja

        val updatedGame = initialGame.playCard(activePlayer.userId!!, cardToPlay.id!!, activePlayer.stacks[0].id, BodyPart.Head)

        updatedGame.deck.isEmpty() `should not be` true
        updatedGame.players.find { it.userId == activePlayer.userId }?.playState `should equal` PlayState.Wait
    }
}