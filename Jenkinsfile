#!groovy​
node {
  agent any
  stages {
    stage("build") {
      node {
        pwd
        checkout scm
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
