package com.pyruby.npzr.model

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTypeConverter

class CharacterListConverter : DynamoDBTypeConverter<List<String>, List<CharacterType>> {
    override fun convert(source: List<CharacterType>?): List<String> {
        println("Called converter with character type list")
        return source?.map{ it.name } ?: emptyList()
    }

    override fun unconvert(source: List<String>?): List<CharacterType> {
        return source?.map { CharacterType.valueOf(it) } ?: emptyList()
    }

}
