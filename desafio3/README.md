## 📝 Desafio 3 — Orquestração de Serviços com Docker Compose

## Visão Geral
O desafio orquestra três serviços via Docker Compose:
- **web**: Node.js/Express servindo uma API na porta 3000.
- **db**: PostgreSQL como base relacional.
- **cache**: Redis para cache/armazenamento chave-valor.

Todos rodam em uma rede interna gerenciada pelo Compose, que garante inicialização ordenada, comunicação via DNS interno e persistência para o banco.

## Objetivos
- Integrar os três serviços em um único `docker-compose.yml`.
- Isolar cada responsabilidade em um container.
- Configurar rede, variáveis de ambiente e volume persistente.
- Validar comunicação web → Postgres e web → Redis.

## Arquitetura
```
                    ┌──────────────────────────────────┐
                    │            Rede Interna           │
                    │        (compose internal net)     │
                    └──────────────────────────────────┘
                         ▲              ▲             ▲
                         │              │             │
                  ┌───────────┐   ┌──────────┐   ┌──────────┐
                  │   WEB     │   │   DB     │   │  CACHE   │
                  │ Node/Exp. │   │ Postgres │   │  Redis   │
                  │ 3000      │   │ 5432     │   │ 6379     │
                  └───────────┘   └──────────┘   └──────────┘
                          │             │            │
                          └─────────────┴────────────┘
              WEB acessa DB e Redis usando hosts "db" e "cache".
```

**Detalhes**
- Rede interna limita o acesso a dentro do Compose.
- Apenas o serviço web expõe porta para o host.
- `depends_on` garante ordem de subida.
- Variáveis de ambiente injetam credenciais.
- Volume `pgdata` mantém o Postgres persistente.

## Estrutura
```
desafio3/
 ├── web/
 │     ├── Dockerfile
 │     ├── package.json
 │     └── server.js
 ├── docker-compose.yml
 └── README.md
```

## Principais Arquivos
### `web/server.js`
```js
const express = require("express");
const { Pool } = require("pg");
const { createClient } = require("redis");

const app = express();
const PORT = 3000;

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: "db",
  database: process.env.POSTGRES_DB
});

const redis = createClient({ url: "redis://cache:6379" });
redis.connect();

app.get("/", async (_, res) => {
  try {
    const result = await pool.query("SELECT NOW() as now");
    await redis.set("mensagem", "Conexão com Redis OK!");
    const redisMsg = await redis.get("mensagem");

    res.json({
      postgres_horario: result.rows[0].now,
      redis: redisMsg
    });
  } catch (err) {
    res.json({ erro: err.message });
  }
});

app.listen(PORT, () => console.log("Web rodando na porta", PORT));
```

### `web/package.json`
```json
{
  "name": "desafio3-web",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": { "start": "node server.js" },
  "dependencies": {
    "express": "^4.19.0",
    "pg": "^8.11.0",
    "redis": "^4.6.0"
  }
}
```

### `web/Dockerfile`
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### `docker-compose.yml`
```yaml
version: "3.9"
services:
  web:
    build: ./web
    container_name: web
    ports:
      - "3000:3000"
    environment:
      POSTGRES_USER: henry
      POSTGRES_PASSWORD: 123
      POSTGRES_DB: desafio3db
    depends_on:
      - db
      - cache
    networks:
      - internal

  db:
    image: postgres:15
    container_name: db
    environment:
      POSTGRES_USER: henry
      POSTGRES_PASSWORD: 123
      POSTGRES_DB: desafio3db
    volumes:
      - pgdata:/var/lib/postgresql/data
    networks:
      - internal

  cache:
    image: redis:7
    container_name: cache
    networks:
      - internal

networks:
  internal:

volumes:
  pgdata:
```

## Execução
Dentro de `desafio3/`:
```bash
docker compose up --build
```
O Compose criará a rede, volume `pgdata`, subirá Postgres e Redis e, por último, construirá o serviço web.

## Testes
Abra `http://localhost:3000`.  
Resposta esperada:
```json
{
  "postgres_horario": "2025-11-27T18:40:22.521Z",
  "redis": "Conexão com Redis OK!"
}
```
Indica comunicação bem-sucedida com Postgres e Redis.

## Logs e Monitoramento
```bash
docker compose logs web
docker compose logs db
docker compose logs cache
docker ps
```

## Encerrando
- Parar serviços: `docker compose down`
- Parar e remover volume persistente: `docker compose down -v`

## Decisões Técnicas
- Postgres e Redis são serviços reais amplamente usados.
- `depends_on`, rede interna e variáveis de ambiente asseguram isolamento e ordem.
- Volume `pgdata` mantém o banco entre execuções.
- Básico Node.js garante facilidade para expandir o serviço web.

## Conclusão
Este desafio comprova como usar o Docker Compose para:
- orquestrar múltiplos serviços com rede interna e DNS automático;
- manter persistência para bancos;
- expor apenas o serviço necessário ao host;
- estruturar um projeto multi-container limpo e próximo de cenários reais.
