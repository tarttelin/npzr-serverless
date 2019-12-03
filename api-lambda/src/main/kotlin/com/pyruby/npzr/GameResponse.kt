package com.pyruby.npzr

import com.pyruby.npzr.model.Game

data class GameResponse(var game: Game = Game()) : Response() {
}