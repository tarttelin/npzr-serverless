plugins {
    base
}

task("buildUi", Exec::class) {
    dependsOn("clean", "build")
    tasks.findByName("build")?.mustRunAfter("clean")
    workingDir("./ui")
    commandLine("yarn", "run", "build")
}

task("deploy", Exec::class) {
    dependsOn("buildUi", ":api-lambda:shadowJar")
    tasks.findByName(":api-lambda:shadowJar")?.mustRunAfter("buildUi")
    commandLine("serverless", "deploy")
}

task("local", Exec::class) {
    dependsOn("clean", "shadowJar")
    tasks.findByName("build")?.mustRunAfter("clean")
    environment("IS_LOCAL", "true")
    commandLine("serverless", "invoke", "local", "-f", "createGame")
}