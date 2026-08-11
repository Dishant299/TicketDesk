import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import NewTicket from './pages/NewTicket';
import TicketDetail from './pages/TicketDetail';

function App() {
  const location = useLocation();

  return (
    <div className="max-w-[1080px] mx-auto px-6 py-7">
      <header className="flex items-center justify-between mb-7">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-slate-900 flex items-center justify-center text-white font-bold text-sm">T</div>
          <div>
            <div className="font-semibold text-lg">Ticket Desk</div>
            <div className="text-xs text-slate-500">Support CRM</div>
          </div>
        </Link>
        {location.pathname !== '/new' && (
          <Link to="/new" className="bg-slate-900 text-white px-4 py-2 rounded-md font-medium">
            + New ticket
          </Link>
        )}
      </header>

      <main className="space-y-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/new" element={<NewTicket />} />
          <Route path="/tickets/:ticketId" element={<TicketDetail />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;