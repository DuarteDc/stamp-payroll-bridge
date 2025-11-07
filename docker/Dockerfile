# Imagen base con Node
FROM node:trixie

# Instala pnpm globalmente (sin corepack)
RUN npm install -g pnpm

# Define el directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instala las dependencias
RUN pnpm install

# Copia el resto del código fuente
COPY . .

# Expone el puerto
EXPOSE 3000

# Comando por defecto: modo desarrollo
CMD ["pnpm", "run", "start:dev"]
