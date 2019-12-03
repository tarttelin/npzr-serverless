group = "com.pyruby.npzr"
version = "dev"
description = "Ninja Pirate Zombie Robot"


plugins {
    kotlin("jvm") version "1.3.50"
    id("com.github.johnrengelman.shadow") version "5.2.0"
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
    implementation("com.amazonaws:aws-lambda-java-events:2.0.1")
    implementation("com.amazonaws:aws-java-sdk-dynamodb:1.11.548")

    implementation("com.fasterxml.jackson.core:jackson-core:2.9.10")
    implementation("com.fasterxml.jackson.core:jackson-databind:2.9.10")
    implementation("com.fasterxml.jackson.core:jackson-annotations:2.9.10")

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

task("deploy", Exec::class) {
    dependsOn("build")
    commandLine("serverless", "deploy")
}

task("local", Exec::class) {
    dependsOn("clean", "shadowJar")
    tasks.findByName("build")?.mustRunAfter("clean")
    environment("IS_LOCAL", "true")
    commandLine("serverless", "invoke", "local", "-f", "createGame")
}

tasks.test {
    useJUnitPlatform()
}
