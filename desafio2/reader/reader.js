const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const app = express();

const PORT = 4000;
const DB_PATH = "./data/database.db";

// Abre o banco existente
const db = new sqlite3.Database(DB_PATH);

app.get("/read", (_, res) => {
  db.all("SELECT * FROM visitantes", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log("Reader rodando na porta", PORT);
});
