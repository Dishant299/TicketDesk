import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTickets } from '../api';

const filters = ['All', 'Open', 'In Progress', 'Closed'];

function Home() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const data = await getTickets();
        setTickets(data);
      } catch {
        setError('Unable to load tickets right now.');
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  const visibleTickets = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tickets.filter((ticket) => {
      const matchesFilter =
        activeFilter === 'All' || (ticket.status || 'Open') === activeFilter;

      if (!query) {
        return matchesFilter;
      }

      const haystack = `${ticket.ticket_id} ${ticket.subject} ${ticket.customer_name} ${ticket.customer_email}`.toLowerCase();
      return matchesFilter && haystack.includes(query);
    });
  }, [tickets, search, activeFilter]);

  const counts = useMemo(() => {
    return {
      all: tickets.length,
      open: tickets.filter((ticket) => (ticket.status || 'Open') === 'Open').length,
      inProgress: tickets.filter((ticket) => ticket.status === 'In Progress').length,
      closed: tickets.filter((ticket) => ticket.status === 'Closed').length,
    };
  }, [tickets]);

  return (
    <div>
      {error && <div className="bg-red-50 text-red-700 px-4 py-2 rounded-md mb-3">{error}</div>}

      <section className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-2xl font-bold">{counts.all}</div>
          <div className="text-xs text-slate-500 uppercase mt-1">All tickets</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-2xl font-bold">{counts.open}</div>
          <div className="text-xs text-slate-500 uppercase mt-1">Open</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-2xl font-bold">{counts.inProgress}</div>
          <div className="text-xs text-slate-500 uppercase mt-1">In progress</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-2xl font-bold">{counts.closed}</div>
          <div className="text-xs text-slate-500 uppercase mt-1">Closed</div>
        </div>
      </section>

      <section className="flex flex-wrap items-center gap-3 mb-4">
        <input
          className="flex-1 min-w-[220px] px-3 py-2 rounded-md border border-slate-200 bg-white focus:border-slate-400"
          placeholder="Search tickets"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="inline-flex bg-white border border-slate-200 rounded-md p-1">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              className={`px-3 py-1 text-sm font-medium rounded ${activeFilter === filter ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      {loading ? (
        <div className="text-center py-10 text-slate-500">Loading tickets...</div>
      ) : visibleTickets.length === 0 ? (
        <div className="text-center py-10 text-slate-500">No tickets match your filters.</div>
      ) : (
        <div className="space-y-3">
          {visibleTickets.map((ticket) => (
            <Link key={ticket.ticket_id} to={`/tickets/${ticket.ticket_id}`} className="block bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-slate-300">
              <div className="grid grid-cols-[88px_1fr_auto] sm:grid-cols-[96px_1fr_auto]">
                <div className="bg-indigo-50 p-3 border-r border-dashed border-indigo-100 flex flex-col items-center justify-center">
                  <div className="font-mono font-semibold text-indigo-600 text-sm">{ticket.ticket_id}</div>
                  <div className="text-xs text-slate-500">Ticket</div>
                </div>

                <div className="p-3 min-w-0">
                  <div className="font-semibold text-sm truncate">{ticket.subject}</div>
                  <div className="text-sm text-slate-500">{ticket.customer_name} • {ticket.customer_email}</div>
                </div>

                <div className="p-3 flex flex-col items-end justify-center gap-2">
                  <div className={`text-xs font-semibold px-2 py-1 rounded-full ${ticket.status === 'Closed' ? 'bg-emerald-100 text-emerald-700' : ticket.status === 'In Progress' ? 'bg-sky-100 text-sky-700' : 'bg-amber-100 text-amber-800'}`}>
                    {ticket.status || 'Open'}
                  </div>
                  <div className="text-xs text-slate-500 font-mono">{new Date(ticket.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
