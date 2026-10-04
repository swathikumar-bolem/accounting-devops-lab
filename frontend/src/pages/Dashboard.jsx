import React, { useEffect, useState } from 'react';
import { api, fmtDate, inr } from '../api';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';

export default function Dashboard({ navigate }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    try { setData(await api('/dashboard')); }
    catch (e) { setError(e.message); }
  }

  if (!data) return <Loading error={error} />;

  return (
    <>
      <section className="welcome-row">
        <div>
          <h2>Business overview</h2>
          <p>A live operational summary across customers, invoices and transactions.</p>
        </div>
        <div className="quick-actions">
          <button className="btn btn-light" onClick={() => navigate('transactions')}>+ Transaction</button>
          <button className="btn btn-primary" onClick={() => navigate('invoices')}>+ Create invoice</button>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard label="Total customers" value={data.totalCustomers} caption={`${data.activeCustomers} active`} icon="◎" />
        <StatCard label="Invoice revenue" value={inr(data.invoiceRevenue)} caption={`${data.totalInvoices} invoices`} icon="₹" />
        <StatCard label="Outstanding" value={inr(data.outstandingAmount)} caption="Pending collection" icon="◷" />
        <StatCard label="Today's sales" value={inr(data.todaySales)} caption={`Expenses ${inr(data.todayExpenses)}`} icon="↗" />
      </section>

      <section className="dashboard-grid">
        <div className="panel">
          <div className="panel-head"><div><h3>Recent transactions</h3><p>Latest posted business activity</p></div><button className="text-button" onClick={() => navigate('transactions')}>View all →</button></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Date</th><th>Type</th><th>Description</th><th>Status</th><th className="right">Amount</th></tr></thead>
              <tbody>
                {(data.recentTransactions || []).length === 0 && <tr><td colSpan="5" className="empty-cell">No transactions yet</td></tr>}
                {(data.recentTransactions || []).map(t => (
                  <tr key={t.id}><td>{fmtDate(t.txnDate)}</td><td><span className="type-chip">{t.type}</span></td><td>{t.description}</td><td><StatusBadge value={t.status} /></td><td className="right money">{inr(t.amount)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head"><div><h3>Recent invoices</h3><p>Latest customer billing activity</p></div><button className="text-button" onClick={() => navigate('invoices')}>View all →</button></div>
          <div className="invoice-feed">
            {(data.recentInvoices || []).length === 0 && <div className="empty-state compact">No invoices yet</div>}
            {(data.recentInvoices || []).map(i => (
              <div className="invoice-feed-row" key={i.id}>
                <div className="doc-icon">▤</div>
                <div className="grow"><strong>{i.invoiceNumber}</strong><span>{fmtDate(i.invoiceDate)}</span></div>
                <div className="invoice-feed-value"><strong>{inr(i.totalAmount)}</strong><StatusBadge value={i.status} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Loading({ error }) {
  return <div className="panel"><div className={error ? 'alert alert-error' : 'skeleton-line'}>{error || 'Loading dashboard…'}</div></div>;
}
