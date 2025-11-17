import express from "express";

const app = express();
const PORT = 5000;

app.get("/", (req, res) => {
  res.json({ message: "Simple test server" });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
}).on("error", (err) => {
  console.error("Listen error:", err);
});

// Test if port is available
import { createServer } from "net";
const server = createServer();
server.once("error", (err) => {
  console.error("Port 5000 is in use or unavailable:", err.code);
});
server.once("listening", () => {
  console.log("Port 5000 is available");
  server.close();
});
server.listen(5000);
