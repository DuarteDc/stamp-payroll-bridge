# Imagen base con Node
FROM node:trixie

# Instala pnpm globalmente (sin corepack)
RUN npm install -g pnpm

# Define el directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instala las dependencias
RUN pnpm install --frozen-lockfile

# Copia el resto del código fuente
COPY . .

# Construye la aplicación
RUN pnpm run build

# Expone el puerto
EXPOSE 3000

# Comando por defecto
CMD ["node", "dist/main"]
