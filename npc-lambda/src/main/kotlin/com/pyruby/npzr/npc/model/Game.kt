package com.pyruby.npzr.npc.model

data class Game(
    val __typename: String?,
    val discardPile: List<Card>,
    val id: String,
    val players: List<Player>
)