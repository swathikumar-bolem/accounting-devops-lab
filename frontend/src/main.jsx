import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const API = '/api';

async function api(p, o = {}) {
  const t = localStorage.getItem('token');
  const r = await fetch(API + p, {
    ...o,
    headers: {
      'Content-Type': 'application/json',
      ...(t ? { Authorization: `Bearer ${t}` } : {})
    }
  });

  if (r.status === 401) {
    localStorage.removeItem('token');
    throw new Error('UNAUTHORIZED');
  }

  if (!r.ok) {
    const b = await r.json().catch(() => ({}));
    throw new Error(b.message || `HTTP ${r.status}`);
  }

  return r.status === 204 ? null : r.json();
}

function Login({ ok }) {
  const [e, se] = useState('admin@example.com');
  const [p, sp] = useState('Admin@123');
  const [er, sEr] = useState('');

  async function go(x) {
    x.preventDefault();

    try {
      const d = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: e,
          password: p
        })
      });

      localStorage.setItem('token', d.token);
      ok();
    } catch {
      sEr('Invalid email or password');
    }
  }

  return (
    <main className="center">
      <form className="card login" onSubmit={go}>
        <h1>Accounting MVP</h1>
        <p>Realistic DevOps practice app</p>

        <label>Email</label>
        <input
          value={e}
          onChange={x => se(x.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          value={p}
          onChange={x => sp(x.target.value)}
        />

        {er && <div className="error">{er}</div>}

        <button>Sign in</button>
      </form>
    </main>
  );
}

function App() {
  const [on, setOn] = useState(!!localStorage.getItem('token'));
  const [cs, setCs] = useState([]);
  const [d, setD] = useState({ totalCustomers: 0 });
  const [er, setEr] = useState('');

  const emptyForm = {
    id: null,
    name: '',
    email: '',
    phone: '',
    gstin: '',
    status: 'ACTIVE'
  };

  const [form, setForm] = useState(emptyForm);

  async function load() {
    try {
      const [c, x] = await Promise.all([
        api('/customers'),
        api('/dashboard')
      ]);

      setCs(c);
      setD(x);
    } catch (e) {
      if (e.message === 'UNAUTHORIZED') {
        setOn(false);
      } else {
        setEr(e.message);
      }
    }
  }

  useEffect(() => {
    if (on) load();
  }, [on]);

  async function saveCustomer(e) {
    e.preventDefault();
    setEr('');

    try {
      if (form.id) {
        await api(`/customers/${form.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            phone: form.phone,
            gstin: form.gstin,
            status: form.status
          })
        });
      } else {
        await api('/customers', {
          method: 'POST',
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            phone: form.phone,
            gstin: form.gstin,
            status: form.status
          })
        });
      }

      setForm(emptyForm);
      await load();
    } catch (e) {
      setEr(e.message);
    }
  }

  function editCustomer(customer) {
    setForm({
      id: customer.id,
      name: customer.name || '',
      email: customer.email || '',
      phone: customer.phone || '',
      gstin: customer.gstin || '',
      status: customer.status || 'ACTIVE'
    });
  }

  async function removeCustomer(id) {
    try {
      await api('/customers/' + id, {
        method: 'DELETE'
      });

      await load();
    } catch (e) {
      setEr(e.message);
    }
  }

  if (!on) {
    return <Login ok={() => setOn(true)} />;
  }

  return (
    <div className="app">
      <header>
        <div>
          <h1>Accounting MVP</h1>
          <span>React + Nginx + Spring Boot + PostgreSQL</span>
        </div>

        <button
          className="secondary"
          onClick={() => {
            localStorage.removeItem('token');
            setOn(false);
          }}
        >
          Logout
        </button>
      </header>

      <div className="metric">
        <span>Total customers</span>
        <strong>{d.totalCustomers}</strong>
      </div>

      <section className="grid">
        <form className="card" onSubmit={saveCustomer}>
          <h2>{form.id ? 'Edit customer' : 'Add customer'}</h2>

          {['name', 'email', 'phone', 'gstin'].map(k => (
            <div key={k}>
              <label>{k.toUpperCase()}</label>
              <input
                required={k === 'name'}
                value={form[k]}
                onChange={e =>
                  setForm({
                    ...form,
                    [k]: e.target.value
                  })
                }
              />
            </div>
          ))}

          <button>
            {form.id ? 'Update customer' : 'Create customer'}
          </button>

          {form.id && (
            <button
              type="button"
              className="secondary"
              onClick={() => setForm(emptyForm)}
            >
              Cancel edit
            </button>
          )}

          {er && <div className="error">{er}</div>}
        </form>

        <div className="card">
          <h2>Customers</h2>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>GSTIN</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {cs.map(c => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.name}</td>
                  <td>{c.email || '-'}</td>
                  <td>{c.gstin || '-'}</td>

                  <td>
                    <button
                      className="secondary"
                      onClick={() => editCustomer(c)}
                    >
                      Edit
                    </button>

                    <button
                      className="danger"
                      onClick={() => removeCustomer(c.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);

