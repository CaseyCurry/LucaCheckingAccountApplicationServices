#!groovy​
node {
  agent any
  stages {
    stage("build") {
      steps {
        pwd
        git url: "https://github.com/caseycurry/LucaCheckingAccountApi", branch: "master"
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
