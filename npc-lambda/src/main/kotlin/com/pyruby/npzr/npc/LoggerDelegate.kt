package com.pyruby.npzr.npc

import org.apache.logging.log4j.LogManager
import org.apache.logging.log4j.Logger
import kotlin.properties.ReadOnlyProperty
import kotlin.reflect.KProperty


class LoggerDelegate<in R:  Any> : ReadOnlyProperty<R, Logger> {
    override fun getValue(thisRef: R, property: KProperty<*>) = LogManager.getLogger(thisRef.javaClass)
}