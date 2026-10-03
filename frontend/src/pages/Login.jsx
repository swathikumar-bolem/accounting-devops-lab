import React, { useState } from 'react';
import { api } from '../api';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('Admin@123');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const data = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('profile', JSON.stringify({ email: data.email, role: data.role }));
      onLogin({ email: data.email, role: data.role });
    } catch (e) {
      setError(e.message === 'UNAUTHORIZED' ? 'Invalid email or password' : e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-hero">
        <div className="login-brand"><span>F</span> FUWORX</div>
        <div className="hero-copy">
          <div className="hero-kicker">GST · ACCOUNTING · BUSINESS MANAGEMENT</div>
          <h1>One workspace for the financial operations that matter.</h1>
          <p>Manage customers, transactions, invoices and business performance from a secure, business-isolated workspace.</p>
          <div className="hero-points">
            <div><strong>✓</strong><span>Business-wise data isolation</span></div>
            <div><strong>✓</strong><span>GST-ready operational workflow</span></div>
            <div><strong>✓</strong><span>Versioned Docker deployment</span></div>
          </div>
        </div>
        <div className="hero-footer">Fuworx Accounting Suite · MVP</div>
      </div>
      <div className="login-panel">
        <form className="login-card" onSubmit={submit}>
          <div className="login-logo">F</div>
          <h2>Welcome back</h2>
          <p>Sign in to the admin workspace</p>
          <label>Email address</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          {error && <div className="alert alert-error">{error}</div>}
          <button className="btn btn-primary btn-block" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
          <div className="login-note">Lab credentials are prefilled for this environment.</div>
        </form>
      </div>
    </div>
  );
}
