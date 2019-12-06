package com.pyruby.npzr.handlers

import com.amazonaws.services.lambda.runtime.Context
import com.pyruby.npzr.GameRepository
import com.pyruby.npzr.model.Game
import com.pyruby.npzr.model.PlayerType
import io.mockk.clearMocks
import io.mockk.every
import io.mockk.mockk
import org.amshove.kluent.`should be equal to`
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.TestInstance
import kotlin.test.Test

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
internal class CreateGameHandlerTest {
    private val repo = mockk<GameRepository>()
    private val handler = CreateGameHandler(repo)
    private val context = mockk<Context>()

    @BeforeEach
    fun init() {
        clearMocks(repo, context)
    }

    @Test
    fun `Create game delegates to the repository`() {
        val createdGame = Game.createGame("bob", opponent = PlayerType.Player)
        every { repo.createGame("userId12", PlayerType.Player) } returns createdGame

        val game = handler.handleRequest(mapOf("args" to mapOf("input" to mapOf("opponent" to "Player")), "identity" to "userId12"), context)
        game.players[0].userId !! `should be equal to` "bob"
    }

}