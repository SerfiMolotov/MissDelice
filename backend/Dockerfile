FROM node:18-alpine

WORKDIR /app

# On copie les package.json du dossier backend
COPY package*.json ./
RUN npm install

# On copie tout le dossier backend
COPY . .

EXPOSE 3000
CMD ["node", "server.js"]