# Base image
FROM node:18

# Thư mục làm việc trong container
WORKDIR /app

# Copy package.json và package-lock.json
COPY apps/web-node/package*.json ./

# Cài đặt dependencies
RUN npm install
# RUN npm ci --only=production

# Tạo Prisma client
RUN npx prisma generate

# Copy toàn bộ source code
COPY apps/web-node ./

# Expose port
EXPOSE 3000

# Lệnh chạy ứng dụng
CMD ["npm", "start"]
