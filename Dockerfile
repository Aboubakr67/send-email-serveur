FROM node:20-alpine

WORKDIR /app

# Copie les dépendances
COPY package*.json ./

# Installe en mode production
RUN npm ci --only=production

# Copie le code
COPY . .

# Expose le port
EXPOSE 3001

# Variable d'environnement
ENV NODE_ENV=production

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Démarre le serveur
CMD ["node", "server.js"]