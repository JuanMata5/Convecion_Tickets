import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import ticketsRoutes from "./routes/tickets.js";

// --------------------
// Configurar dotenv
// --------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/tickets", ticketsRoutes);

// Servir frontend
app.use(express.static(path.join(__dirname, "public")));

// 404
app.use((req,res)=>res.status(404).json({ error: "Ruta no encontrada" }));

// 404 para frontend
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor escuchando en http://localhost:" + PORT);
});
