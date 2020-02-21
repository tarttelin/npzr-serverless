package com.pyruby.npzr.npc.plays

import com.pyruby.npzr.npc.GameMaker
import com.pyruby.npzr.npc.GameMaker.Companion.card
import com.pyruby.npzr.npc.GameMaker.Companion.stack
import com.pyruby.npzr.npc.model.Character.*
import com.pyruby.npzr.npc.model.Position.*
import org.amshove.kluent.`should be equal to`
import org.amshove.kluent.`should be`
import org.junit.jupiter.api.TestInstance
import kotlin.test.Test
import com.pyruby.npzr.npc.model.Character.Wild as WildCharacter
import com.pyruby.npzr.npc.model.Position.Wild as WildPosition

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
internal class PlayToCompleteStackTest {

    @Test
    fun `given a non-wild card will complete a stack then the non-wild card is played`() {
        val expectedCard = card(Legs, Pirate)
        val game = GameMaker()
                .playerStacks(
                        stack(head=card(WildPosition, Ninja), torso=card(Torso, Ninja)),
                        stack(head=card(Head, Pirate), torso=card(Torso, Pirate))
                )
                .playerHand(card(WildPosition, Ninja), expectedCard, card(Torso, Robot))
                .readyToPlay()
        val strategy = PlayToCompleteStack()
        val play = strategy.playCard(game.players[1], game.players[0])!!
        play.card `should be` expectedCard
        play.stack `should be` game.players[1].stacks[1]
        play.position.name `should be equal to` Legs.name
    }

    @Test
    fun `given only a wild card will complete a stack then the wild card is played`() {
        val expectedCard = card(Legs, WildCharacter)
        val game = GameMaker()
                .playerStacks(
                        stack(head=card(WildPosition, Ninja), torso=card(Torso, Robot)),
                        stack(head=card(Head, Pirate), torso=card(Torso, Pirate))
                )
                .playerHand(card(Head, Ninja), expectedCard, card(Torso, Pirate))
                .readyToPlay()
        val strategy = PlayToCompleteStack()
        val play = strategy.playCard(game.players[1], game.players[0])!!
        play.card `should be` expectedCard
        play.stack `should be` game.players[1].stacks[1]
        play.position.name `should be equal to` Legs.name
    }

    @Test
    fun `given a stack cannot be completed with cards in hand no play is returned`() {
        val game = GameMaker()
                .playerStacks(
                        stack(head=card(WildPosition, Ninja), torso=card(Torso, Ninja)),
                        stack(head=card(Head, Pirate))
                )
                .playerHand(card(Head, Ninja), card(Torso, Ninja), card(WildPosition, Robot))
                .readyToPlay()
        val strategy = PlayToCompleteStack()
        val playToMake = strategy.playCard(game.players[1], game.players[0])
        playToMake `should be` null
    }

    @Test
    fun `move card to complete character`() {
        val expectedCard = card(Legs, Pirate)
        val game = GameMaker()
                .playerStacks(
                        stack(head=card(WildPosition, Ninja), torso=card(Torso, Ninja)),
                        stack(head=card(Head, Pirate), torso=card(Torso, Pirate))
                )
                .playerHand(card(WildPosition, Ninja), card(Torso, Robot))
                .opponentStacks(stack(head=card(Head, Zombie)), stack(torso=card(Torso, Pirate), legs=expectedCard))
                .readyToMove()
        val strategy = PlayToCompleteStack()
        val play = strategy.moveCard(game.players[1], game.players[0])!!
        play.card `should be` expectedCard
        play.stack `should be` game.players[1].stacks[1]
        play.position.name `should be equal to` Legs.name
    }

    @Test
    fun `no move suggested given no card to complete character`() {
        val game = GameMaker()
                .playerStacks(
                        stack(head=card(WildPosition, Ninja), torso=card(Torso, Ninja)),
                        stack(head=card(Head, Pirate), torso=card(Torso, Pirate))
                )
                .playerHand(card(WildPosition, Ninja), card(Torso, Robot))
                .opponentStacks(stack(head=card(Head, Zombie)), stack(torso=card(Torso, Pirate)))
                .readyToMove()
        val strategy = PlayToCompleteStack()
        val play = strategy.moveCard(game.players[1], game.players[0])
        play `should be` null
    }

}