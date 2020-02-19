package com.pyruby.npzr.npc.plays

import com.pyruby.npzr.npc.GameMaker
import com.pyruby.npzr.npc.GameMaker.Companion.card
import com.pyruby.npzr.npc.GameMaker.Companion.stack
import com.pyruby.npzr.npc.model.Character.Ninja
import com.pyruby.npzr.npc.model.Position.Head
import com.pyruby.npzr.npc.model.Position.Legs
import org.amshove.kluent.`should be equal to`
import org.amshove.kluent.`should be`
import org.junit.jupiter.api.TestInstance
import kotlin.test.Test
import com.pyruby.npzr.npc.model.Character.Wild as WildCharacter
import com.pyruby.npzr.npc.model.Position.Wild as WildPosition

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
internal class PlayFirstNonWildTest {

    @Test
    fun `play the second card in hand onto the empty stack in the head position given first card wild second card pirate head`() {
        val expectedCard = card(Head, Ninja)
        val game = GameMaker()
                .playerStacks(stack(head=card(Head)))
                .playerHand(card(WildPosition, Ninja), expectedCard, card(), card())
                .readyToPlay()
        val strategy = PlayFirstNonWild()
        val play = strategy.playCard(game.players[1], game.players[0])!!
        play.card `should be` expectedCard
        play.stack `should be` game.players[1].stacks[1]
        play.position.name `should be equal to` Head.name
    }

    @Test
    fun `No card to play given hand only contains wild cards`() {
        val game = GameMaker()
                .playerStacks(stack(head=card(Head)))
                .playerHand(card(WildPosition, Ninja), card(Legs, WildCharacter), card(WildPosition, WildCharacter))
                .readyToPlay()
        val strategy = PlayFirstNonWild()
        val proposedMove = strategy.playCard(game.players[1], game.players[0])
        proposedMove `should be` null
    }

}