package com.pyruby.npzr.npc

import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.lambda.runtime.RequestHandler
import com.amazonaws.services.lambda.runtime.events.SQSEvent
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.pyruby.npzr.npc.model.Game
import com.pyruby.npzr.npc.model.Player
import com.pyruby.npzr.npc.model.Position


class NpcPlayerHandler(val playCard: PlayCardCall = GameGateway::makePlayCardRequest): RequestHandler<SQSEvent, Unit> {
    private val logger by LoggerDelegate()
    val mapper = jacksonObjectMapper()

    override fun handleRequest(input: SQSEvent?, context: Context?) {
        input?.records?.forEach { action ->
            logger.debug("Message received by NPC: " + action.body)
            val game = mapper.readValue(action.body, Game::class.java)
            val npc = game.players[1]
            val oppo = game.players[0]
            if (npc.playState == "Play") {
                val (cardId, stackId, position) = playCard(npc, oppo)
                playCard(game.id, cardId, stackId, position)
            } else {
                val (cardId, stackId, position) =  moveCard(npc, oppo)
                playCard(game.id, cardId, stackId, position)
            }
        }
    }

    fun moveCard(npc: Player, oppo: Player): Triple<String, String, Position> {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    fun playCard(npc: Player, oppo: Player): Triple<String, String, Position> {
        val cardToPlay = npc.hand[0]
        val stack = npc.stacks[0].id
        val position = if (cardToPlay.bodyPart == Position.Wild) Position.Head else cardToPlay.bodyPart
        return Triple(cardToPlay.id, stack, position)
    }
}