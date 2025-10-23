import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Rutas reales
import maquinasRoutes from "./routes/maquinas.js";
import contactRouter from "./routes/contact.js";

dotenv.config();

const app = express();

// CORS: solo en desarrollo (para Vite)
if (process.env.NODE_ENV !== "production") {
  app.use(cors());
}

app.use(express.json());

/** 🔎 Health-check: igual que en el probe, pero bajo /api */
app.get("/api/health", (_req, res) => res.json({ ok: true }));

/** ✨ Montá tus rutas reales bajo /api */
app.use("/api/maquinas", maquinasRoutes);
app.use("/api/contact", contactRouter);

/** (Opcional) Manejo simple de 404 en API */
app.use("/api", (_req, res) => res.status(404).json({ error: "Not found" }));

/** (Opcional) Manejo de errores */
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "INTERNAL_ERROR" });
});

const PORT = Number(process.env.PORT || 3001);

/** 👇 Igual que el probe: escuchar en todas las interfaces */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ API escuchando en http://localhost:${PORT}`);
});
