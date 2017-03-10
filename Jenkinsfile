#!groovy​
node {
  agent any
  stages {
    stage("build") {
      node {
        sh "pwd"
        checkout scm
        sh "ls"
      }
    }
    stage("test") {
      steps {
        echo "testing"
      }
    }
    stage("package") {
      steps {
        echo "packaging"
      }
    }
  }
  post {
    always {
      echo "Hello from your pipeline"
    }
    failure {
      echo "I failed"
    }
  }
}
