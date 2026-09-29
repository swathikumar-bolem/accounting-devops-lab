pipeline {
  agent any
  environment { DOCKERHUB_NAMESPACE = 'kumarbolem' }
  stages {
    stage('Checkout') { steps { checkout scm } }
    stage('Backend Test') { steps { dir('backend') { sh 'mvn clean test' } } }
    stage('Frontend Build') { steps { dir('frontend') { sh 'npm install && npm run build' } } }
    stage('Image Tag') { steps { script { env.GIT_SHORT = sh(script:'git rev-parse --short HEAD', returnStdout:true).trim() } } }
    stage('Docker Build') { steps { sh 'docker build -t ${DOCKERHUB_NAMESPACE}/accounting-backend:${GIT_SHORT} backend'; sh 'docker build -t ${DOCKERHUB_NAMESPACE}/accounting-frontend:${GIT_SHORT} frontend' } }
    stage('Docker Push') { when { branch 'main' } steps { withCredentials([usernamePassword(credentialsId:'dockerhub',usernameVariable:'DOCKERHUB_USER',passwordVariable:'DOCKERHUB_TOKEN')]) { sh 'echo "$DOCKERHUB_TOKEN" | docker login -u "$DOCKERHUB_USER" --password-stdin'; sh 'docker push ${DOCKERHUB_NAMESPACE}/accounting-backend:${GIT_SHORT}'; sh 'docker push ${DOCKERHUB_NAMESPACE}/accounting-frontend:${GIT_SHORT}' } } }
  }
}
