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
    fun completedCharacter(): CharacterType? {
        val topHead = head.firstOrNull()
        val topTorso = torso.firstOrNull()
        val topLegs = legs.firstOrNull()
        if (topHead != null && topTorso != null && topLegs != null) {
            val nonWildCards = listOf(topHead, topTorso, topLegs).filter { it.characterType != CharacterType.Wild }
            val sameCharacterType = nonWildCards.all { it.characterType == nonWildCards[0].characterType }
            if (sameCharacterType) {
                return nonWildCards[0].characterType
            }
        }
        return null
    }

    fun play(card: Card, position: BodyPart): Stack {
        return when (position) {
            BodyPart.Head -> if (card.bodyPart != BodyPart.Head && card.bodyPart != BodyPart.Wild) throw PlayException("Invalid position") else copy(head = listOf(card).plus(head))
            BodyPart.Torso -> if (card.bodyPart != BodyPart.Torso && card.bodyPart != BodyPart.Wild) throw PlayException("Invalid position") else copy(torso = listOf(card).plus(torso))
            BodyPart.Legs -> if (card.bodyPart != BodyPart.Legs && card.bodyPart != BodyPart.Wild) throw PlayException("Invalid position") else copy(legs = listOf(card).plus(legs))
            else -> throw PlayException("Invalid position")
        }
    }
}
