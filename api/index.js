import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Importar rutas - sin dinámico
try {
  const { default: ticketsRoutes } = await import("../backend/routes/tickets.js");
  app.use("/api/tickets", ticketsRoutes);
} catch (error) {
  console.error("ERROR Loading routes:", error);
  app.use("/api/tickets", (req, res) => res.status(500).json({ error: error.message }));
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
