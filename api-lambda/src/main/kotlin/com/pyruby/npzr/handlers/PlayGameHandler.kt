package com.pyruby.npzr.handlers

import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.lambda.runtime.RequestHandler
import com.pyruby.npzr.GameRepository
import com.pyruby.npzr.model.BodyPart
import com.pyruby.npzr.model.Game

class PlayGameHandler(val gameRepo: GameRepository = GameRepository.gameRepo): RequestHandler<PlayGameRequest, Game> {
    override fun handleRequest(req: PlayGameRequest, context: Context?): Game {
        val game = gameRepo.findGame(req.args.input.gameId)
        val updatedGame = game.playCard(req.identity, req.args.input.cardId, req.args.input.stackId, req.args.input.position)
        gameRepo.update(updatedGame)
        return updatedGame
    }
}

data class PlayGameRequest(var args: PlayGameInput = PlayGameInput(), var identity: String = "")
data class PlayGameInput(var input: PlayGameArgs = PlayGameArgs())
data class PlayGameArgs(var gameId: String = "",
                        var cardId: String = "",
                        var stackId: String = "",
                        var position: BodyPart = BodyPart.Wild)