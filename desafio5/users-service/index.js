const express = require("express");
const app = express();
const PORT = 4001;

const users = [
  { id: 1, name: "Henrique", age: 28 },
  { id: 2, name: "Amanda", age: 31 }
];

app.get("/users", (_, res) => {
  res.json(users);
});

app.listen(PORT, () => {
  console.log("Users Service rodando na porta", PORT);
});
