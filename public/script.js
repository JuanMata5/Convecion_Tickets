// public/script.js

// Función para crear un ticket
async function crearTicket() {
  try {
    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: "Juan Pérez",
        email: "juan@example.com",
        evento: "Concierto",
        categoria: "vip"
      })
    });

    if (!res.ok) {
      console.error("Error en la petición:", res.status, res.statusText);
      return;
    }

    const data = await res.json();
    console.log("Ticket creado:", data);
  } catch (err) {
    console.error("Error al conectar con la API:", err);
  }
}

// Llamar a la función con un botón
document.getElementById("crearTicketBtn")?.addEventListener("click", () => {
  crearTicket();
});
