package com.pyruby.npzr.model

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBDocument
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapperFieldModel
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTyped

@DynamoDBDocument
data class Player(
        var userId: String? = null,
        @DynamoDBTyped(DynamoDBMapperFieldModel.DynamoDBAttributeType.S) var playerType: PlayerType = PlayerType.Player,
        var hand: List<Card> = emptyList(),
        var stacks: List<Stack> = listOf(Stack()),
        var completed: List<CharacterType> = emptyList(),
        @DynamoDBTyped(DynamoDBMapperFieldModel.DynamoDBAttributeType.S) var playState: PlayState = PlayState.Wait) {
}

enum class PlayerType {
    Player,
    AI
}