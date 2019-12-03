package com.pyruby.npzr.model

import com.amazonaws.client.builder.AwsClientBuilder
import com.amazonaws.regions.Regions
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapperConfig
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable

object DBMapper {
    private val config = DynamoDBMapperConfig.builder().withTableNameResolver { clazz, _ ->
        val prefix = clazz.annotations.filter { t -> t is DynamoDBTable }
                .map { m -> (m as DynamoDBTable).tableName}
                .get(0)
        prefix + "-" + System.getenv("AWS_LAMBDA_FUNCTION_NAME").split("-")[1]
    }.build()

    private val client: AmazonDynamoDB by lazy {
        if (System.getenv("IS_LOCAL") == "true") {
            AmazonDynamoDBClientBuilder.standard()
                    .withEndpointConfiguration(AwsClientBuilder.EndpointConfiguration("http://localhost:8000", "local"))
                    .build()
        } else {
            AmazonDynamoDBClientBuilder.standard()
                    .withRegion(Regions.EU_WEST_1)
                    .build()
        }
    }

    val mapper: DynamoDBMapper by lazy {
        DynamoDBMapper(client, config)
    }
}