import React from 'react';

const items = [
  ['dashboard', '▦', 'Dashboard'],
  ['customers', '◎', 'Customers'],
  ['transactions', '⇄', 'Transactions'],
  ['invoices', '▤', 'Invoices'],
  ['expenses', '◫', 'Expenses'],
  ['gst', 'GST', 'GST'],
  ['pnl', '↗', 'P&L'],
  ['returns', '↺', 'Annual Returns'],
  ['documents', '▱', 'Documents'],
  ['subscriptions', '◇', 'Subscriptions'],
  ['users', '♙', 'Users & Roles'],
  ['audit', '◷', 'Audit Logs']
];

const ready = new Set(['dashboard', 'customers', 'transactions', 'invoices']);

export default function AppShell({ current, navigate, profile, children, logout }) {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">F</div>
          <div><strong>Fuworx</strong><span>Accounting Suite</span></div>
        </div>
        <nav>
          {items.map(([key, icon, label]) => (
            <button
              key={key}
              className={`nav-item ${current === key ? 'active' : ''}`}
              onClick={() => navigate(key)}
            >
              <span className="nav-icon">{icon}</span>
              <span>{label}</span>
              {!ready.has(key) && <em>Next</em>}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="env-pill"><span></span> UAT / Lab</div>
          <small>Batch 1 · Core sales workspace</small>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div>
            <div className="eyebrow">BUSINESS OPERATIONS</div>
            <h1>{pageTitle(current)}</h1>
          </div>
          <div className="top-actions">
            <button className="notification" title="Notifications">●</button>
            <div className="profile-chip">
              <div className="avatar">{(profile?.email || 'A')[0].toUpperCase()}</div>
              <div><strong>{profile?.email || 'Admin'}</strong><span>{profile?.role || 'ADMIN'}</span></div>
            </div>
            <button className="btn btn-light" onClick={logout}>Logout</button>
          </div>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}

function pageTitle(key) {
  const found = items.find(x => x[0] === key);
  return found ? found[2] : 'Accounting Suite';
}
