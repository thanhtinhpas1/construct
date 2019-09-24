pipeline {
  agent {
    docker {
      image 'node:8.11.1'
      args '-p 3587:80'
    }
  }
  stages {
    stage('Build'){
      steps{
        sh 'npm install'
      }
    }
       stage('Deliver') {
            steps {
                sh 'node app.js'
            }
        }
  }
}