# AWS Infrastructure Setup

## 1. Amazon ECR
- Repository: `webapp-ci-cd`
- Region: `ap-southeast-2`
- Lưu trữ Docker image được build từ GitHub Actions.

## 2. Amazon ECS
- Cluster: `webapp-cluster`
- Service: `webapp-service`
- Task Definition: `webapp-task`
- Network Mode: `awsvpc`
- Launch Type: `FARGATE`

## 3. Networking
- Subnets: Public
- Security Group: Cho phép HTTP (port 80)
- Public IP: gán tự động khi task chạy

## 4. Logging
- CloudWatch Logs: `/ecs/webapp-task`