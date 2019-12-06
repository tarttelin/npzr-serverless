package com.pyruby.npzr.handlers

import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.lambda.runtime.RequestHandler
import com.pyruby.npzr.GameRepository
import com.pyruby.npzr.model.Game

class JoinGameHandler(val gameRepo: GameRepository = GameRepository.gameRepo): RequestHandler<Map<String, Any>, Game> {
    override fun handleRequest(input: Map<String, Any>?, context: Context?): Game {
        val args = input?.get("args") as Map<String, Map<String, String>>
        val game = gameRepo.findGame(args["input"]?.get("gameId") !!)
        val updatedGame = game.join(input?.get("identity").toString())
        gameRepo.update(updatedGame)
        return updatedGame
    }
}