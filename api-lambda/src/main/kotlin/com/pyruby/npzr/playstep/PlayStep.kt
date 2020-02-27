package com.pyruby.npzr.playstep

import com.pyruby.npzr.PlayException
import com.pyruby.npzr.model.*

sealed class PlayStep(val game: Game) {
    fun updateGame(updatedPlayer: Player, updatedOpponent: Player) = game.copy(players = game.players.map { if (it.userId == updatedPlayer.userId) updatedPlayer else updatedOpponent })
}

data class StartPlay(val _game: Game, val player: Player, val opponent: Player): PlayStep(_game) {
    fun playCard(cardId: String): PlayCardStep {
        return when (player.playState) {
            PlayState.Play -> {
                playCardFromHand(cardId)
            }
            in listOf(PlayState.Move, PlayState.MoveWild) -> {
                moveCardOnStack(cardId)
            }
            else -> {
                throw PlayException("Not your turn to move a card")
            }
        }
    }

    private fun moveCardOnStack(cardId: String): PlayCardStep {
        val (stack, cardToPlay) = player.stacks.plus(opponent.stacks)
                .flatMap { listOf(it to it.head.firstOrNull(), it to it.torso.firstOrNull(), it to it.legs.firstOrNull()) }
                .firstOrNull { it.second?.id == cardId } ?: throw PlayException("Cannot locate card on top of a stack")
        val stackWithoutCardToPlay = stack.copy(
                head = stack.head.filter { it != cardToPlay },
                torso = stack.torso.filter { it != cardToPlay },
                legs = stack.legs.filter { it != cardToPlay })
        val updatedPlayer = player.copy(stacks = player.stacks.map { s -> if (s.id == stackWithoutCardToPlay.id) stackWithoutCardToPlay else s })
        val updatedOpponent = opponent.copy(stacks = opponent.stacks.map { s -> if (s.id == stackWithoutCardToPlay.id) stackWithoutCardToPlay else s })

        val gameWithCardRemovedFromStack = updateGame(updatedPlayer, updatedOpponent)
        return PlayCardStep(gameWithCardRemovedFromStack, cardToPlay!!, updatedPlayer, updatedOpponent)
    }

    private fun playCardFromHand(cardId: String): PlayCardStep {
        val cardToPlay = player.hand?.find { card -> card.id == cardId } ?: throw PlayException("Card not in your hand")
        val updatedPlayer = player.copy(hand = player.hand.filter { it != cardToPlay })
        val gameWithCardRemovedFromHand = updateGame(updatedPlayer, opponent)
        return PlayCardStep(gameWithCardRemovedFromHand, cardToPlay, updatedPlayer, opponent)
    }
}

data class PlayCardStep(val _game: Game, val card: Card, val player: Player, val opponent: Player): PlayStep(_game) {
    fun onStackSlot(stackId: String, position: BodyPart): PlayOnStackStep {
        val targetStack = player.stacks.plus(opponent.stacks).find { it.id == stackId } ?: throw PlayException("Unknown stack")
        val updatedStack = targetStack.play(card, position)
        val updatedPlayer = player.copy(stacks = player.stacks.map { if (it.id == updatedStack.id) updatedStack else it } )
        val updatedOpponent = opponent.copy(stacks = opponent.stacks.map { if (it.id == updatedStack.id) updatedStack else it } )
        val updatedGame = updateGame(updatedPlayer, updatedOpponent)
        return PlayOnStackStep(updatedGame, updatedStack, card, updatedPlayer, updatedOpponent)
    }
}

data class PlayOnStackStep(val _game: Game, val stack: Stack, val card: Card, val player: Player, val opponent: Player): PlayStep(_game) {

    fun scoreCompletedStacks(): ScoredPlayStep {
        fun updatePlayer(p: Player): Player {
            val completedCharactersToScore = p.stacks.mapNotNull { it.completedCharacter() }
            val updatedStacks = p.stacks.map { if (it.completedCharacter() != null ) it.copy(head= emptyList(), torso = emptyList(), legs = emptyList()) else it }
            return p.copy(stacks = updatedStacks, completed = p.completed.plus(completedCharactersToScore))
        }
        val cardsToDiscard = player.stacks.plus(opponent.stacks).flatMap { if (it.completedCharacter() != null) it.head.plus(it.torso).plus(it.legs) else emptyList() }
        val updatedGame = game.copy(discardPile = game.discardPile.plus(cardsToDiscard), players = game.players.map {updatePlayer(it)})
        return ScoredPlayStep(updatedGame, cardsToDiscard.isNotEmpty(), stack, card, updatedGame.activePlayer()!!, updatedGame.players.find { it.userId == opponent.userId}!!)
    }
}

data class ScoredPlayStep(val _game: Game, val completedCharacter: Boolean, val stack: Stack, val card: Card, val player: Player, val opponent: Player): PlayStep(_game) {
    fun updatePlayState(): PlayCompletedStep {
        val updatedPlayerState = if (winner(player.completed)) copy(player = player.copy(playState = PlayState.Winner), opponent = opponent.copy(playState = PlayState.Loser))
        else if (winner(opponent.completed)) copy(player = player.copy(playState = PlayState.Loser), opponent = opponent.copy(playState = PlayState.Winner))
        else if (completedCharacter) {
            copy(player = player.copy(playState = if(player.playState == PlayState.Play && card.isWild()) PlayState.MoveWild else PlayState.Move))
        } else if (player.playState == PlayState.MoveWild && player.hand.isNotEmpty()) {
            copy(player = player.copy(playState = PlayState.Play))
        } else if (player.playState == PlayState.Play && card.isWild() && player.hand.isNotEmpty()) {
            this
        } else {
            copy(player = player.copy(playState = PlayState.Wait), opponent = opponent.copy(playState = PlayState.Play))
        }
        val updatedStep = updateGame(updatedPlayerState)
        return PlayCompletedStep(updatedStep.game, updatedStep.player, updatedStep.opponent)
    }

    private fun winner(characters: List<CharacterType>) = CharacterType.values().toList().minus(characters).size == 1
    private fun updateGame(step: ScoredPlayStep) = step.copy(_game=step.game.copy(players = step.game.players.map { if (it.userId == step.player.userId) step.player else step.opponent }))
}

data class PlayCompletedStep(val _game: Game, val player: Player, val opponent: Player): PlayStep(_game) {
    fun dealNextCard() =
            if (opponent.playState == PlayState.Play) {
                val (deck, discardPile) = if (game.deck.isEmpty()) game.discardPile.shuffled() to emptyList() else game.deck to game.discardPile
                val updatedOpponent = opponent.copy(hand = opponent.hand.plus(deck.first()))
                copy(_game=game.copy(
                        deck = deck.subList(1, deck.size),
                        players = game.players.map { if (it.userId == opponent.userId) updatedOpponent else it },
                        discardPile = discardPile),
                        opponent = updatedOpponent)
            } else {
                this
            }

    fun ensurePlayersHaveAnEmptyStack(): PlayCompletedStep {
        val updatedPlayer = if (player.stacks.any { it.head.plus(it.torso).plus(it.legs).isEmpty()})
            player
        else
            player.copy(stacks = player.stacks.plus(Stack()))
        val updatedOpponent = if (opponent.stacks.any { it.head.plus(it.torso).plus(it.legs).isEmpty()})
            opponent
        else
            opponent.copy(stacks = opponent.stacks.plus(Stack()))
        val updatedGame = updateGame(updatedPlayer, updatedOpponent)
        return PlayCompletedStep(updatedGame, updatedPlayer, updatedOpponent)
    }

}