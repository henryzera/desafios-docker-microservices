📝 Desafio 2 — Volumes e Persistência de Dados com Docker

## Visão Geral
O projeto mostra como volumes Docker preservam arquivos mesmo após a remoção dos containers.  
Foi utilizado Node.js com Express e SQLite, pois o banco baseado em arquivo evidencia o comportamento dos volumes.  
Um segundo container opcional lê o mesmo volume para provar que os dados pertencem ao volume e não ao container.

## Objetivos
- Criar um serviço que grava em um banco SQLite.
- Persistir o arquivo `database.db` em um volume (`desafio2-data`).
- Demonstrar que os dados permanecem após parar/remover o container.
- (Opcional) Mostrar outro container lendo o mesmo volume.

## Arquitetura
```
                 ┌────────────────────────────────────────┐
                 │             Volume Docker              │
                 │          (desafio2-data)               │
                 │   /app/data/database.db (persistente)  │
                 └────────────────────────────────────────┘
                        ▲                        ▲
                        │                        │
                        │                        │
           ┌──────────────────────┐   ┌───────────────────────┐
           │   Writer Service     │   │    Reader Service      │
           │ (grava no SQLite)    │   │ (lê o mesmo SQLite)    │
           │  Porta 3000          │   │   Porta 4000           │
           └──────────────────────┘   └───────────────────────┘
```

## Componentes
### Writer Service (`app/`)
- Cria o arquivo `database.db`, tabela `visitantes` e insere um registro em cada subida.
- Endpoint `/` lista todos os registros.
- Trabalha com o volume `desafio2-data:/app/data`.

### Reader Service (`reader/`) — opcional
- Monta o mesmo volume para leitura.
- Endpoint `/read` retorna todos os registros existentes.
- Mostra que outro container acessa os mesmos dados persistidos.

## Estrutura de Pastas
```
desafio2/
 ├── app/
 │    ├── Dockerfile
 │    ├── index.js        (writer)
 │    └── package.json
 ├── reader/
 │    ├── Dockerfile
 │    ├── reader.js       (reader)
 │    └── package.json
 └── README.md
```

## Funcionamento dos Serviços
### Writer
1. Usa SQLite para gravar em `/app/data/database.db`.
2. Na inicialização: cria a tabela se não existir e insere um registro com timestamp.
3. `/` retorna todos os visitantes armazenados.
4. Como o arquivo está no volume, ele permanece mesmo com `docker run --rm`.

### Reader (opcional)
1. Monta `desafio2-data:/app/data`.
2. Apenas lê o banco e responde em `/read`.
3. Demonstra que múltiplos containers compartilham o mesmo volume.

## Preparação
Criar o volume uma única vez:
```bash
docker volume create desafio2-data
```

## Build das Imagens
```bash
# Writer
docker build -t desafio2-sqlite ./desafio2/app

# Reader (opcional)
docker build -t desafio2-reader ./desafio2/reader
```

## Execução
### Writer Service
```bash
docker run --rm \
  --name writer \
  -p 3000:3000 \
  -v desafio2-data:/app/data \
  desafio2-sqlite
```
Aplicação disponível em `http://localhost:3000`. Cada reinicialização insere um novo visitante.

### Testando Persistência
1. Acesse `http://localhost:3000` e observe a lista.
2. Pare o container (`CTRL+C`).
3. Rode o comando novamente.
4. Os registros anteriores permanecem e um novo item é adicionado.

### Reader Service (opcional)
```bash
docker run --rm \
  --name reader \
  -p 4000:4000 \
  -v desafio2-data:/app/data \
  desafio2-reader
```
Acesse `http://localhost:4000/read` e veja os mesmos dados, provando a persistência compartilhada.

## Exemplos de Resposta
**Writer**
```json
[
  { "id": 1, "nome": "Visitante 2025-11-27 15:01" },
  { "id": 2, "nome": "Visitante 2025-11-27 15:02" }
]
```

**Reader**
```json
[
  { "id": 1, "nome": "Visitante 2025-11-27 15:01" },
  { "id": 2, "nome": "Visitante 2025-11-27 15:02" }
]
```

## Decisões Técnicas
- SQLite destaca bem o conceito de volume por ser baseado em arquivos.
- Volume `desafio2-data` mantém `database.db` fora do ciclo de vida do container.
- Containers separados (writer/reader) mostram independência e compartilhamento de dados.
- Base `node:20-alpine` reduz tamanho das imagens.
- Uso de `--rm` mantém o ambiente limpo durante testes.

## Conclusão
O desafio comprova que:
- Containers podem ser descartáveis enquanto os volumes preservam os dados.
- Volumes sobrevivem a paradas/remoções e podem ser compartilhados.
- A solução continua simples e clara graças aos Dockerfiles e à arquitetura modular.
