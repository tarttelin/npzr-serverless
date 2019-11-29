package com.pyruby.npzr

data class HelloResponse(val message: String, val input: Map<String, Any>, val status: Int = 200) : Response()
