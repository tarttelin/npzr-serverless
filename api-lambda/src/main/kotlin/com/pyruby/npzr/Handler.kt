package com.pyruby.npzr

import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.lambda.runtime.RequestHandler
import org.apache.logging.log4j.LogManager

class Handler:RequestHandler<Map<String, Any>, ApiGatewayResponse> {

  override fun handleRequest(input:Map<String, Any>, context:Context?): ApiGatewayResponse {
    LOG.info("received: " + input.keys.toString())

    val operation = input["operation"]

    val result = when (operation) {
      "draw" -> draw(input)
      "playCard" -> playCard(input)
      else -> HelloResponse("Mismatch call", input, 400)
    }

    return ApiGatewayResponse.build {
      statusCode = result.status
      objectBody = result
      headers = mapOf("X-Powered-By" to "AWS Lambda & serverless")
    }
  }

  private fun playCard(input: Map<String, Any>): HelloResponse = HelloResponse("play a card", input)

  private fun draw(input:Map<String, Any>): HelloResponse = HelloResponse("Called draw", input)

  companion object {
    private val LOG = LogManager.getLogger(Handler::class.java)
  }
}
