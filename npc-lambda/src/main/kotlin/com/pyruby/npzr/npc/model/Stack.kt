package com.pyruby.npzr.npc.model

data class Stack(
    val __typename: String?,
    val head: List<Card>,
    val id: String,
    val legs: List<Card>,
    val torso: List<Card>
)