const express = require("express");
const axios = require("axios");
const app = express();
const PORT = 3000;

const USERS_URL = "http://users-service:4001/users";
const ORDERS_URL = "http://orders-service:4002/orders";

app.get("/users", async (_, res) => {
  const users = await axios.get(USERS_URL);
  res.json(users.data);
});

app.get("/orders", async (_, res) => {
  const orders = await axios.get(ORDERS_URL);
  res.json(orders.data);
});

app.listen(PORT, () => {
  console.log("API Gateway rodando na porta", PORT);
});
