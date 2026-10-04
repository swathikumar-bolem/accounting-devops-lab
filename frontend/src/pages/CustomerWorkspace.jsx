import React, { useEffect, useState } from 'react';
import { api, fmtDate, inr } from '../api';
import StatusBadge from '../components/StatusBadge';

export default function CustomerWorkspace({ id, back, goTo }) {
  const [customer, setCustomer] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [tab, setTab] = useState('overview');
  const [error, setError] = useState('');

  useEffect(() => { load(); }, [id]);
  async function load() {
    try {
      const [c,t,i] = await Promise.all([api(`/customers/${id}`), api(`/transactions?customerId=${id}`), api(`/invoices?customerId=${id}`)]);
      setCustomer(c); setTransactions(t); setInvoices(i);
    } catch(e){ setError(e.message); }
  }
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!customer) return <div className="panel">Loading customer workspace…</div>;

  const outstanding = invoices.filter(x => x.invoice.status !== 'CANCELLED').reduce((a,x) => a + Number(x.invoice.totalAmount) - Number(x.invoice.paidAmount),0);
  const sales = transactions.filter(x => x.type === 'SALE' && x.status === 'POSTED').reduce((a,x) => a + Number(x.amount),0);
  const expenses = transactions.filter(x => x.type === 'EXPENSE' && x.status === 'POSTED').reduce((a,x) => a + Number(x.amount),0);
  const tabs = ['overview','transactions','invoices','gst','expenses','p&l','returns','documents','activity'];

  return <>
    <button className="back-button" onClick={back}>← Back to customers</button>
    <section className="customer-hero">
      <div className="customer-avatar">{customer.name[0]}</div>
      <div className="grow"><div className="customer-title"><h2>{customer.name}</h2><StatusBadge value={customer.status} /><span className="plan-chip">{customer.plan}</span></div><p>{customer.businessName || 'Business name not set'} · {customer.gstin || 'GSTIN not set'}</p></div>
      <div className="customer-contact"><span>{customer.email || 'No email'}</span><span>{customer.phone || 'No phone'}</span></div>
    </section>
    <div className="tabs">{tabs.map(x => <button key={x} className={tab === x ? 'active' : ''} onClick={() => setTab(x)}>{x}</button>)}</div>

    {tab === 'overview' && <>
      <section className="stats-grid three"><div className="mini-stat"><span>Total sales</span><strong>{inr(sales)}</strong></div><div className="mini-stat"><span>Total expenses</span><strong>{inr(expenses)}</strong></div><div className="mini-stat"><span>Outstanding</span><strong>{inr(outstanding)}</strong></div></section>
      <section className="dashboard-grid">
        <div className="panel"><div className="panel-head"><div><h3>Recent transactions</h3><p>Latest customer activity</p></div><button className="text-button" onClick={() => goTo('transactions')}>Manage →</button></div><TransactionTable items={transactions.slice(0,6)} /></div>
        <div className="panel"><div className="panel-head"><div><h3>Recent invoices</h3><p>Billing status</p></div><button className="text-button" onClick={() => goTo('invoices')}>Manage →</button></div><InvoiceTable items={invoices.slice(0,6)} /></div>
      </section>
    </>}
    {tab === 'transactions' && <div className="panel"><TransactionTable items={transactions} /></div>}
    {tab === 'invoices' && <div className="panel"><InvoiceTable items={invoices} /></div>}
    {!['overview','transactions','invoices'].includes(tab) && <div className="empty-state large"><strong>{tab.toUpperCase()}</strong><span>This workspace is intentionally reserved for the next module batch.</span></div>}
  </>;
}

function TransactionTable({items}) { return <div className="table-wrap"><table><thead><tr><th>Date</th><th>Type</th><th>Description</th><th>Status</th><th className="right">Amount</th></tr></thead><tbody>{items.length===0&&<tr><td colSpan="5" className="empty-cell">No transactions</td></tr>}{items.map(t=><tr key={t.id}><td>{fmtDate(t.txnDate)}</td><td>{t.type}</td><td>{t.description}</td><td><StatusBadge value={t.status}/></td><td className="right money">{inr(t.amount)}</td></tr>)}</tbody></table></div>; }
function InvoiceTable({items}) { return <div className="table-wrap"><table><thead><tr><th>Invoice</th><th>Date</th><th>Status</th><th className="right">Total</th></tr></thead><tbody>{items.length===0&&<tr><td colSpan="4" className="empty-cell">No invoices</td></tr>}{items.map(x=><tr key={x.invoice.id}><td>{x.invoice.invoiceNumber}</td><td>{fmtDate(x.invoice.invoiceDate)}</td><td><StatusBadge value={x.invoice.status}/></td><td className="right money">{inr(x.invoice.totalAmount)}</td></tr>)}</tbody></table></div>; }
