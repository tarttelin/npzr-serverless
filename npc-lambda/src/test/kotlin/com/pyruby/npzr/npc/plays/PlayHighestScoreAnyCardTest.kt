package com.pyruby.npzr.npc.plays

import com.pyruby.npzr.npc.GameMaker
import com.pyruby.npzr.npc.GameMaker.Companion.card
import com.pyruby.npzr.npc.GameMaker.Companion.stack
import com.pyruby.npzr.npc.model.Character
import com.pyruby.npzr.npc.model.Character.Ninja
import com.pyruby.npzr.npc.model.Character.Robot
import com.pyruby.npzr.npc.model.Position.Head
import com.pyruby.npzr.npc.model.Position.Legs
import org.amshove.kluent.`should be equal to`
import org.amshove.kluent.`should be`
import org.amshove.kluent.`should not be equal to`
import org.junit.jupiter.api.TestInstance
import kotlin.test.Test
import com.pyruby.npzr.npc.model.Character.Wild as WildCharacter
import com.pyruby.npzr.npc.model.Position.Wild as WildPosition

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
internal class PlayHighestScoreAnyCardTest {

    @Test
    fun `play the second card in hand onto the empty stack in the head position given first card wild second card ninja head`() {
        val expectedCard = card(Head, Ninja)
        val game = GameMaker()
                .playerStacks(stack(head=card(Head)))
                .playerHand(card(WildPosition, Ninja), expectedCard, card(), card())
                .readyToPlay()
        val strategy = PlayHighestScoreAnyCard()
        val play = strategy.playCard(game.players[1], game.players[0])!!
        play.card `should be` expectedCard
        play.stack `should be` game.players[1].stacks[1]
        play.position.name `should be equal to` Head.name
    }

    @Test
    fun `Play Robot wildcard given Ninja has been scored and hand only contains wild cards`() {
        val expectedCard = card(WildPosition, Character.Robot)
        val game = GameMaker()
                .playerStacks(stack(head=card(Head)))
                .playerHand(card(WildPosition, Ninja), expectedCard, card(WildPosition, WildCharacter))
                .playerScore(Ninja)
                .readyToPlay()
        val strategy = PlayHighestScoreAnyCard()
        val play = strategy.playCard(game.players[1], game.players[0])!!
        play.card `should be` expectedCard
        play.stack `should be` game.players[1].stacks[1]
        play.position.name `should not be equal to` WildPosition.name
    }

}