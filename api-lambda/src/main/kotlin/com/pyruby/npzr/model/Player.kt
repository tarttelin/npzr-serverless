package com.pyruby.npzr.model

import com.amazonaws.services.dynamodbv2.datamodeling.*

@DynamoDBDocument
data class Player(
        var userId: String? = null,
        @DynamoDBTyped(DynamoDBMapperFieldModel.DynamoDBAttributeType.S) var playerType: PlayerType = PlayerType.Player,
        var hand: List<Card> = emptyList(),
        var stacks: List<Stack> = listOf(Stack()),
        var completed: List<String> = emptyList(),
        @DynamoDBTyped(DynamoDBMapperFieldModel.DynamoDBAttributeType.S) var playState: PlayState = PlayState.Wait) {
}

object PlayerScore {
    fun completeStacks(player: Player): Pair<Player, List<Card>> {
        val updatedStacks: List<Triple<Stack, CharacterType?, List<Card>>> = player.stacks.map {
            val completedCharacter = it.completedCharacter()
            if (completedCharacter != null) {
                val cardsToDiscard = it.head.plus(it.torso).plus(it.legs)
                val emptiedStack = it.copy(head = emptyList(), torso = emptyList(), legs = emptyList())
                Triple(emptiedStack, completedCharacter, cardsToDiscard)
            } else {
                Triple<Stack, CharacterType?, List<Card>>(it, null, emptyList())
            }
        }
        val completedCharacters = updatedStacks.filter { it.second != null }.map { it.second?.name!! }
        return Pair(player.copy(stacks = updatedStacks.map { it.first }, completed = player.completed.plus(completedCharacters)),
                updatedStacks.flatMap { it.third })
    }
}

enum class PlayerType {
    Player,
    AI
}