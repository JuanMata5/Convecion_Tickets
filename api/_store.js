export const tickets = [];
export function addTicket(t) { tickets.push(t); }
export function listTickets() { return tickets; }
export function findByCodigo(codigo) { return tickets.find(t => t.codigo === codigo); }
export function deleteByCodigo(codigo) { const i = tickets.findIndex(t => t.codigo === codigo); if (i === -1) return false; tickets.splice(i,1); return true; }
