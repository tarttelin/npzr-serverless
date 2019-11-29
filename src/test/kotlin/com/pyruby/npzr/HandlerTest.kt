package com.pyruby.npzr

import org.amshove.kluent.`should be equal to`
import kotlin.test.Test

class HandlerTest {

    private val handler = Handler();

    @Test
    fun `Handling request with invalid operation returns 400`() {
        val input = mapOf<String, Any>(
                "operation" to "value"
        )
        val output: ApiGatewayResponse = handler.handleRequest(input, null)

        output.statusCode `should be equal to` 400
    }

    @Test
    fun `Handling request with playCard operation returns 200`() {
        val input = mapOf<String, Any>(
                "operation" to "playCard"
        )
        val output: ApiGatewayResponse = handler.handleRequest(input, null)

        output.statusCode `should be equal to` 200
    }
}