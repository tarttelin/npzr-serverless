package com.pyruby.npzr.npc.plays

import com.pyruby.npzr.npc.GameMaker
import com.pyruby.npzr.npc.GameMaker.Companion.card
import com.pyruby.npzr.npc.GameMaker.Companion.stack
import com.pyruby.npzr.npc.model.Character
import com.pyruby.npzr.npc.model.Position
import org.amshove.kluent.`should be equal to`
import org.amshove.kluent.`should be`
import kotlin.test.Test
import org.junit.jupiter.api.TestInstance

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class PlayMatchingCharacterOnExistingStackTest {

    @Test
    fun `play the second card in hand onto the stack in the head position given first card wild second card pirate head`() {
        val expectedCard = card(Position.Head, Character.Ninja)
        val game = GameMaker()
                .playerStacks(stack(torso = card(Position.Torso, Character.Ninja)), stack(head=card(Position.Head, Character.Robot)))
                .playerHand(card(Position.Wild, Character.Ninja), expectedCard, card(Position.Legs, Character.Zombie))
                .readyToPlay()
        val strategy = PlayMatchingCharacterOnExistingStack()
        val play = strategy.playCard(game.players[1], game.players[0])!!
        play.card `should be` expectedCard
        play.stack `should be` game.players[1].stacks[0]
        play.position.name `should be equal to` Position.Head.name
    }

    @Test
    fun `play the wild card in hand onto the stack in the torso position given only wildcard matches`() {
        val expectedCard = card(Position.Wild, Character.Ninja)
        val game = GameMaker()
                .playerStacks(stack(head = card(Position.Head, Character.Ninja)), stack(head=card(Position.Head, Character.Robot)))
                .playerHand(card(Position.Head, Character.Ninja), expectedCard, card(Position.Legs, Character.Zombie))
                .readyToPlay()
        val strategy = PlayMatchingCharacterOnExistingStack()
        val play = strategy.playCard(game.players[1], game.players[0])!!
        play.card `should be` expectedCard
        play.stack `should be` game.players[1].stacks[0]
        play.position.name `should be equal to` Position.Torso.name
    }

    @Test
    fun `play the ninja head card in hand onto the stack in the head position given robot already scored`() {
        val expectedCard = card(Position.Torso, Character.Ninja)
        val game = GameMaker()
                .playerStacks(stack(head = card(Position.Head, Character.Ninja)), stack(head=card(Position.Head, Character.Robot)))
                .playerHand(card(Position.Torso, Character.Robot), expectedCard, card(Position.Legs, Character.Zombie))
                .playerScore(Character.Robot)
                .readyToPlay()
        val strategy = PlayMatchingCharacterOnExistingStack()
        val play = strategy.playCard(game.players[1], game.players[0])!!
        play.card `should be` expectedCard
        play.stack `should be` game.players[1].stacks[0]
        play.position.name `should be equal to` Position.Torso.name
    }

    @Test
    fun `No play made given no cards match existing stacks`() {
        val game = GameMaker()
                .playerStacks(stack(head = card(Position.Head, Character.Ninja)), stack(head=card(Position.Head, Character.Robot)))
                .playerHand(card(Position.Head, Character.Robot), card(Position.Torso, Character.Pirate), card(Position.Legs, Character.Zombie))
                .playerScore(Character.Robot)
                .readyToPlay()
        val strategy = PlayMatchingCharacterOnExistingStack()
        val play = strategy.playCard(game.players[1], game.players[0])
        play `should be` null
    }

    @Test
    fun `Does not play a second head on top of existing head when matching another body part of a character on a stack`() {
        val game = GameMaker()
                .playerStacks(stack(head=card(Position.Head, Character.Ninja), torso = card(Position.Torso, Character.Ninja)), stack(head=card(Position.Head, Character.Robot)))
                .playerHand(card(Position.Head, Character.Ninja), card(Position.Legs, Character.Zombie))
                .readyToPlay()
        val strategy = PlayMatchingCharacterOnExistingStack()
        val play = strategy.playCard(game.players[1], game.players[0])
        play `should be` null
    }
}