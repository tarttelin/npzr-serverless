package com.pyruby.npzr.npc.plays

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
internal class PlayCharacterWildTest {

    @Test
    fun `play ninja wild on torso given ninja head on stack and wild ninja and ninja legs in hand`() {
        val expectedCard = card(Position.Wild, Character.Ninja)
        val game = GameMaker()
                .playerStacks(stack(head = card(Position.Head, Character.Ninja)), stack(head=card(Position.Head, Character.Robot)))
                .playerHand(card(Position.Legs, Character.Ninja), expectedCard, card(Position.Head))
                .readyToPlay()
        val strategy = PlayCharacterWild()
        val play = strategy.playCard(game.players[1], game.players[0])!!
        play.card `should be` expectedCard
        play.stack `should be` game.players[1].stacks[0]
        play.position.name `should be equal to` Position.Torso.name
    }

    @Test
    fun `play ninja legs on empty stack given wild ninja and ninja legs in hand and no ninja head or torso on a stack`() {
        val expectedCard = card(Position.Legs, Character.Ninja)
        val game = GameMaker()
                .playerStacks(stack(head = card(Position.Head, Character.Pirate)), stack(head=card(Position.Head, Character.Robot)))
                .playerHand(card(Position.Wild, Character.Ninja), expectedCard, card(Position.Head))
                .readyToPlay()
        val strategy = PlayCharacterWild()
        val play = strategy.playCard(game.players[1], game.players[0])!!
        play.card `should be` expectedCard
        play.stack `should be` game.players[1].stacks.last()
        play.position.name `should be equal to` Position.Legs.name
    }

    @Test
    fun `play nothing given no character wild`() {
        val game = GameMaker()
                .playerStacks(stack(head = card(Position.Head, Character.Ninja)), stack(head=card(Position.Head, Character.Robot)))
                .playerHand(card(Position.Torso, Character.Ninja), card(Position.Legs, Character.Ninja), card(Position.Head))
                .readyToPlay()
        val strategy = PlayCharacterWild()
        val play = strategy.playCard(game.players[1], game.players[0])
        play `should be` null
    }

    @Test
    fun `play nothing given no card in hand matching character wild`() {
        val game = GameMaker()
                .playerStacks(stack(head = card(Position.Head, Character.Ninja)), stack(head=card(Position.Head, Character.Robot)))
                .playerHand(card(Position.Wild, Character.Ninja), card(Position.Legs, Character.Robot), card(Position.Head, Character.Pirate))
                .readyToPlay()
        val strategy = PlayCharacterWild()
        val play = strategy.playCard(game.players[1], game.players[0])
        play `should be` null
    }
}