package com.pyruby.npzr.npc.moves

import com.pyruby.npzr.npc.GameMaker
import com.pyruby.npzr.npc.GameMaker.Companion.card
import com.pyruby.npzr.npc.GameMaker.Companion.stack
import com.pyruby.npzr.npc.model.Character
import com.pyruby.npzr.npc.model.Position
import org.amshove.kluent.`should be equal to`
import org.amshove.kluent.`should be`
import org.junit.jupiter.api.TestInstance
import kotlin.test.Test

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
internal class MoveMatchingCharacterToExistingStackTest {

    @Test
    fun `move opponent card to add to an existing character on players stack`() {
        val expectedCard = card(Position.Head, Character.Ninja)
        val game = GameMaker()
                .playerStacks(stack(torso = card(Position.Torso, Character.Ninja)), stack(head = card(Position.Head, Character.Robot)))
                .playerHand(card(Position.Wild, Character.Ninja), card(Position.Legs, Character.Zombie))
                .opponentStacks(stack(torso=card(Position.Torso, Character.Pirate)), stack(head=expectedCard, torso=card(Position.Torso, Character.Ninja)))
                .readyToMove()
        val strategy = MoveMatchingCharacterToExistingStack()
        val play = strategy.moveCard(game.players[1], game.players[0])!!
        play.card `should be` expectedCard
        play.stack `should be` game.players[1].stacks[0]
        play.position.name `should be equal to` Position.Head.name
    }

    @Test
    fun `move card that for character opponent has not completed given multiple cards match players stacks`() {
        val expectedCard = card(Position.Torso, Character.Robot)
        val game = GameMaker()
                .playerStacks(stack(torso = card(Position.Torso, Character.Ninja)), stack(head = card(Position.Head, Character.Robot)))
                .playerHand(card(Position.Wild, Character.Ninja), card(Position.Legs, Character.Zombie))
                .opponentStacks(stack(torso=card(Position.Torso, Character.Pirate)),
                        stack(head=card(Position.Head, Character.Ninja), torso=card(Position.Torso, Character.Ninja)),
                        stack(torso=expectedCard))
                .opponentScore(Character.Ninja)
                .readyToMove()
        val strategy = MoveMatchingCharacterToExistingStack()
        val play = strategy.moveCard(game.players[1], game.players[0])!!
        play.card `should be` expectedCard
        play.stack `should be` game.players[1].stacks[1]
        play.position.name `should be equal to` Position.Torso.name
    }

    @Test
    fun `move card that for character player has not completed given multiple cards match players stacks`() {
        val expectedCard = card(Position.Torso, Character.Robot)
        val game = GameMaker()
                .playerStacks(stack(torso = card(Position.Torso, Character.Ninja)), stack(head = card(Position.Head, Character.Robot)))
                .playerHand(card(Position.Wild, Character.Ninja), card(Position.Legs, Character.Zombie))
                .opponentStacks(stack(torso=card(Position.Torso, Character.Pirate)),
                        stack(head=card(Position.Head, Character.Ninja), torso=card(Position.Torso, Character.Ninja)),
                        stack(torso=expectedCard))
                .playerScore(Character.Ninja)
                .opponentScore(Character.Robot)
                .readyToMove()
        val strategy = MoveMatchingCharacterToExistingStack()
        val play = strategy.moveCard(game.players[1], game.players[0])!!
        play.card `should be` expectedCard
        play.stack `should be` game.players[1].stacks[1]
        play.position.name `should be equal to` Position.Torso.name
    }

    @Test
    fun `no move suggested given no new cards match players stacks`() {
        val game = GameMaker()
                .playerStacks(stack(torso = card(Position.Torso, Character.Ninja)), stack(head = card(Position.Head, Character.Robot)))
                .playerHand(card(Position.Wild, Character.Ninja), card(Position.Legs, Character.Zombie))
                .opponentStacks(stack(torso=card(Position.Torso, Character.Pirate)),
                        stack(head=card(Position.Head, Character.Pirate), torso=card(Position.Torso, Character.Ninja)))
                .playerScore(Character.Ninja)
                .opponentScore(Character.Robot)
                .readyToMove()
        val strategy = MoveMatchingCharacterToExistingStack()
        val play = strategy.moveCard(game.players[1], game.players[0])
        play `should be` null
    }
}