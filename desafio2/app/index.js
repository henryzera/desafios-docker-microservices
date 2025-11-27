const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const app = express();

const PORT = 3000;

// Caminho do banco dentro do container (que será montado em volume)
const DB_PATH = "./data/database.db";

// Abre/cria o arquivo do banco
const db = new sqlite3.Database(DB_PATH);

db.serialize(() => {
  // Cria tabela caso não exista
  db.run("CREATE TABLE IF NOT EXISTS visitantes (id INTEGER PRIMARY KEY, nome TEXT)");

  // Insere um visitante novo toda vez que o container sobe
  db.run("INSERT INTO visitantes (nome) VALUES ('Visitante ' || datetime('now'))");
});

// Endpoint que lista os dados
app.get("/", (_, res) => {
  db.all("SELECT * FROM visitantes", (err, rows) => {
    if (err) return res.status(500).send(err);
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
