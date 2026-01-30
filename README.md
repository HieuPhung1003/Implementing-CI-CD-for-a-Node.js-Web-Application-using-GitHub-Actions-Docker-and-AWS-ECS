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

## 3. Kiến trúc hệ thống
Hệ thống được triển khai theo mô hình *CI/CD tự động hóa trên AWS*, giúp tự động build – push – deploy ứng dụng Node.js mà không cần thao tác thủ công.  
Pipeline được điều khiển bởi *GitHub Actions*, sử dụng *Docker*, *Amazon ECR*, *ECS (Fargate)* và *CloudWatch Logs* để đảm bảo quy trình triển khai liên tục, ổn định và bảo mật.

---

### Sơ đồ kiến trúc hệ thống

<p align="center">
  <img src="docs/structer_aws.png" alt="Kiến trúc hệ thống CI/CD AWS ECS" width="750">
</p>

<p align="center"><em>Hình 1 – Kiến trúc hệ thống CI/CD triển khai ứng dụng Node.js trên AWS ECS Fargate</em></p>

---

### 🔁 Mô tả quy trình hoạt động

1. *Developer* push code lên GitHub repository.  
2. *GitHub Actions* tự động kích hoạt workflow:
   - Build Docker image của ứng dụng Node.js.  
   - Push image mới lên *Amazon ECR*.  
   - Cập nhật *ECS Service* để triển khai container mới (Fargate Task).  
3. *ECS Fargate* tự động chạy container mới.  
4. *CloudWatch Logs* thu thập và lưu trữ log ứng dụng.  
5. Ứng dụng được truy cập qua *Public Internet* thông qua port *3000*.

---

### ⚙️ Các thành phần chính

| Thành phần | Vai trò | Công nghệ / Dịch vụ |
|-------------|----------|---------------------|
| *GitHub Actions* | Tự động hóa quy trình build và deploy | CI/CD Pipeline |
| *Docker* | Đóng gói ứng dụng Node.js | Containerization |
| *Amazon ECR* | Lưu trữ Docker image | AWS Elastic Container Registry |
| *Amazon ECS (Fargate)* | Chạy container mà không cần máy chủ | Serverless Container |
| *CloudWatch Logs* | Theo dõi log ứng dụng và task ECS | AWS Monitoring |
| *Public Internet (Port 3000)* | Cổng truy cập ứng dụng Node.js | Web Access Endpoint |

---

### 🌐 Luồng triển khai CI/CD

```text
Developer
   │
   ├── Push code lên GitHub
   │
   ▼
GitHub Actions
   ├── Build Docker Image
   ├── Push lên ECR
   └── Update ECS Service
   │
   ▼
AWS ECS (Fargate)
   ├── Tự động chạy container mới
   └── Ghi log vào CloudWatch
   │
   ▼
Public Internet (Port 3000)
   └── Người dùng truy cập ứng dụng