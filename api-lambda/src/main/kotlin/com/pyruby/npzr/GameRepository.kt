package com.pyruby.npzr

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapperConfig
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBSaveExpression
import com.pyruby.npzr.model.DBMapper
import com.pyruby.npzr.model.Game
import com.pyruby.npzr.model.PlayerType

class GameRepository(val mapper: DynamoDBMapper) {

    fun findGame(gameId: String) : Game {
        val game = mapper.load(Game::class.java, gameId)
        return game
    }

    fun createGame(user: String, playerType: PlayerType): Game {
        val game = Game.createGame(user, playerType)
        mapper.save(game)
        return game
    }

    fun update(game: Game) {
        mapper.save(game, DynamoDBMapperConfig.builder().withSaveBehavior(DynamoDBMapperConfig.SaveBehavior.UPDATE).build())
    }

    companion object {
        val gameRepo: GameRepository by lazy {
            GameRepository(DBMapper.mapper)
        }
    }

}
