package com.pyruby.npzr.npc

import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.lambda.runtime.RequestHandler
import com.amazonaws.services.lambda.runtime.events.SQSEvent
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.pyruby.npzr.npc.model.Game
import com.pyruby.npzr.npc.model.Player
import com.pyruby.npzr.npc.moves.MoveHighestScoreAnyCard
import com.pyruby.npzr.npc.moves.MoveMatchingCharacterToExistingStack
import com.pyruby.npzr.npc.plays.*


class NpcPlayerHandler(val playCard: PlayCardCall = GameGateway::makePlayCardRequest): RequestHandler<SQSEvent, Unit> {
    private val logger by LoggerDelegate()
    val mapper = jacksonObjectMapper()
    private val plays = listOf(PlayToCompleteStack(), PlayCharacterWild(), PlayMatchingCharacterOnExistingStack(), PlayHighestScoreAnyCard())
    private val moves = listOf(PlayToCompleteStack(), MoveMatchingCharacterToExistingStack(),MoveHighestScoreAnyCard())

    override fun handleRequest(input: SQSEvent?, context: Context?) {
        input?.records?.forEach { action ->
            logger.debug("Message received by NPC: " + action.body)
            val game = mapper.readValue(action.body, Game::class.java)
            val npc = game.players[1]
            val oppo = game.players[0]
            val play = if (npc.playState == "Play") {
                playCard(npc, oppo)
            } else {
                moveCard(npc, oppo)
            }
            playCard(game.id, play.card.id, play.stack.id, play.position)
        }
    }

    private fun moveCard(npc: Player, oppo: Player): Play {
        val move = moves.mapNotNull { it.moveCard(npc, oppo) }.first()
        return move
    }

    private fun playCard(npc: Player, oppo: Player): Play {
        val play = plays.mapNotNull { it.playCard(npc, oppo) }.first()
        return play
    }
}