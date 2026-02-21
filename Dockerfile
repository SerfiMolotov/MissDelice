# --- Construction du Frontend ---
FROM node:18-alpine as build
WORKDIR /app

# On copie les dépendances du frontend (qui sont à la racine)
COPY package*.json ./
RUN npm install

# On copie tout le reste du projet frontend
COPY . .

# On construit le site (crée le dossier dist)
RUN npm run build

# --- Serveur Nginx ---
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]