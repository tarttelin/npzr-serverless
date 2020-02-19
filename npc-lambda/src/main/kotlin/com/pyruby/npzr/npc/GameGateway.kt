package com.pyruby.npzr.npc

import com.amazonaws.AmazonWebServiceRequest
import com.amazonaws.AmazonWebServiceResponse
import com.amazonaws.ClientConfiguration
import com.amazonaws.DefaultRequest
import com.amazonaws.auth.AWS4Signer
import com.amazonaws.auth.BasicSessionCredentials
import com.amazonaws.http.AmazonHttpClient
import com.amazonaws.http.HttpMethodName
import com.amazonaws.http.HttpResponse
import com.amazonaws.http.HttpResponseHandler
import com.fasterxml.jackson.databind.ObjectMapper
import com.pyruby.npzr.npc.model.Position
import org.apache.http.HttpHeaders
import java.io.BufferedReader
import java.io.ByteArrayInputStream
import java.io.IOException
import java.net.URI

typealias PlayCardCall = (gameId: String, cardId: String, stackId: String, position: Position) -> Unit

object GameGateway {
    private val logger by LoggerDelegate()

    val apiCall = """
        mutation(${'$'}gameId: ID!, ${'$'}cardId: ID!, ${'$'}stackId: ID!, ${'$'}position: BodyPartType!) {
                playCard(input: {gameId: ${'$'}gameId, cardId: ${'$'}cardId, stackId: ${'$'}stackId, position: ${'$'}position}) {
                    id
                    players {
                        playerType
                        userId
                        hand {
                            id
                            bodyPart
                            characterType
                            __typename
                        }
                        completed
                        stacks {
                            id
                            head {
                                id
                                bodyPart
                                characterType
                                __typename
                            }
                            torso {
                                id
                                bodyPart
                                characterType
                                __typename
                            }
                            legs {
                                id
                                bodyPart
                                characterType
                                __typename
                            }
                        }
                        playState
                        __typename
                    }
                    discardPile {
                        id
                        bodyPart
                        characterType
                        __typename
                    }
                    __typename
                }
            }
    """.trimIndent()

    fun makePlayCardRequest(gameId: String, cardId: String, stackId: String, position: Position) {
        val payloadBytes = makePayload(gameId, cardId, stackId, position.name)
        val req = DefaultRequest<AmazonWebServiceRequest>("AppSync")
        req.httpMethod = HttpMethodName.POST
        req.endpoint = URI.create(System.getenv("API_URL"))
        req.content = ByteArrayInputStream(payloadBytes)
        req.addHeader("type", "AWS_IAM")
        req.addHeader(HttpHeaders.CONTENT_TYPE, "application/json")
        req.addHeader(HttpHeaders.CONTENT_LENGTH, java.lang.String.valueOf(payloadBytes.size))
        val signer = AWS4Signer()
        signer.serviceName = "appsync"
        val credentials = lookupCreds()
        signer.sign(req, credentials)
        val response = AmazonHttpClient.builder().clientConfiguration(ClientConfiguration()).build().requestExecutionBuilder()
                .request(req)
                .execute(StringResponseHandler())
        logger.debug(response.awsResponse.result)
    }

    private fun makePayload(gameId: String, cardId: String, stackId: String, position: String) =
            ObjectMapper().writeValueAsBytes(mapOf("query" to apiCall,
                    "variables" to mapOf("gameId" to gameId,
                            "cardId" to cardId,
                            "stackId" to stackId,
                            "position" to position)))

    private fun lookupCreds(): BasicSessionCredentials {
        val accessKey = System.getenv("AWS_ACCESS_KEY_ID")
        val secretKey = System.getenv("AWS_SECRET_ACCESS_KEY")
        val session = System.getenv("AWS_SESSION_TOKEN")
        return BasicSessionCredentials(accessKey, secretKey, session)
    }

}

class StringResponseHandler : HttpResponseHandler<AmazonWebServiceResponse<String>> {
    @Throws(IOException::class)
    override fun handle(response: HttpResponse): AmazonWebServiceResponse<String> {
        val awsResponse: AmazonWebServiceResponse<String> = AmazonWebServiceResponse()
        //putting response string in the result, available outside the handler
        awsResponse.result = response.content.bufferedReader().use(BufferedReader::readText)
        return awsResponse
    }

    override fun needsConnectionLeftOpen(): Boolean {
        return false
    }
}