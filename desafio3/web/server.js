const express = require("express");
const { Pool } = require("pg");
const { createClient } = require("redis");

const app = express();
const PORT = 3000;

// Postgres
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: "db",
  database: process.env.POSTGRES_DB
});

// Redis
const redis = createClient({
  url: "redis://cache:6379"
});
redis.connect();

app.get("/", async (_, res) => {
  try {
    // Testa Postgres
    const result = await pool.query("SELECT NOW() as now");

    // Testa Redis
    await redis.set("msg", "Conexão com Redis OK!");
    const message = await redis.get("msg");

    res.json({
      postgres: result.rows[0].now,
      redis: message
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log("Web service rodando na porta", PORT);
});
