import React, { useEffect, useMemo, useState } from 'react';
import { api, fmtDate, inr } from '../api';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';

const blank = () => ({ customerId:'', type:'SALE', txnDate:new Date().toISOString().slice(0,10), referenceNo:'', description:'', amount:'', status:'POSTED', remarks:'' });

export default function Transactions() {
  const [items,setItems]=useState([]), [customers,setCustomers]=useState([]), [editing,setEditing]=useState(null), [filter,setFilter]=useState('ALL'), [error,setError]=useState('');
  useEffect(()=>{load();},[]);
  async function load(){ try{ const [t,c]=await Promise.all([api('/transactions'),api('/customers')]); setItems(t); setCustomers(c);}catch(e){setError(e.message);} }
  const shown=useMemo(()=>items.filter(x=>filter==='ALL'||x.type===filter),[items,filter]);
  async function voidTxn(id){ if(!confirm('Void this transaction?'))return; try{await api(`/transactions/${id}/void`,{method:'POST'});await load();}catch(e){setError(e.message);} }
  return <>
    <section className="page-actions"><div><h2>Transactions</h2><p>Sales, purchases, expenses, payments, receipts and journal entries.</p></div><button className="btn btn-primary" onClick={()=>setEditing(blank())}>+ Add transaction</button></section>
    {error&&<div className="alert alert-error">{error}</div>}
    <section className="panel">
      <div className="toolbar"><select value={filter} onChange={e=>setFilter(e.target.value)}><option value="ALL">All transaction types</option>{['SALE','PURCHASE','EXPENSE','PAYMENT','RECEIPT','JOURNAL'].map(x=><option key={x}>{x}</option>)}</select><div className="result-count">{shown.length} records</div></div>
      <div className="table-wrap"><table><thead><tr><th>Date</th><th>Type</th><th>Description</th><th>Customer</th><th>Reference</th><th>Status</th><th className="right">Amount</th><th></th></tr></thead><tbody>{shown.length===0&&<tr><td colSpan="8" className="empty-cell">No transactions yet.</td></tr>}{shown.map(t=>{const c=customers.find(x=>x.id===t.customerId);return <tr key={t.id}><td>{fmtDate(t.txnDate)}</td><td><span className="type-chip">{t.type}</span></td><td>{t.description}<span className="subtext">{t.remarks||''}</span></td><td>{c?.name||'—'}</td><td>{t.referenceNo||'—'}</td><td><StatusBadge value={t.status}/></td><td className="right money">{inr(t.amount)}</td><td className="row-actions"><button className="icon-text" onClick={()=>setEditing({...t,customerId:t.customerId||''})}>Edit</button>{t.status!=='VOID'&&<button className="icon-text danger-text" onClick={()=>voidTxn(t.id)}>Void</button>}</td></tr>})}</tbody></table></div>
    </section>
    {editing&&<TransactionModal value={editing} customers={customers} onClose={()=>setEditing(null)} onSaved={async()=>{setEditing(null);await load();}}/>}
  </>;
}

function TransactionModal({value,customers,onClose,onSaved}){
  const [form,setForm]=useState(value),[error,setError]=useState(''); const edit=!!value.id;
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  async function save(e){e.preventDefault();setError('');try{const payload={...form,customerId:form.customerId?Number(form.customerId):null,amount:Number(form.amount)};await api(edit?`/transactions/${form.id}`:'/transactions',{method:edit?'PUT':'POST',body:JSON.stringify(payload)});onSaved();}catch(e){setError(e.message);}}
  return <Modal title={edit?'Edit transaction':'Add transaction'} subtitle="Post a day-to-day business entry" onClose={onClose} wide><form onSubmit={save}><div className="form-grid two"><Field label="Type"><select value={form.type} onChange={e=>set('type',e.target.value)}>{['SALE','PURCHASE','EXPENSE','PAYMENT','RECEIPT','JOURNAL'].map(x=><option key={x}>{x}</option>)}</select></Field><Field label="Date"><input type="date" required value={form.txnDate} onChange={e=>set('txnDate',e.target.value)}/></Field><Field label="Customer"><select value={form.customerId} onChange={e=>set('customerId',e.target.value)}><option value="">No customer</option>{customers.map(c=><option key={c.id} value={c.id}>{c.name} {c.businessName?`— ${c.businessName}`:''}</option>)}</select></Field><Field label="Reference no."><input value={form.referenceNo||''} onChange={e=>set('referenceNo',e.target.value)}/></Field><Field label="Description" className="span-2"><input required value={form.description} onChange={e=>set('description',e.target.value)}/></Field><Field label="Amount"><input type="number" min="0" step="0.01" required value={form.amount} onChange={e=>set('amount',e.target.value)}/></Field><Field label="Status"><select value={form.status||'POSTED'} onChange={e=>set('status',e.target.value)}><option>POSTED</option><option>VOID</option></select></Field><Field label="Remarks" className="span-2"><textarea rows="3" value={form.remarks||''} onChange={e=>set('remarks',e.target.value)}/></Field></div>{error&&<div className="alert alert-error">{error}</div>}<div className="modal-actions"><button type="button" className="btn btn-light" onClick={onClose}>Cancel</button><button className="btn btn-primary">{edit?'Save changes':'Post transaction'}</button></div></form></Modal>;
}
function Field({label,children,className=''}){return <label className={`field ${className}`}><span>{label}</span>{children}</label>}
