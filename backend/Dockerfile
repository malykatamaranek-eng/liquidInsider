FROM node:18-slim

<<<<<<< copilot/add-curl-to-dockerfile
# Install OpenSSL for Prisma and curl for health checks (node:18-slim requires explicit installation)
=======

>>>>>>> main
RUN apt-get update -y && apt-get install -y openssl curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3001

CMD ["npm", "run", "dev"]
