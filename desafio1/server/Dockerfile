# Imagem base leve de Node
FROM node:20-alpine

# Diretório de trabalho dentro do container
WORKDIR /app

# Copia apenas package.json para instalar dependências
COPY package*.json ./

# Instala apenas dependências de produção
RUN npm install --production

# Copia o resto dos arquivos
COPY . .

# Expõe a porta 8080 (documentação)
EXPOSE 8080

# Comando default ao subir o container
CMD ["npm", "start"]
