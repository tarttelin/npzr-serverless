package com.pyruby.npzr.npc

import com.amazonaws.services.lambda.runtime.events.SQSEvent
import com.fasterxml.jackson.databind.ObjectMapper
import com.pyruby.npzr.npc.GameMaker.Companion.card
import com.pyruby.npzr.npc.model.Character
import com.pyruby.npzr.npc.model.Position
import io.mockk.clearMocks
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.amshove.kluent.`should be equal to`
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.TestInstance
import kotlin.test.Test

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
internal class NpcPlayerHandlerTest {

    private val playCard: PlayCardCall = mockk(relaxed = true)
    private val player = NpcPlayerHandler(playCard)

    @BeforeEach
    fun init() {
        clearMocks(playCard)
    }

    @Test
    fun playCard() {
        val content = SQSEvent.SQSMessage()
        val expected = card(Position.Torso, Character.Ninja)
        val game = GameMaker()
                .playerHand(expected)
                .readyToPlay()
        content.body = ObjectMapper().writeValueAsString(game)
        val msg = SQSEvent()
        msg.records = listOf(content)

        player.handleRequest(msg, null)

        verify { playCard(game.id, expected.id, game.players[1].stacks.last().id, expected.bodyPart) }
    }
}