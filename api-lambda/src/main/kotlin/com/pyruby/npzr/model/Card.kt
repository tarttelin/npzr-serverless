package com.pyruby.npzr.model

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBDocument
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBIgnore
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapperFieldModel
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTyped
import com.fasterxml.jackson.annotation.JsonIgnore

@DynamoDBDocument
data class Card(
        var id: String? = null,
        @DynamoDBTyped(DynamoDBMapperFieldModel.DynamoDBAttributeType.S) var bodyPart: BodyPart = BodyPart.Head,
        @DynamoDBTyped(DynamoDBMapperFieldModel.DynamoDBAttributeType.S) var characterType: CharacterType = CharacterType.Ninja
) {
    @DynamoDBIgnore
    @JsonIgnore
    fun isWild(): Boolean = bodyPart == BodyPart.Wild || characterType == CharacterType.Wild
}