import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTicket } from '../api';

function NewTicket() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    subject: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createTicket(form);
      navigate('/');
    } catch {
      setError('Unable to create ticket.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white border border-slate-200 rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-3">Create a new ticket</h2>
      {error && <div className="bg-red-50 text-red-700 px-4 py-2 rounded-md mb-3">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="customer_name" className="block text-xs font-semibold text-slate-600 uppercase mb-1">Customer name</label>
          <input id="customer_name" name="customer_name" value={form.customer_name} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-200 rounded-md" />
        </div>

        <div>
          <label htmlFor="customer_email" className="block text-xs font-semibold text-slate-600 uppercase mb-1">Customer email</label>
          <input id="customer_email" name="customer_email" type="email" value={form.customer_email} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-200 rounded-md" />
        </div>

        <div>
          <label htmlFor="subject" className="block text-xs font-semibold text-slate-600 uppercase mb-1">Subject</label>
          <input id="subject" name="subject" value={form.subject} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-200 rounded-md" />
        </div>

        <div>
          <label htmlFor="description" className="block text-xs font-semibold text-slate-600 uppercase mb-1">Description</label>
          <textarea id="description" name="description" rows="5" value={form.description} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-md resize-y" />
        </div>

        <button type="submit" className="w-full bg-slate-900 text-white py-2 rounded-md font-medium" disabled={loading}>
          {loading ? 'Creating...' : 'Create ticket'}
        </button>
      </form>
    </div>
  );
}

export default NewTicket;
