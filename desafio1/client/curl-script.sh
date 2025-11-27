#!/bin/sh

SERVER_URL=${SERVER_URL:-http://web:8080}

while true; do
  echo "[$(date)] Fazendo requisição para $SERVER_URL"
  curl -s "$SERVER_URL" || echo "Erro ao conectar no servidor"
  echo ""  # quebra de linha
  sleep 5
done
