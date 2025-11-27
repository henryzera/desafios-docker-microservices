# Imagem base minimalista
FROM alpine:3.20

# Instala curl
RUN apk add --no-cache curl

WORKDIR /app

# Copia o script de loop
COPY curl-script.sh .

# Garante que o script é executável
RUN chmod +x curl-script.sh

# Variável de ambiente padrão (pode ser sobrescrita)
ENV SERVER_URL=http://web:8080

# Ao iniciar o container, roda o script
CMD ["./curl-script.sh"]
