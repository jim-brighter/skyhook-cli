import org.jenkinsci.plugins.pipeline.modeldefinition.Utils

def REPO_URL = "https://github.com/skyhook-cli/skyhook-cli.git"

def COMMIT_MESSAGE
def VERSION_NUMBER

node {
    properties([[$class: 'JiraProjectProperty'], buildDiscarder(logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '', numToKeepStr: '5')),
                [$class: 'RebuildSettings', autoRebuild: false, rebuildDisabled: false]])

    deleteDir()

    stage("PR TITLE CHECK") {
        if (isPr()) {
            assert env.CHANGE_TITLE ==~ /(patch|minor|major):.+/
        }
        else {
            Utils.markStageSkippedForConditional(STAGE_NAME)
        }
    }

    stage("GIT CHECKOUT") {
        if (isPr() || isPushToMaster()) {
            git(
                url: "${REPO_URL}",
                credentialsId: 'git-login',
                branch: isPr() ? env.CHANGE_BRANCH : env.BRANCH_NAME
            )

            COMMIT_MESSAGE = sh(
                script: "git log --format=%B -n 1 HEAD",
                returnStdout: true
            ).trim()

            sh """
                echo "Node Version \$(node -v)"
            """

            print "Commit Message: ${COMMIT_MESSAGE}"
        }
        else {
            Utils.markStageSkippedForConditional(STAGE_NAME)
        }
    }

    stage("NPM INSTALL") {
        if (isPr() || isNonVersionPushToMaster(COMMIT_MESSAGE)) {
            sh """
                npm i
            """
        }
        else {
            Utils.markStageSkippedForConditional(STAGE_NAME)
        }
    }

    stage("PRE PUBLISH") {
        if (isNonVersionPushToMaster(COMMIT_MESSAGE)) {
            withCredentials([
                string(credentialsId: 'npm-token', variable: 'NPM_TOKEN')
            ]) {
                sh """
                    git config user.name "Skyhook Bot"
                    git config user.email "skyhookbot"

                    npm run jenkinsAuth
                """
            }
        }
        else {
            Utils.markStageSkippedForConditional(STAGE_NAME)
        }
    }

    stage("PUBLISH PATCH") {
        if (isPushToMaster() && (isPatchPush(COMMIT_MESSAGE) || isUncategorizedPush(COMMIT_MESSAGE))) {
            sh """
                npm run publishPatch
            """
        }
        else {
            Utils.markStageSkippedForConditional(STAGE_NAME)
        }
    }

    stage("PUBLISH MINOR") {
        if (isPushToMaster() && isMinorPush(COMMIT_MESSAGE)) {
            sh """
                npm run publishMinor
            """
        }
        else {
            Utils.markStageSkippedForConditional(STAGE_NAME)
        }
    }

    stage("PUBLISH MAJOR") {
        if (isPushToMaster() && isMajorPush(COMMIT_MESSAGE)) {
            sh """
                npm run publishMajor
            """
        }
        else {
            Utils.markStageSkippedForConditional(STAGE_NAME)
        }
    }

    stage("PUSH TAGS") {
        if (isNonVersionPushToMaster(COMMIT_MESSAGE)) {
            withCredentials([
                usernamePassword(credentialsId: 'git-login', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')
            ]) {
                def origin = "https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/skyhook-cli/skyhook-cli.git"
                sh """
                    git push ${origin} master --tags
                """
            }
        }
        else {
            Utils.markStageSkippedForConditional(STAGE_NAME)
        }
    }

    stage("BUILD BINARIES") {
        if (isPr() || isNonVersionPushToMaster(COMMIT_MESSAGE)) {

            VERSION_NUMBER = !isPr()
            ? sh(
                script: "git log --format=%B -n 1 HEAD",
                returnStdout: true
            ).trim().split(' ')[3]
            : env.BRANCH_NAME

            sh """
                npm run cleanBin && VERSION_NUMBER=${VERSION_NUMBER} npm run buildAllBins
            """
        }
        else {
            Utils.markStageSkippedForConditional(STAGE_NAME)
        }
    }

    stage("GITHUB RELEASE") {
        if (isNonVersionPushToMaster(COMMIT_MESSAGE)) {

            withCredentials([
                usernamePassword(credentialsId: 'git-login', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')
            ]) {
                sh """
                    curl https://api.github.com/repos/skyhook-cli/skyhook-cli/releases \
                    -H "Authorization: token ${GIT_PASSWORD}" \
                    -H "Accept: application/vnd.github.v3+json" \
                    -H "Content-Type: application/json" \
                    -X POST \
                    -d '{
                        "tag_name": "${VERSION_NUMBER}-release",
                        "target_commitish": "master",
                        "name": "Release v${VERSION_NUMBER}",
                        "body": "Automated release v${VERSION_NUMBER}"
                    }'
                """
            }

            def id = getReleaseId()

            publishArtifacts(id, "windows", VERSION_NUMBER)
            publishArtifacts(id, "linux", VERSION_NUMBER)
            publishArtifacts(id, "macos", VERSION_NUMBER)
        }
        else {
            Utils.markStageSkippedForConditional(STAGE_NAME)
        }
    }
}

def getReleaseId() {
    withCredentials([
        usernamePassword(credentialsId: 'git-login', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')
    ]) {
        return sh(
            script: """
                response=\$(curl -s https://api.github.com/repos/skyhook-cli/skyhook-cli/releases/latest -H "Authorization: token ${GIT_PASSWORD}")

                echo \$response | jq .id
            """,
            returnStdout: true
        ).trim()
    }
}

def publishArtifacts(id, os, version) {

    filename = "skyhook-cli-${os}-v${version}-x64.zip"
    fullPath = "bin/${os}/${filename}"

    print "Publishing ${filename} for release ${id}"

    withCredentials([
        usernamePassword(credentialsId: 'git-login', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')
    ]) {
        sh """
            curl "https://uploads.github.com/repos/skyhook-cli/skyhook-cli/releases/${id}/assets?name=${filename}" \
            -H "Accept: application/vnd.github.v3+json" \
            -H "Content-Type: application/zip" \
            -H "Authorization: token ${GIT_PASSWORD}" \
            -X POST \
            --data-binary @"${fullPath}"
        """
    }
}

def isPr() {
    return env.BRANCH_NAME.startsWith("PR-")
}

def isPatchPush(message) {
    return !isPr() && message.startsWith("patch:")
}

def isMinorPush(message) {
    return !isPr() && message.startsWith("minor:")
}

def isMajorPush(message) {
    return !isPr() && message.startsWith("major:")
}

def isVersionPush(message) {
    return !isPr() && message.startsWith("version update")
}

def isPushToMaster() {
    return env.BRANCH_NAME == "master"
}

def isNonVersionPushToMaster(message) {
    return isPushToMaster() && !isVersionPush(message)
}

def isUncategorizedPush(message) {
    return !isPatchPush(message) \
    && !isMinorPush(message) \
    && !isMajorPush(message) \
    && !isVersionPush(message)
}
