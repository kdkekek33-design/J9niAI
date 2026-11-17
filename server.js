const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    app: "j9niAI",
    status: "online",
    message: "Привет! Сервер работает."
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("j9niAI server started");
});
