# Implementing CI/CD for a Web Application using GitHub Actions, Docker, and AWS ECS 
## 1. Yêu cầu chức năng 
| STT | Chức năng | Mô tả | 
|-----|------------|-------| 
| 1 | **Quản lý mã nguồn trên GitHub** | Mã nguồn ứng dụng được lưu trữ, quản lý và kích hoạt pipeline CI/CD khi có thay đổi (push, pull request). | 
| 2 | **Tự động build Docker image** | Khi có commit mới, GitHub Actions tự động build Docker image từ Dockerfile. | 
| 3 | **Chạy kiểm thử tự động (Unit Test)** | Hệ thống tự động chạy các bài test trước khi triển khai để đảm bảo chất lượng phần mềm. | 
| 4 | **Đẩy image lên AWS ECR** | Sau khi build thành công, Docker image được push lên AWS Elastic Container Registry (ECR). | 
| 5 | **Triển khai ứng dụng lên AWS ECS** | AWS ECS tự động cập nhật container mới để chạy ứng dụng web trên Cloud. | 
| 6 | **Theo dõi log và trạng thái triển khai** | Pipeline ghi lại toàn bộ log, hiển thị kết quả build/deploy trong GitHub Actions và AWS CloudWatch. | 
## 2. Yêu cầu phi chức năng 
| STT | Loại yêu cầu | Mô tả | 
|-----|----------------|------| 
| 1 | **Tính tự động hóa** | Toàn bộ quá trình build, test và deploy được thực hiện tự động qua pipeline. | 
| 2 | **Khả năng mở rộng** | Có thể mở rộng hệ thống để triển khai nhiều service hoặc nhiều môi trường (dev, staging, prod). | 
| 3 | **Độ tin cậy** | Pipeline dừng lại nếu test thất bại để tránh triển khai phiên bản lỗi. | 
| 4 | **Tính nhất quán** | Môi trường triển khai đồng nhất nhờ container Docker. | 
| 5 | **Bảo mật** | Sử dụng GitHub Secrets và AWS IAM để quản lý thông tin đăng nhập an toàn. | 
| 6 | **Khả năng giám sát** | Theo dõi log và tình trạng triển khai qua GitHub Actions và AWS CloudWatch. | 
| 7 | **Hiệu năng triển khai** | Thời gian build và deploy được tối ưu để đảm bảo tốc độ cập nhật nhanh. | ## 3. Công nghệ sử dụng | Thành phần | Công nghệ | Mục đích | 
|-------------|------------|----------| 
| **Ngôn ngữ lập trình** | Node.js *(hoặc Python Flask / Java Spring Boot)* | Xây dựng ứng dụng web mẫu để triển khai CI/CD. | 
| **Quản lý mã nguồn** | Git + GitHub | Lưu trữ mã nguồn, quản lý phiên bản và chạy pipeline GitHub Actions. | 
| **Công cụ CI/CD** | GitHub Actions | Tự động hóa quá trình build, test và deploy. | 
| **Containerization** | Docker | Đóng gói ứng dụng để đảm bảo môi trường chạy đồng nhất. | 
| **Nền tảng Cloud** | AWS (Amazon Web Services) | Nền tảng triển khai ứng dụng web. | 
| **Lưu trữ container** | AWS ECR *(Elastic Container Registry)* | Lưu trữ Docker images. | 
| **Triển khai container** | AWS ECS *(Elastic Container Service - Fargate)* | Chạy container trên môi trường Cloud không cần quản lý server. | 
| **Giám sát hệ thống** | AWS CloudWatch | Theo dõi log và trạng thái container sau khi triển khai. | 
| **Bảo mật truy cập** | AWS IAM + GitHub Secrets | Bảo mật thông tin đăng nhập và quyền truy cập các dịch vụ Cloud. |

## System Architecture Diagram

```mermaid
flowchart TB
    subgraph Dev[Developer / GitHub Repository]
        A1[Commit & Push Code] --> A2[GitHub Actions Workflow]
    end

    subgraph CI[Continuous Integration - GitHub Actions]
        A2 --> B1[Build Docker Image]
        B1 --> B2[Tag Image with 'latest']
        B2 --> B3[Push to Amazon ECR]
    end

    subgraph AWS[AWS Cloud]
        B3 -->|New image pushed| C1[ECR Repository]
        C1 -->|Triggers new deployment| D1[ECS Cluster]
        D1 --> D2[ECS Service]
        D2 --> D3[ECS Task (Fargate Container)]
    end

    subgraph Runtime[Running Application]
        D3 -->|Serve HTTP traffic| E1[Public IP / ALB]
        E1 --> F1[End User Browser]
    end

    %% Styles
    classDef aws fill:#F2F7FF,stroke:#0073BB,stroke-width:1px;
    classDef github fill:#FFF8F2,stroke:#FF9900,stroke-width:1px;
    classDef runtime fill:#F9FFF2,stroke:#4CAF50,stroke-width:1px;
    class Dev,CI,AWS,Runtime aws;
    class A1,A2,B1,B2,B3 github;
    class D3,E1,F1 runtime;
