const express = require('express');
const app = express();
const PORT = 8080;

app.get('/', (req, res) => {
  const now = new Date().toISOString();
  res.send(`Servidor OK - resposta em ${now}`);
});

app.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});
