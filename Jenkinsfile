pipeline {
  agent any
  environment {
    PATH = "/usr/local/bin:/usr/bin:/bin"
  }
  stages {
    stage("Build") {
      steps {
        dir("./") {
          deleteDir()
        }
        checkout scm
        sh "npm set registry http://localhost:4873/"
        sh "npm install"
      }
    }
    stage("Test") {
      steps {
        sh "node_modules/.bin/mocha --opts mocha.opts --reporter xunit --reporter-options output=spec/specs.xml"
        sh "node_modules/.bin/nyc ./node_modules/.bin/mocha --opts mocha.opts"
        archive "spec/coverage/**/*"
        junit "spec/specs.xml"
      }
    }
    stage("Package") {
      steps {
        sh "node_modules/.bin/webpack"
        sh "git rev-parse --short HEAD > version"
      }
    }
  }
  post {
    always {
      echo "Hello from your pipeline"
    }
  }
}
