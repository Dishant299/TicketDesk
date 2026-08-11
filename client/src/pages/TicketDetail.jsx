import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getTicketById, updateTicket } from '../api';

function TicketDetail() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('Open');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTicket = async () => {
      try {
        const data = await getTicketById(ticketId);
        setTicket(data);
        setStatus(data.status || 'Open');
      } catch {
        setError('Unable to load this ticket.');
      } finally {
        setLoading(false);
      }
    };

    loadTicket();
  }, [ticketId]);

  const handleStatusChange = async (nextStatus) => {
    try {
      await updateTicket(ticketId, { status: nextStatus });
      setStatus(nextStatus);
    } catch {
      setError('Unable to update status.');
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!note.trim()) return;

    try {
      await updateTicket(ticketId, { notes: note.trim() });
      const data = await getTicketById(ticketId);
      setTicket(data);
      setNote('');
    } catch {
      setError('Unable to add note.');
    }
  };

  if (loading) {
    return <div className="text-slate-500 py-8 text-center">Loading ticket...</div>;
  }

  if (!ticket) {
    return <div className="text-slate-500 py-8 text-center">Ticket not found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-xl p-6">
      <Link to="/" className="text-sm text-slate-600 inline-block mb-3">← Back to tickets</Link>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-mono text-sm text-indigo-600 font-semibold">{ticket.ticket_id}</div>
          <div className="text-xl font-semibold">{ticket.subject}</div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${status === 'Closed' ? 'bg-emerald-100 text-emerald-700' : status === 'In Progress' ? 'bg-sky-100 text-sky-700' : 'bg-amber-100 text-amber-800'}`}>
          {status}
        </div>
      </div>

      <div className="flex gap-6 border-y border-slate-100 py-3 mb-4 text-sm">
        <div>
          <div className="text-xs text-slate-500 uppercase">Customer</div>
          <div>{ticket.customer_name}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 uppercase">Email</div>
          <div>{ticket.customer_email}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 uppercase">Created</div>
          <div className="font-mono text-sm text-slate-500">{new Date(ticket.created_at).toLocaleString()}</div>
        </div>
      </div>

      <div className="bg-slate-50 rounded-md p-3 mb-4 text-sm">{ticket.description || 'No description provided.'}</div>

      <div className="flex gap-2 mb-4">
        {['Open', 'In Progress', 'Closed'].map((option) => (
          <button
            key={option}
            type="button"
            className={`flex-1 text-sm font-semibold py-2 rounded-md border ${status === option ? 'border-slate-900 text-white bg-slate-900' : 'border-slate-200 text-slate-600 bg-white'}`}
            onClick={() => handleStatusChange(option)}
          >
            {option}
          </button>
        ))}
      </div>

      {error && <div className="bg-red-50 text-red-700 px-4 py-2 rounded-md mb-3">{error}</div>}

      <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Notes</div>
      {ticket.notes?.length ? (
        ticket.notes.map((noteItem, index) => (
          <div key={`${noteItem.createdAt || index}`} className="bg-slate-50 rounded-md p-3 mb-2 text-sm">
            <div>{noteItem.content}</div>
            <div className="text-xs text-slate-500 font-mono mt-2">{noteItem.author} • {new Date(noteItem.createdAt).toLocaleString()}</div>
          </div>
        ))
      ) : (
        <div className="bg-slate-50 rounded-md p-3 mb-2 text-sm">No notes yet.</div>
      )}

      <form onSubmit={handleAddNote} className="flex gap-3 mt-3">
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note"
          className="flex-1 px-3 py-2 border border-slate-200 rounded-md"
        />
        <button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded-md">Add</button>
      </form>
    </div>
  );
}

export default TicketDetail;
