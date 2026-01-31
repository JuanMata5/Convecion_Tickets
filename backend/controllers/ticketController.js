import fs from "fs";
import nodemailer from "nodemailer";

// ----------------------------
// Archivo JSON para persistencia
// ----------------------------
const archivoTickets = "tickets.json";

// Cargar tickets desde archivo al iniciar
let tickets = [];
if (fs.existsSync(archivoTickets)) {
  tickets = JSON.parse(fs.readFileSync(archivoTickets));
}

// Guardar tickets en JSON
function guardarTickets() {
  fs.writeFileSync(archivoTickets, JSON.stringify(tickets, null, 2));
}

// ----------------------------
// Configurar Nodemailer (opcional)
// ----------------------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // desde .env
    pass: process.env.EMAIL_PASS  // desde .env
  }
});

// Verificar conexión con el servidor de correo
transporter.verify((error, success) => {
  if (error) console.error("Error transportador:", error);
  else console.log("Servidor de correo listo para enviar emails");
});

// ----------------------------
// Crear ticket
// ----------------------------
export function crearTicket(req, res) {
  const { nombre, email, evento, categoria } = req.body;

  if (!nombre || nombre.trim().split(" ").length < 2) {
    return res.status(400).json({ error: "Debe ingresar nombre y apellido" });
  }
  if (!email || !evento) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  const nombreClean = nombre.trim().toLowerCase();
  const emailClean = email.trim().toLowerCase();
  const eventoClean = evento.trim().toLowerCase();

  // ----------------------------
  // Validación de duplicados
  // ----------------------------
  const existe = tickets.find(t => 
    t.nombre.trim().toLowerCase() === nombreClean &&
    t.email.trim().toLowerCase() === emailClean &&
    t.evento.trim().toLowerCase() === eventoClean
  );

  if (existe) {
    return res.status(400).json({ error: "Ya existe un ticket para esta persona en este evento" });
  }

  const categoriasValidas = ["basico", "vip", "premium"];
  const categoriaFinal = categoriasValidas.includes(categoria) ? categoria : "basico";

  const codigo = "MPLA-" + Math.random().toString(36).substring(2, 8).toUpperCase();

  const ticket = {
    id: tickets.length + 1,
    nombre,
    email,
    evento,
    categoria: categoriaFinal,
    codigo,
    usado: false,
    creadoEn: new Date()
  };

  tickets.push(ticket);
  guardarTickets();

  // ----------------------------
  // Enviar correo al usuario
  // ----------------------------
  if (email) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Tu ticket para ${evento}`,
      html: `
        <h2>Hola ${nombre}!</h2>
        <p>Gracias por registrarte en ${evento}.</p>
        <p><strong>Código de ticket:</strong> ${codigo}</p>
        <p>Categoría: ${categoriaFinal}</p>
        <p>¡Preséntalo en la entrada!</p>
      `
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.error("Error enviando correo:", err);
      else console.log("Correo enviado:", info.response);
    });
  }

  res.json(ticket);
}

// ----------------------------
// Obtener ticket por código
// ----------------------------
export function obtenerTicket(req, res) {
  const ticket = tickets.find(t => t.codigo === req.params.codigo);
  if (!ticket) return res.status(404).json({ error: "Ticket no encontrado" });
  res.json(ticket);
}

// ----------------------------
// Marcar ticket como usado
// ----------------------------
export function marcarUsado(req, res) {
  const ticket = tickets.find(t => t.codigo === req.params.codigo);
  if (!ticket) return res.status(404).json({ error: "Ticket no encontrado" });
  if (ticket.usado) return res.status(400).json({ error: "Ticket ya fue usado" });

  ticket.usado = true;
  ticket.usadoEn = new Date();

  guardarTickets();
  res.json({ mensaje: "Ticket validado correctamente" });
}

// ----------------------------
// Listar todos los tickets (Admin)
// ----------------------------
export function listarTickets(req, res) {
  res.json(tickets);
}

// ----------------------------
// Eliminar ticket (Admin)
// ----------------------------
export function eliminarTicket(req, res) {
  const codigo = req.params.codigo;
  const index = tickets.findIndex(t => t.codigo === codigo);

  if (index === -1) return res.status(404).json({ error: "Ticket no encontrado" });

  tickets.splice(index, 1);
  guardarTickets();

  res.json({ mensaje: `Ticket ${codigo} eliminado correctamente` });
}