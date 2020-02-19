package com.pyruby.npzr.npc

import com.amazonaws.services.lambda.runtime.events.SQSEvent
import io.mockk.clearMocks
import io.mockk.every
import io.mockk.mockk
import org.amshove.kluent.`should be equal to`
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.TestInstance
import kotlin.test.Test

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
internal class NpcPlayerHandlerTest {

    private val playCard: PlayCardCall = mockk<PlayCardCall>()
    private val player = NpcPlayerHandler(playCard)

    @BeforeEach
    fun init() {
        clearMocks(playCard)
    }

    @Test
    fun playCard() {
        val content = SQSEvent.SQSMessage()
        content.body = ""
        val msg = SQSEvent()
        msg.records = listOf(content)
        player.handleRequest(msg, null)
    }
}