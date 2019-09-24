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
                sh './jenkins/scripts/deliver.sh'
                input message: 'Finished using the web site? (Click "Proceed" to continue)'
                sh './jenkins/scripts/kill.sh'
            }
        }
  }
}