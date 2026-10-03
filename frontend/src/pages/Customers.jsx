import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';

const emptyCustomer = { name:'', businessName:'', businessType:'', email:'', phone:'', gstin:'', pan:'', address:'', status:'ACTIVE', plan:'BASIC' };

export default function Customers({ openCustomer }) {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('ALL');
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    try { setItems(await api('/customers')); }
    catch (e) { setError(e.message); }
  }

  const filtered = useMemo(() => items.filter(c => {
    const q = query.toLowerCase();
    const text = `${c.name} ${c.businessName || ''} ${c.email || ''} ${c.gstin || ''}`.toLowerCase();
    return (!q || text.includes(q)) && (status === 'ALL' || c.status === status);
  }), [items, query, status]);

  async function remove(id) {
    if (!confirm('Deactivate this customer? Historical invoices and transactions will be retained.')) return;
    try { await api(`/customers/${id}`, { method:'DELETE' }); await load(); }
    catch (e) { setError(e.message); }
  }

  return (
    <>
      <section className="page-actions">
        <div><h2>Customer management</h2><p>Manage business profiles, GST details, plans and account status.</p></div>
        <button className="btn btn-primary" onClick={() => setEditing({ ...emptyCustomer })}>+ Add customer</button>
      </section>

      {error && <div className="alert alert-error">{error}</div>}

      <section className="panel">
        <div className="toolbar">
          <div className="search-box"><span>⌕</span><input placeholder="Search customer, business, email or GSTIN" value={query} onChange={e => setQuery(e.target.value)} /></div>
          <select value={status} onChange={e => setStatus(e.target.value)}><option value="ALL">All statuses</option><option>ACTIVE</option><option>TRIAL</option><option>INACTIVE</option></select>
          <div className="result-count">{filtered.length} customer{filtered.length === 1 ? '' : 's'}</div>
        </div>

        <div className="table-wrap">
          <table>
            <thead><tr><th>Customer / Business</th><th>Contact</th><th>GSTIN</th><th>Plan</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan="6" className="empty-cell">No customers match your filters.</td></tr>}
              {filtered.map(c => (
                <tr key={c.id}>
                  <td><button className="link-name" onClick={() => openCustomer(c.id)}>{c.name}</button><span className="subtext">{c.businessName || 'Business name not set'}</span></td>
                  <td>{c.email || '—'}<span className="subtext">{c.phone || '—'}</span></td>
                  <td>{c.gstin || '—'}</td>
                  <td><span className="plan-chip">{c.plan}</span></td>
                  <td><StatusBadge value={c.status} /></td>
                  <td className="row-actions"><button className="icon-text" onClick={() => setEditing({ ...c })}>Edit</button><button className="icon-text danger-text" onClick={() => remove(c.id)}>Deactivate</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {editing && <CustomerModal customer={editing} onClose={() => setEditing(null)} onSaved={async () => { setEditing(null); await load(); }} />}
    </>
  );
}

function CustomerModal({ customer, onClose, onSaved }) {
  const [form, setForm] = useState(customer);
  const [error, setError] = useState('');
  const isEdit = !!customer.id;

  function field(name, value) { setForm(f => ({ ...f, [name]: value })); }

  async function save(e) {
    e.preventDefault(); setError('');
    try {
      await api(isEdit ? `/customers/${customer.id}` : '/customers', { method: isEdit ? 'PUT' : 'POST', body: JSON.stringify(form) });
      onSaved();
    } catch (e) { setError(e.message); }
  }

  return <Modal title={isEdit ? 'Edit customer' : 'Add customer'} subtitle="Business and statutory profile" onClose={onClose} wide>
    <form onSubmit={save}>
      <div className="form-grid two">
        <Field label="Customer name *"><input required value={form.name || ''} onChange={e => field('name', e.target.value)} /></Field>
        <Field label="Business name"><input value={form.businessName || ''} onChange={e => field('businessName', e.target.value)} /></Field>
        <Field label="Business type"><input placeholder="Retail, Services, Trading…" value={form.businessType || ''} onChange={e => field('businessType', e.target.value)} /></Field>
        <Field label="Email"><input type="email" value={form.email || ''} onChange={e => field('email', e.target.value)} /></Field>
        <Field label="Phone"><input value={form.phone || ''} onChange={e => field('phone', e.target.value)} /></Field>
        <Field label="GSTIN"><input value={form.gstin || ''} onChange={e => field('gstin', e.target.value.toUpperCase())} /></Field>
        <Field label="PAN"><input value={form.pan || ''} onChange={e => field('pan', e.target.value.toUpperCase())} /></Field>
        <Field label="Plan"><select value={form.plan || 'BASIC'} onChange={e => field('plan', e.target.value)}><option>BASIC</option><option>STANDARD</option><option>PREMIUM</option></select></Field>
        <Field label="Status"><select value={form.status || 'ACTIVE'} onChange={e => field('status', e.target.value)}><option>ACTIVE</option><option>TRIAL</option><option>INACTIVE</option></select></Field>
        <Field label="Address" className="span-2"><textarea rows="3" value={form.address || ''} onChange={e => field('address', e.target.value)} /></Field>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="modal-actions"><button type="button" className="btn btn-light" onClick={onClose}>Cancel</button><button className="btn btn-primary">{isEdit ? 'Save changes' : 'Create customer'}</button></div>
    </form>
  </Modal>;
}

function Field({ label, children, className='' }) { return <label className={`field ${className}`}><span>{label}</span>{children}</label>; }
