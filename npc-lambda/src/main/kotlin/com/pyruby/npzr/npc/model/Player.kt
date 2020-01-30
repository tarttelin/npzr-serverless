package com.pyruby.npzr.npc.model

data class Player(
        val __typename: String?,
        val completed: List<String>,
        val hand: List<Card>,
        val playState: String,
        val playerType: String,
        val stacks: List<Stack>,
        val userId: String
)