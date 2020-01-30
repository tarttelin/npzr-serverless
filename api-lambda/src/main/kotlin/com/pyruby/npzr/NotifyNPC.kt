package com.pyruby.npzr

import com.amazonaws.services.sqs.AmazonSQSClientBuilder
import com.amazonaws.services.sqs.model.SendMessageRequest
import com.fasterxml.jackson.databind.ObjectMapper
import com.pyruby.npzr.model.Game
import com.pyruby.npzr.model.PlayState
import com.pyruby.npzr.model.PlayerType

class NotifyNPC {
    private val logger by LoggerDelegate()

    fun npcPlayerTurn(game: Game) {
        if (game.players[1].playerType == PlayerType.AI && game.players[1].playState != PlayState.Wait) {
            val env = System.getenv("AWS_LAMBDA_FUNCTION_NAME").split("-")[1]
            logger.debug("Looking up queue: NPCQueue-$env")
            val client = AmazonSQSClientBuilder.defaultClient()
            val queueUrl = client.getQueueUrl("NPCQueue-$env").queueUrl
            val messageRequest = SendMessageRequest()
                    .withQueueUrl(queueUrl)
                    .withMessageBody(ObjectMapper().writeValueAsString(game))
                    .withDelaySeconds(2)
            client.sendMessage(messageRequest)
        }
    }

    companion object {
        val notifier: NotifyNPC by lazy {
            NotifyNPC()
        }
    }
}