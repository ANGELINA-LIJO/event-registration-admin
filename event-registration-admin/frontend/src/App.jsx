import React from 'react';
import { useCallback, useEffect, useState } from "react";
import { Routes, Route, NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  CalendarDays, LayoutDashboard, Plus, Users, MapPin, Clock,
  Pencil, Trash2, Search, ArrowUpRight, X, LoaderCircle,
  CalendarPlus, Sparkles
} from "lucide-react";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/events`;
const api = axios.create({ baseURL: API_URL });

function formatDate(value) {
  if (!value) return "Not scheduled";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric"
  });
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <NavLink to="/" className="brand">
        <span className="brand-icon"><CalendarDays size={24} /></span>
        <span>gatherly<span className="brand-dot">.</span><small>EVENT WORKSPACE</small></span>
      </NavLink>
      <p className="nav-label">WORKSPACE</p>
      <nav className="side-nav">
        <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          <LayoutDashboard size={19} /> Dashboard
        </NavLink>
        <NavLink to="/add-event" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          <Plus size={19} /> Add Event
        </NavLink>
      </nav>
      <div className="sidebar-bottom">
        <div className="help-card">
          <Sparkles size={20} />
          <strong>Make it memorable.</strong>
          <p>Bring every event together in one place.</p>
        </div>
        <div className="profile">
          <div className="avatar">GA</div>
          <div><strong>Event Admin</strong><small>Administrator</small></div>
          <span className="online-dot" />
        </div>
      </div>
    </aside>
  );
}

function StatCard({ icon: Icon, label, value, note, className }) {
  return (
    <div className={`stat-card ${className || ""}`}>
      <div className="stat-top">
        <span className="stat-icon"><Icon size={21} /></span>
        <ArrowUpRight size={18} className="stat-arrow" />
      </div>
      <p>{label}</p><h2>{value}</h2><small>{note}</small>
    </div>
  );
}

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/");
      setEvents(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not connect to the server. Check MongoDB and the backend.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  async function deleteEvent(id) {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await api.delete(`/${id}`);
      setEvents((current) => current.filter((event) => event._id !== id));
    } catch (err) {
      window.alert(err.response?.data?.message || "Unable to delete the event.");
    }
  }

  const filteredEvents = events.filter((event) =>
    [event.eventName, event.venue, event.description].some((value) =>
      value?.toLowerCase().includes(search.toLowerCase())
    )
  );
  const totalRegistrations = events.reduce((total, event) => total + (event.totalRegistrations || 0), 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingEvents = events.filter((event) => new Date(event.eventDate) >= today).length;

  return (
    <main className="main-content">
      <header className="topbar">
        <div>
          <span className="breadcrumb">Workspace / Overview</span>
          <h1>Event dashboard</h1>
          <p className="page-subtitle">Everything happening, all in one place.</p>
        </div>
        <button className="primary-button" onClick={() => navigate("/add-event")}><Plus size={18} /> Create event</button>
      </header>

      <section className="welcome-banner">
        <div className="welcome-copy">
          <span className="eyebrow"><Sparkles size={14} /> YOUR EVENT SPACE</span>
          <h2>Good events start with great planning.</h2>
          <p>Manage your schedule, organize venues, and keep track of registrations.</p>
        </div>
        <div className="banner-art">
          <CalendarDays size={74} strokeWidth={1.2} />
          <span className="art-sparkle sparkle-one">✳</span><span className="art-sparkle sparkle-two">✦</span>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard icon={CalendarDays} label="Total events" value={events.length} note="Events in your workspace" className="stat-green" />
        <StatCard icon={Clock} label="Upcoming events" value={upcomingEvents} note="Scheduled for today or later" className="stat-peach" />
        <StatCard icon={Users} label="Total registrations" value={totalRegistrations.toLocaleString("en-IN")} note="Across all events" className="stat-lilac" />
      </section>

      <section className="events-section">
        <div className="section-heading">
          <div><h2>All events <span className="count-pill">{events.length}</span></h2><p>View and manage your events.</p></div>
          <label className="search-box">
            <Search size={18} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search events..." aria-label="Search events" />
            {search && <button className="icon-button" onClick={() => setSearch("")} aria-label="Clear search"><X size={16} /></button>}
          </label>
        </div>

        {loading ? (
          <div className="status-message"><LoaderCircle className="spin" size={26} /><p>Loading your events...</p></div>
        ) : error ? (
          <div className="status-message error-message"><p>{error}</p><button className="secondary-button" onClick={loadEvents}>Try again</button></div>
        ) : filteredEvents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><CalendarPlus size={32} /></div>
            <h3>{search ? "No matching events" : "Your next great event starts here"}</h3>
            <p>{search ? "Try another search term." : "Create your first event to see it listed on your dashboard."}</p>
            {!search && <button className="primary-button" onClick={() => navigate("/add-event")}><Plus size={18} /> Add your first event</button>}
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>EVENT DETAILS</th><th>EVENT DATE</th><th>VENUE</th><th>REGISTRATIONS</th><th>ACTIONS</th></tr></thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <tr key={event._id}>
                    <td><div className="event-title-cell"><div className="event-mini-icon"><CalendarDays size={19} /></div><div><strong>{event.eventName}</strong><small>ID: {event._id.slice(-8).toUpperCase()}</small></div></div></td>
                    <td><span className="date-text">{formatDate(event.eventDate)}</span></td>
                    <td><span className="venue-text"><MapPin size={15} /> {event.venue}</span></td>
                    <td><span className="registration-pill"><Users size={14} /> {event.totalRegistrations || 0}</span></td>
                    <td><div className="action-group">
                      <button className="action-button edit-button" title="Update event" aria-label={`Update ${event.eventName}`} onClick={() => navigate(`/edit-event/${event._id}`)}><Pencil size={16} /></button>
                      <button className="action-button delete-button" title="Delete event" aria-label={`Delete ${event.eventName}`} onClick={() => deleteEvent(event._id)}><Trash2 size={16} /></button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && !error && filteredEvents.length > 0 && <div className="table-footer">Showing {filteredEvents.length} of {events.length} events<span>Data stored in MongoDB Atlas</span></div>}
      </section>
    </main>
  );
}

function EventForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState({ eventName: "", description: "", eventDate: "", venue: "" });
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) return;
    let cancelled = false;
    api.get(`/${id}`)
      .then(({ data }) => {
        if (cancelled) return;
        setForm({
          eventName: data.eventName || "",
          description: data.description || "",
          eventDate: data.eventDate ? new Date(data.eventDate).toISOString().slice(0, 10) : "",
          venue: data.venue || ""
        });
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || "Could not load this event.");
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id, isEditing]);

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (new Date(`${form.eventDate}T23:59:59`) < new Date()) {
      setError("Please choose today or a future date.");
      return;
    }
    setSaving(true);
    try {
      if (isEditing) await api.put(`/${id}`, form);
      else await api.post("/", form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save the event. Check the backend connection.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <main className="main-content"><div className="status-message"><LoaderCircle className="spin" size={26} /> Loading event...</div></main>;

  return (
    <main className="main-content">
      <header className="topbar">
        <div><span className="breadcrumb">Workspace / {isEditing ? "Edit event" : "New event"}</span><h1>{isEditing ? "Update event" : "Create an event"}</h1><p className="page-subtitle">{isEditing ? "Make changes to your existing event details." : "Fill in the details to bring your next event to life."}</p></div>
        <button className="secondary-button" onClick={() => navigate("/")}><X size={17} /> Cancel</button>
      </header>

      <div className="form-layout">
        <section className="form-card">
          <div className="form-card-heading"><div className="form-heading-icon"><CalendarPlus size={22} /></div><div><h2>Event information</h2><p>Fields marked with * are required.</p></div></div>
          {error && <div className="form-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="field"><label htmlFor="eventName">Event name *</label><input id="eventName" name="eventName" value={form.eventName} onChange={handleChange} placeholder="e.g. Annual Technology Summit" maxLength={120} required /></div>
            <div className="field"><label htmlFor="description">Event description *</label><textarea id="description" name="description" value={form.description} onChange={handleChange} placeholder="Tell people what this event is about..." rows={5} maxLength={2000} required /><span className="field-hint">{form.description.length}/2000 characters</span></div>
            <div className="form-row">
              <div className="field"><label htmlFor="eventDate">Event date *</label><input id="eventDate" type="date" name="eventDate" value={form.eventDate} onChange={handleChange} min={new Date().toLocaleDateString("en-CA")} required /></div>
              <div className="field"><label htmlFor="venue">Venue *</label><input id="venue" name="venue" value={form.venue} onChange={handleChange} placeholder="e.g. Kochi Convention Centre" maxLength={200} required /></div>
            </div>
            <div className="form-actions">
              <button type="button" className="secondary-button" onClick={() => navigate("/")}>Cancel</button>
              <button type="submit" className="primary-button" disabled={saving}>{saving && <LoaderCircle size={17} className="spin" />}{saving ? "Saving..." : isEditing ? "Save changes" : "Create event"}</button>
            </div>
          </form>
        </section>
        <aside className="form-aside">
          <div className="aside-art"><CalendarDays size={45} /></div><span className="eyebrow">A LITTLE PLANNING GOES A LONG WAY</span><h3>Make every detail count.</h3>
          <p>Give your event a clear name, useful description, scheduled date, and easy-to-find venue.</p>
          <div className="aside-tip"><Sparkles size={17} /><span>Your event will appear on the dashboard as soon as it is saved.</span></div>
        </aside>
      </div>
    </main>
  );
}

function NotFound() {
  return <main className="main-content"><div className="empty-state"><h2>Page not found</h2><NavLink to="/" className="primary-button">Return to dashboard</NavLink></div></main>;
}

export default function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add-event" element={<EventForm />} />
        <Route path="/edit-event/:id" element={<EventForm />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
