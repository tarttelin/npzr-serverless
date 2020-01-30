group = "com.pyruby.npzr.npc"
version = "dev"
description = "Ninja Pirate Zombie Robot"

buildscript {
    repositories {
        jcenter()
        mavenCentral()
    }
    dependencies {
        classpath("com.apollographql.apollo:apollo-gradle-plugin:1.3.0")
    }
}


plugins {
    kotlin("jvm") version "1.3.50"
    id("com.github.johnrengelman.shadow") version "5.2.0"
    id("com.apollographql.apollo") version "1.3.0"
}

repositories {
    mavenCentral()
    jcenter()
}

java {
    sourceCompatibility = JavaVersion.VERSION_11
    targetCompatibility = JavaVersion.VERSION_11
}

dependencies {

    implementation(kotlin("stdlib-jdk8"))

    implementation("com.amazonaws:aws-lambda-java-core:1.1.0")
    implementation("com.amazonaws:aws-lambda-java-log4j2:1.0.0")
    implementation("com.amazonaws:aws-lambda-java-events:2.2.7")
    implementation("com.amazonaws:aws-java-sdk-lambda:1.11.106")

    implementation("com.apollographql.apollo:apollo-runtime:1.3.0")

    implementation("com.fasterxml.jackson.core:jackson-core:2.9.10")
    implementation("com.fasterxml.jackson.core:jackson-databind:2.9.10")
    implementation("com.fasterxml.jackson.core:jackson-annotations:2.9.10")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin:2.9.10")

    testImplementation("org.junit.jupiter:junit-jupiter:5.5.2")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit5:1.3.50")
    testImplementation("org.amshove.kluent:kluent:1.57")
    testImplementation("io.mockk:mockk:1.9")
}

tasks {
    compileKotlin {
        kotlinOptions {
            jvmTarget = "1.8"
        }
    }
    compileTestKotlin {
        kotlinOptions {
            jvmTarget = "1.8"
        }
    }
    shadowJar {
        dependsOn("build")
        exclude("**/Log4j2Plugins.dat")
    }
}

tasks.test {
    useJUnitPlatform()
}
