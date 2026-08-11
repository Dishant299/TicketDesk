const Ticket = require('../models/Ticket');
const Note = require('../models/Note');

// Generate the next sequential ticket ID in the format TKT-001, TKT-002, and so on.
async function generateTicketId() {
  const count = await Ticket.countDocuments();
  return `TKT-${String(count + 1).padStart(3, '0')}`;
}

// Create a new support ticket.
exports.createTicket = async (req, res) => {
  try {
    const { customer_name, customer_email, subject, description } = req.body;

    if (!customer_name || !customer_email || !subject) {
      return res.status(400).json({
        error: 'customer_name, customer_email, and subject are required.',
      });
    }

    const ticket_id = await generateTicketId();

    const ticket = await Ticket.create({
      ticket_id,
      customer_name,
      customer_email,
      subject,
      description,
    });

    res.status(201).json({
      ticket_id: ticket.ticket_id,
      created_at: ticket.created_at,
    });
  } catch (err) {
    res.status(500).json({ 
        error: err.message 
    });
  }
};

// Fetch tickets with optional filtering by status and search text.
exports.getTickets = async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status && ['Open', 'In Progress', 'Closed'].includes(status)) {
      query.status = status;
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { customer_name: regex },
        { customer_email: regex },
        { ticket_id: regex },
        { subject: regex },
        { description: regex },
      ];
    }

    const tickets = await Ticket.find(query)
      .sort({ created_at: -1 })
      .select('ticket_id customer_name customer_email subject status created_at');

    res.json(tickets);
  } catch (err) {
    res.status(500).json({ 
        error: err.message 
    });
  }
};

// Fetch a single ticket by its ticket ID, including related notes.
exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ ticket_id: req.params.ticket_id });
    if (!ticket) return res.status(404).json({ 
        error: 'Ticket not found' 
    });

    const notes = await Note.find({ ticketId: ticket._id }).sort({ createdAt: 1 });

    res.json({ ...ticket.toObject(), notes });
  } catch (err) {
    res.status(500).json({ 
        error: err.message 
    });
  }
};

// Update a ticket status and optionally add a new note.
exports.updateTicket = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const ticket = await Ticket.findOne({ ticket_id: req.params.ticket_id });
    if (!ticket) return res.status(404).json({ 
        error: 'Ticket not found' 
    });

    if (status) {
      if (!['Open', 'In Progress', 'Closed'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
      }
      ticket.status = status;
      await ticket.save();
    }

    if (notes) {
      await Note.create({
        ticketId: ticket._id,
        content: notes,
        author: 'Support Agent',
      });
      ticket.updated_at = new Date();
      await ticket.save();
    }

    res.json({ success: true, updated_at: ticket.updated_at });
  } catch (err) {
    res.status(500).json({ 
        error: err.message 
    });
  }
};