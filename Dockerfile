# Stage 1: Build the frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
# Copia e instala as dependências do frontend
COPY frontend/package*.json ./
RUN npm install
# Copia o código e gera o build estático
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the backend (com o frontend embutido)
FROM eclipse-temurin:21-jdk-alpine AS backend-build
WORKDIR /app
# Prepara a construção do backend
COPY backend/gradlew .
COPY backend/gradle gradle
COPY backend/build.gradle.kts .
COPY backend/settings.gradle.kts .
RUN ./gradlew dependencies --no-daemon

COPY backend/src src
# Copia o build do frontend para a pasta estática do Spring Boot ANTES de gerar o jar
COPY --from=frontend-build /app/frontend/dist src/main/resources/static

# Constrói o jar final
RUN ./gradlew build -x test --no-daemon

# Stage 3: Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# Cria o diretório de dados para evitar erro de montagem no SQLite
RUN mkdir -p /app/data
# Copia o jar do estágio anterior
COPY --from=backend-build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
