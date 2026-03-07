# Frontend Dockerfile - React + Vite
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files (เอาคำว่า Fortend/ ออก เพราะเราอยู่ข้างในแล้ว)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code (เอาคำว่า Fortend/ ออกเช่นกัน)
COPY . .

# Expose port
EXPOSE 5173

# Run development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]