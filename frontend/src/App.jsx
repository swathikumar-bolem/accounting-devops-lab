import React, { useEffect, useState } from 'react';
import AppShell from './components/AppShell';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import CustomerWorkspace from './pages/CustomerWorkspace';
import Transactions from './pages/Transactions';
import Invoices from './pages/Invoices';

const ready = new Set(['dashboard','customers','transactions','invoices']);

export default function App() {
  const [profile, setProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem('profile')) || null; } catch { return null; }
  });
  const [authenticated, setAuthenticated] = useState(!!localStorage.getItem('token'));
  const [route, setRoute] = useState({ name:'dashboard', customerId:null });

  useEffect(() => {
    const expired = () => { setAuthenticated(false); setProfile(null); };
    window.addEventListener('auth-expired', expired);
    return () => window.removeEventListener('auth-expired', expired);
  }, []);

  function login(p) { setProfile(p); setAuthenticated(true); }
  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('profile');
    setAuthenticated(false);
    setProfile(null);
  }
  function navigate(name) { setRoute({ name, customerId:null }); }

  if (!authenticated) return <Login onLogin={login} />;

  const sidebarCurrent = route.name === 'customer-workspace' ? 'customers' : route.name;

  return <AppShell current={sidebarCurrent} navigate={navigate} profile={profile} logout={logout}>
    {route.name === 'dashboard' && <Dashboard navigate={navigate} />}
    {route.name === 'customers' && <Customers openCustomer={id => setRoute({name:'customer-workspace',customerId:id})} />}
    {route.name === 'customer-workspace' && <CustomerWorkspace id={route.customerId} back={() => navigate('customers')} goTo={navigate} />}
    {route.name === 'transactions' && <Transactions />}
    {route.name === 'invoices' && <Invoices />}
    {!ready.has(route.name) && route.name !== 'customer-workspace' && <ComingSoon name={route.name} />}
  </AppShell>;
}

function ComingSoon({ name }) {
  const title = ({expenses:'Expenses',gst:'GST Management',pnl:'Profit & Loss',returns:'Annual Returns',documents:'Documents',subscriptions:'Subscriptions',users:'Users & Roles',audit:'Audit Logs'})[name] || name;
  return <div className="empty-state large"><div className="coming-icon">◇</div><strong>{title}</strong><span>This module is mapped into the application shell and will be implemented in the next grouped release.</span></div>;
}
