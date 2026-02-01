import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Importar rutas
try {
  const { default: ticketsRoutes } = await import("../backend/routes/tickets.js");
  app.use("/api/tickets", ticketsRoutes);
} catch (error) {
  console.error("Error importing tickets routes:", error);
}

export default app;
