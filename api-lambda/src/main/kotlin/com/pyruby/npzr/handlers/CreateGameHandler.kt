package com.pyruby.npzr.handlers

import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.lambda.runtime.RequestHandler
import com.fasterxml.jackson.databind.ObjectMapper
import com.pyruby.npzr.GameRepository
import com.pyruby.npzr.LoggerDelegate
import com.pyruby.npzr.NotifyNPC
import com.pyruby.npzr.model.Game
import com.pyruby.npzr.model.PlayerType

class CreateGameHandler(val gameRepo: GameRepository = GameRepository.gameRepo,
                        val notifyNPC: NotifyNPC = NotifyNPC.notifier): RequestHandler<CreateGameRequest, Game> {
    private val logger by LoggerDelegate()

    override fun handleRequest(req: CreateGameRequest, context: Context): Game {
        logger.debug("request: " + ObjectMapper().writeValueAsString(req))
        val game = gameRepo.createGame(req.identity, req.args.input.opponent)
        notifyNPC.npcPlayerTurn(game)
        return game.copy(deck = emptyList())
    }
}


data class CreateGameRequest(var args: CreateGameInput = CreateGameInput(), var identity: String = "")
data class CreateGameInput(var input: CreateGameArgs = CreateGameArgs())
data class CreateGameArgs(var opponent: PlayerType = PlayerType.Player)