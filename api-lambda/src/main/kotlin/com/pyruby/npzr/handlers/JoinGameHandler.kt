package com.pyruby.npzr.handlers

import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.lambda.runtime.RequestHandler
import com.fasterxml.jackson.databind.ObjectMapper
import com.pyruby.npzr.GameRepository
import com.pyruby.npzr.LoggerDelegate
import com.pyruby.npzr.model.Game

class JoinGameHandler(val gameRepo: GameRepository = GameRepository.gameRepo): RequestHandler<JoinGameRequest, Game> {
    private val logger by LoggerDelegate()

    override fun handleRequest(req: JoinGameRequest, context: Context?): Game {
        logger.debug("request: " + ObjectMapper().writeValueAsString(req))
        val game = gameRepo.findGame(req.args.input.gameId)
        val updatedGame = game.join(req.identity)
        gameRepo.update(updatedGame)
        return updatedGame
    }
}

data class JoinGameRequest(var args: JoinGameInput = JoinGameInput(), var identity: String = "")
data class JoinGameInput(var input: JoinGameArgs = JoinGameArgs())
data class JoinGameArgs(var gameId: String = "")