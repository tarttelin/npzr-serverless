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
internal class MoveHighestScoreAnyCardTest {

    @Test
    fun `Prefer wild card to non-wild`() {
        val expectedCard = card(Position.Head, Character.Wild)
        val game = GameMaker()
                .playerStacks(stack(head = card(Position.Head)))
                .opponentStacks(stack(head=card(Position.Legs, Character.Ninja)), stack(head=expectedCard))
                .playerHand(card(Position.Wild, Character.Ninja), expectedCard, card(), card())
                .readyToMove()
        val strategy = MoveHighestScoreAnyCard()
        val play = strategy.moveCard(game.players[1], game.players[0])!!
        play.card `should be` expectedCard
        play.stack `should be` game.players[1].stacks[1]
        play.position.name `should be equal to` Position.Head.name
    }

    @Test
    fun `Prefer card for a character player has not yet completed`() {
        val expectedCard = card(Position.Torso, Character.Ninja)
        val game = GameMaker()
                .playerStacks(stack(head = card(Position.Head)))
                .opponentStacks(stack(head=card(Position.Head, Character.Robot)), stack(), stack(torso=expectedCard))
                .playerHand(card(Position.Wild, Character.Ninja), expectedCard, card(), card())
                .playerScore(Character.Robot)
                .readyToMove()
        val strategy = MoveHighestScoreAnyCard()
        val play = strategy.moveCard(game.players[1], game.players[0])!!
        play.card `should be` expectedCard
        play.stack `should be` game.players[1].stacks[1]
        play.position.name `should be equal to` Position.Torso.name
    }

    @Test
    fun `Prefer card for a character opponent has not yet completed`() {
        val expectedCard = card(Position.Torso, Character.Pirate)
        val game = GameMaker()
                .playerStacks(stack(head = card(Position.Head)))
                .opponentStacks(stack(torso=expectedCard), stack(head=card(Position.Head, Character.Ninja)), stack())
                .playerHand(card(Position.Wild, Character.Ninja), expectedCard, card(), card())
                .opponentScore(Character.Robot)
                .readyToMove()
        val strategy = MoveHighestScoreAnyCard()
        val play = strategy.moveCard(game.players[1], game.players[0])!!
        play.card `should be` expectedCard
        play.stack `should be` game.players[1].stacks[1]
        play.position.name `should be equal to` Position.Torso.name
    }
}