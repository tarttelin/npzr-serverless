package com.pyruby.npzr.handlers

import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.lambda.runtime.RequestHandler
import com.fasterxml.jackson.databind.ObjectMapper
import com.pyruby.npzr.GameRepository
import com.pyruby.npzr.LoggerDelegate
import com.pyruby.npzr.model.Game

class CreateGameHandler(val gameRepo: GameRepository = GameRepository.gameRepo): RequestHandler<Map<String, Any>, Game> {
    private val logger by LoggerDelegate()

    override fun handleRequest(input: Map<String, Any>?, context: Context): Game {
        logger.debug("Create a new game")
        logger.debug("input: " + ObjectMapper().writeValueAsString(input))
        val game = gameRepo.createGame(input?.get("identity").toString())

        return game.copy(deck = emptyList())
    }
}