package com.pyruby.npzr

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper
import com.pyruby.npzr.model.DBMapper
import com.pyruby.npzr.model.Game
import com.pyruby.npzr.model.PlayerType

class GameRepository(val mapper: DynamoDBMapper) {

    fun findGame(gameId: String) : Game {
        val game = mapper.load(Game::class.java, gameId)
        return game
    }

    fun createGame(user: String): Game {
        val game = Game.createGame(user, PlayerType.Player)
        mapper.save(game)
        return game
    }

    companion object {
        val gameRepo: GameRepository by lazy {
            GameRepository(DBMapper.mapper)
        }
    }

}
