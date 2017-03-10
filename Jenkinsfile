pipeline {
  agent any
  stages {
    stage("Build") {
      steps {
        echo "building"
        checkout scm
        sh "pwd"
        sh "ls"
      }
    }
    stage("Test") {
      steps {
        echo "testing"
      }
    }
    stage("Package") {
      steps {
        echo "packaging"
      }
    }
  }
  post {
    always {
      echo "Hello from your pipeline"
    }
  }
}
