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
        sh "npm install mochawesome mocha-multi"
      }
    }
    stage("Test") {
      steps {
        sh "node_modules/.bin/mocha --opts mocha.opts --reporter mocha-multi --reporter-options mochawesome=-,xunit=spec/specs.xml"
        sh "node_modules/.bin/nyc ./node_modules/.bin/mocha --opts mocha.opts"
        archive "./mochawesome-reports/**/*"
        archive "./spec/coverage/**/*"
        junit "./spec/specs.xml"
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
