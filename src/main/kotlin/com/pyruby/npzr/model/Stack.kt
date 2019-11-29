package com.pyruby.npzr.model

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBDocument

@DynamoDBDocument
data class Stack(
        var head: List<Card> = emptyList(),
        var torso: List<Card> = emptyList(),
        var legs: List<Card> = emptyList()
) {

}