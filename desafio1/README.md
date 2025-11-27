## Visão Geral - Desafio 1
Dois containers Docker se comunicam por uma rede customizada:
- `server`: aplica Node.js/Express que responde na porta 8080.
- `client`: script `curl` que consulta o servidor a cada 5s.
- Ambos estão na rede `desafio1-net`, usando o DNS interno (ex.: `http://web:8080`).

## Arquitetura
```
              (rede Docker: desafio1-net)
 ┌────────────────┐           ┌──────────────────┐
 │    CLIENT      │  curl →   │      SERVER      │
 │ (curl loop)    │ --------> │ (Node/Express)   │
 │ Container      │           │ Porta 8080       │
 └────────────────┘           └──────────────────┘
```

## Componentes
### Server (Node.js + Express)
- Escuta a porta 8080 e retorna uma mensagem com timestamp.
- Imagem baseada em Node 20 Alpine.
- `Dockerfile` expõe 8080 e o container recebe nome `web`.

### Client (Alpine + curl)
- Executa `curl-script.sh`, disparando requisições a cada 5s.
- Não publica portas; apenas consome `http://web:8080`.
- Imagem mínima baseada em Alpine.

### Rede Docker
- Criada manualmente com `docker network create desafio1-net`.
- Permite comunicação via DNS interno (`web` ↔ `client`).

## Estrutura de Pastas
```
desafio1/
 ├── server/
 │    ├── Dockerfile
 │    ├── package.json
 │    └── server.js
 ├── client/
 │    ├── Dockerfile
 │    └── curl-script.sh
 └── README.md
```

## Decisões Técnicas
- Imagem Node 20 Alpine para equilibrar tamanho e recursos.
- Cliente em Alpine puro para manter o container leve.
- Dois Dockerfiles separados para clareza e reuso.
- Uso de `--rm` nos `docker run` para containers descartáveis.
- Porta 8080 exposta no host para testes externos quando necessário.

## Passo a Passo de Execução
1. Criar a rede:
   ```bash
   docker network create desafio1-net
   ```
2. Construir as imagens:
   ```bash
   docker build -t desafio1-web ./desafio1/server
   docker build -t desafio1-client ./desafio1/client
   ```
3. Subir o servidor:
   ```bash
   docker run --rm \
     --name web \
     --network desafio1-net \
     -p 8080:8080 \
     desafio1-web
   ```
   - Teste no navegador ou via `curl http://localhost:8080`.
4. Subir o cliente em outro terminal:
   ```bash
   docker run --rm \
     --name client \
     --network desafio1-net \
     -e SERVER_URL=http://web:8080 \
     desafio1-client
   ```

## Exemplos de Logs
**Client**
```
[2025-11-27T15:22:10Z] Fazendo requisição para http://web:8080
Servidor OK - resposta em 2025-11-27T15:22:10.320Z
```

**Server**
```
Servidor ouvindo na porta 8080
GET / - 200 OK
```

## Conclusão
O desafio mostra como:
- isolar servidor e cliente em containers dedicados;
- conectar serviços via rede Docker customizada;
- testar comunicação HTTP interna sem expor portas adicionais;
- estruturar um projeto simples com múltiplos Dockerfiles.
