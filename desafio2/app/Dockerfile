FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Pasta onde ficará o arquivo database.db
RUN mkdir -p data

EXPOSE 3000

CMD ["npm", "start"]
