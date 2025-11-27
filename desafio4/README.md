## 📝 Desafio 4 — Microsserviços Independentes (Docker + Node.js)

## Visão Geral
Dois microsserviços Node.js rodando em containers distintos, cada um com seu Dockerfile, comunicando-se apenas via HTTP dentro de uma rede Docker (`desafio4-net`). O objetivo é mostrar como serviços isolados trocam dados sem compartilhar código ou pastas.

**Serviços**
- `service-a` (Users API) → responde usuários.
- `service-b` (Summary API) → consome `service-a` e retorna mensagens resumidas.

## Arquitetura
```
                      Rede Docker: desafio4-net
       ┌────────────────────────────────────────────────────────┐
       │                                                        │
       │           http://service-a:3001/users                  │
       │                                                        │
┌──────────────┐                                     ┌────────────────┐
│  Service A   │                                     │   Service B    │
│   Users API  │  ─────────────── HTTP GET ───────→  │ Summary API    │
│   Porta 3001 │                                     │   Porta 3002   │
└──────────────┘                                     └────────────────┘
                 │                               │
                 │                               │
                 └──────────── Porta mapeada ────┘
                                para o Host
```

- `service-a`: GET `/users`, porta interna 3001, container `service-a`.
- `service-b`: GET `/summary`, porta interna 3002, container `service-b`.

## Estrutura
```
desafio4/
 ├── service-a/
 │     ├── Dockerfile
 │     ├── package.json
 │     └── index.js
 ├── service-b/
 │     ├── Dockerfile
 │     ├── package.json
 │     └── index.js
 └── README.md
```

## Microsserviço A — Users API
### `service-a/index.js`
```js
const express = require("express");
const app = express();
const PORT = 3001;

const users = [
  { id: 1, name: "João", activeSince: "2022-01-10" },
  { id: 2, name: "Maria", activeSince: "2023-03-21" },
  { id: 3, name: "Pedro", activeSince: "2021-09-14" }
];

app.get("/users", (_, res) => res.json(users));

app.listen(PORT, () => console.log(`Service A rodando na porta ${PORT}`));
```

### `service-a/Dockerfile`
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## Microsserviço B — Summary API
### `service-b/index.js`
```js
const express = require("express");
const axios = require("axios");
const app = express();
const PORT = 3002;

const SERVICE_A_URL = "http://service-a:3001/users";

app.get("/summary", async (_, res) => {
  try {
    const response = await axios.get(SERVICE_A_URL);
    const summary = response.data.map(user => ({
      message: `${user.name} está ativo desde ${user.activeSince}`
    }));
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: "Erro ao consultar Service A", details: err.message });
  }
});

app.listen(PORT, () => console.log(`Service B rodando na porta ${PORT}`));
```

### `service-b/Dockerfile`
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3002
CMD ["npm", "start"]
```

## Comunicação via DNS Docker
- Dentro da rede `desafio4-net`, `service-b` acessa `http://service-a:3001/users`.
- O DNS interno resolve o nome `service-a`; não é preciso expor a porta para o host para comunicação interna nem usar IP fixo.

## Passo a Passo
1. Criar a rede:
   ```bash
   docker network create desafio4-net
   ```
2. Build das imagens:
   ```bash
   docker build -t service-a ./desafio4/service-a
   docker build -t service-b ./desafio4/service-b
   ```
3. Subir `service-a`:
   ```bash
   docker run --rm \
     --name service-a \
     --network desafio4-net \
     -p 3001:3001 \
     service-a
   ```
   Teste: `http://localhost:3001/users`
4. Subir `service-b` em outro terminal:
   ```bash
   docker run --rm \
     --name service-b \
     --network desafio4-net \
     -p 3002:3002 \
     service-b
   ```
   Teste: `http://localhost:3002/summary`

## Resultados Esperados
`service-a` (`/users`):
```json
[
  { "id": 1, "name": "João", "activeSince": "2022-01-10" },
  { "id": 2, "name": "Maria", "activeSince": "2023-03-21" },
  { "id": 3, "name": "Pedro", "activeSince": "2021-09-14" }
]
```

`service-b` (`/summary`):
```json
[
  { "message": "João está ativo desde 2022-01-10" },
  { "message": "Maria está ativo desde 2023-03-21" },
  { "message": "Pedro está ativo desde 2021-09-14" }
]
```
Mostra a comunicação HTTP, a rede Docker funcional e o isolamento entre serviços.

## Decisões Técnicas
- Node.js para agilidade na criação de APIs.
- Dockerfile por serviço para isolar dependências.
- Rede customizada para comunicação segura.
- Axios para consumo HTTP interno.
- Estrutura mínima para focar nos conceitos de microsserviços.

## Conclusão
O desafio evidencia:
- serviços realmente independentes;
- comunicação via HTTP e DNS interno;
- empacotamento isolado com Docker;
- rede customizada conectando os serviços.
Atende aos requisitos propostos e reforça práticas fundamentais de microsserviços.
