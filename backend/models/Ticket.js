export default function Ticket(data) {
  return {
    id: data.id,
    nombre: data.nombre,
    email: data.email,
    evento: data.evento,
    categoria: data.categoria,
    codigo: data.codigo,
    usado: data.usado || false,
    creadoEn: data.creadoEn,
    usadoEn: data.usadoEn || null
  };
}
