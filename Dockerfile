# ETAPA 1: Construir el Frontend (React)
FROM node:18-alpine as build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# ETAPA 2: Configurar el Backend (Node) y servir todo
FROM node:18-alpine
WORKDIR /app
# Copiamos los archivos del backend
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install --production
COPY server/ ./

# Copiamos el 'build' de React que hicimos en la etapa 1 a la carpeta del server
# Nota: Asegúrate que tu server.js apunte a ../client/dist o ajusta esta ruta
COPY --from=build /app/client/dist ../client/dist

EXPOSE 3000
CMD ["node", "index.js"]