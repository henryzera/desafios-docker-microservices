const express = require("express");
const app = express();
const PORT = 4002;

const orders = [
  { id: 101, product: "Notebook", userId: 1 },
  { id: 102, product: "Headset", userId: 2 }
];

app.get("/orders", (_, res) => {
  res.json(orders);
});

app.listen(PORT, () => {
  console.log("Orders Service rodando na porta", PORT);
});
