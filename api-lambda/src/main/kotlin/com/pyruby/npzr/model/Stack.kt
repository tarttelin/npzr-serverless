package com.pyruby.npzr.model

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBDocument
import com.pyruby.npzr.PlayException
import java.util.*

@DynamoDBDocument
data class Stack(
        var id: String = UUID.randomUUID().toString(),
        var head: List<Card> = emptyList(),
        var torso: List<Card> = emptyList(),
        var legs: List<Card> = emptyList()
) {
    fun play(card: Card, position: BodyPart): Pair<Stack, CharacterType?> {
        return when (position) {
            BodyPart.Head -> if (card.bodyPart != BodyPart.Head && card.bodyPart != BodyPart.Wild) throw PlayException("Invalid position") else Pair(copy(head = head.plus(card)), null)
            BodyPart.Torso -> if (card.bodyPart != BodyPart.Torso && card.bodyPart != BodyPart.Wild) throw PlayException("Invalid position") else Pair(copy(torso = torso.plus(card)), null)
            BodyPart.Legs -> if (card.bodyPart != BodyPart.Legs && card.bodyPart != BodyPart.Wild) throw PlayException("Invalid position") else Pair(copy(legs = legs.plus(card)), null)
            else -> throw PlayException("Invalid position")
        }
    }

}