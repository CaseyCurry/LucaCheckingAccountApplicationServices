pipeline {
  agent any
  stages {
    stage("build") {
      node {
        steps {
          echo "building"
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
  }
}
