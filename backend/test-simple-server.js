import http from "http";
import fs from "fs";

const logFile = "./test-server.log";

fs.writeFileSync(logFile, "Starting simple server...\n");

const server = http.createServer((req, res) => {
  fs.appendFileSync(logFile, `Received request: ${req.method} ${req.url}\n`);
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello from simple server");
});

server.listen(5000, "127.0.0.1", () => {
  fs.appendFileSync(logFile, "✅ Simple server listening on port 5000\n");
  console.log("✅ Simple server listening on port 5000");
});

server.on("error", (err) => {
  fs.appendFileSync(logFile, `❌ Server error: ${err.message}\n`);
  console.error("❌ Server error:", err);
  process.exit(1);
});

// Keep process alive
setInterval(() => {
  fs.appendFileSync(logFile, `Server alive at ${new Date().toISOString()}\n`);
}, 5000);
