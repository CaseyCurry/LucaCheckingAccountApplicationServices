#!groovy​
node {
  agent any
  stages {
    stage("build") {
      node {
        steps {
          checkout scm
          sh "pwd"
          sh "ls"
        }
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
