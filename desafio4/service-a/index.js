const express = require("express");
const app = express();
const PORT = 3001;

const users = [
  { id: 1, name: "João", activeSince: "2022-01-10" },
  { id: 2, name: "Maria", activeSince: "2023-03-21" },
  { id: 3, name: "Pedro", activeSince: "2021-09-14" }
];

app.get("/users", (_, res) => {
  res.json(users);
});

app.listen(PORT, () => {
  console.log(`Service A (users) rodando na porta ${PORT}`);
});
