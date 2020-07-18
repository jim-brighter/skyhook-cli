import org.jenkinsci.plugins.pipeline.modeldefinition.Utils

def REPO_URL = "https://github.com/skyhook-cli/skyhook-cli.git"

def COMMIT_MESSAGE

node {
    properties([[$class: 'JiraProjectProperty'], buildDiscarder(logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '', numToKeepStr: '5')),
                [$class: 'RebuildSettings', autoRebuild: false, rebuildDisabled: false]])

    deleteDir()

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
        if (isPr() || isPushToMaster()) {
            sh """
                npm i
            """
        }
        else {
            Utils.markStageSkippedForConditional(STAGE_NAME)
        }
    }

    stage("GIT CONFIG") {
        if (isPushToMaster()) {
            sh """
                git config user.name "Skyhook Bot"
                git config user.email "skyhookbot"
            """
        }
    }

    stage("PUBLISH PATCH") {
        if (isPushToMaster() && isPatchPush(COMMIT_MESSAGE)) {
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
        if (isPushToMaster() && !isVersionPush(COMMIT_MESSAGE)) {
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
