FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY . .

EXPOSE 3000

HEALTHCHECK --interval=30s CMD node -e "require('http').get('http://localhost:3000/health')"

CMD ["node", "src/index.js"]
