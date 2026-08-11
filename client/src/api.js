const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const getTickets = async () => {
  const response = await fetch(`${API_BASE_URL}/tickets`);
  if (!response.ok) {
    throw new Error('Failed to fetch tickets');
  }
  return response.json();
};

export const createTicket = async (ticketData) => {
  const response = await fetch(`${API_BASE_URL}/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ticketData),
  });

  if (!response.ok) {
    throw new Error('Failed to create ticket');
  }

  return response.json();
};

export const getTicketById = async (ticketId) => {
  const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch ticket');
  }
  return response.json();
};

export const updateTicket = async (ticketId, data) => {
  const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update ticket');
  }

  return response.json();
};
