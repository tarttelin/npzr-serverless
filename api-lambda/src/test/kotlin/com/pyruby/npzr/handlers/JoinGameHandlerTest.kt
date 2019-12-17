package com.pyruby.npzr.handlers

import com.amazonaws.services.lambda.runtime.Context
import com.pyruby.npzr.GameRepository
import com.pyruby.npzr.model.Game
import com.pyruby.npzr.model.PlayerType
import io.mockk.*
import org.amshove.kluent.`should be equal to`
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class JoinGameHandlerTest {
    private val repo = mockk<GameRepository>()
    private val handler = JoinGameHandler(repo)
    private val context = mockk<Context>()

    @BeforeEach
    fun init() {
        clearMocks(repo, context)
    }

    @Test
    fun `Join game loads game from repo, joins the game, updates it and returns the result`() {
        val existing = Game.createGame("bob", opponent = PlayerType.Player)
        val slot = slot<Game>()
        every { repo.findGame("gameId12") } returns existing
        every { repo.update(capture(slot)) } answers { slot.captured }

        val game = handler.handleRequest(JoinGameRequest(args = JoinGameInput(JoinGameArgs("gameId12")), identity = "userId12"), context)
        game.players[1].userId !! `should be equal to` "userId12"

        verify { repo.update(game) }
    }

}