const express = require("express");
const axios = require("axios");
const app = express();
const PORT = 3002;

// Service A endpoint URL
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

app.listen(PORT, () => {
  console.log(`Service B (summary) rodando na porta ${PORT}`);
});
