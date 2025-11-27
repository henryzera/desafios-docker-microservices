FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Pasta onde o volume será montado
RUN mkdir -p data

EXPOSE 4000

CMD ["npm", "start"]
