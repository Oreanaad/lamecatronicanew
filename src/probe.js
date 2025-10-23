import express from "express";

const app = express();

app.get('api/health', (_req, res) => 
  res.json({ ok: true, ts: Date.now()
  }))
  app.get("/api/health", (_req, res) => res.json({ ok: true }));
 
  app.listen(3001, '0.0.0.0', () => { console.log("escuhando en 3301")})