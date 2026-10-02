import React, { useEffect, useState } from "react";
import api from "./api";

const emptyLogin = { email: "", password: "" };
const emptyRegister = { name: "", email: "", password: "", role: "customer" };

function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(emptyLogin);
  const [message, setMessage] = useState("");

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setMessage("");
  };

  const submitAuth = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const { data } = await api.post(endpoint, form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      setMessage(data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  if (!user) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="brand">🚗 AutoCare</div>
          <h1>{mode === "login" ? "Welcome back" : "Create account"}</h1>
          <p className="muted">
            Vehicle Service Center Management System
          </p>

          <form onSubmit={submitAuth}>
            {mode === "register" && (
              <>
                <label>Name</label>
                <input
                  value={form.name || ""}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </>
            )}

            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              minLength="6"
              required
            />

            {mode === "register" && (
              <>
                <label>Account type</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="customer">Customer</option>
                  <option value="mechanic">Mechanic</option>
                </select>
              </>
            )}

            <button className="primary" type="submit">
              {mode === "login" ? "Login" : "Register"}
            </button>
          </form>

          {message && <div className="message">{message}</div>}

          <button
            className="link-button"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setForm(mode === "login" ? emptyRegister : emptyLogin);
              setMessage("");
            }}
          >
            {mode === "login"
              ? "New user? Create an account"
              : "Already have an account? Login"}
          </button>
        </div>
      </div>
    );
  }

  return <Dashboard user={user} logout={logout} />;
}

function Dashboard({ user, logout }) {
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [tab, setTab] = useState(user.role === "mechanic" ? "jobs" : "vehicles");
  const [vehicleForm, setVehicleForm] = useState({
    registrationNumber: "",
    make: "",
    model: "",
    year: new Date().getFullYear()
  });
  const [bookingForm, setBookingForm] = useState({
    vehicle: "",
    serviceType: "General Service",
    appointmentDate: "",
    description: ""
  });
  const [statusDraft, setStatusDraft] = useState({});

  const loadData = async () => {
    try {
      const [vehicleResponse, bookingResponse] = await Promise.all([
        api.get("/vehicles"),
        api.get("/service-bookings")
      ]);
      setVehicles(vehicleResponse.data.data);
      setBookings(bookingResponse.data.data);
    } catch (error) {
      alert(error.response?.data?.message || "Could not load data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addVehicle = async (e) => {
    e.preventDefault();
    try {
      await api.post("/vehicles", vehicleForm);
      setVehicleForm({
        registrationNumber: "",
        make: "",
        model: "",
        year: new Date().getFullYear()
      });
      await loadData();
      alert("Vehicle added");
    } catch (error) {
      alert(error.response?.data?.message || "Could not add vehicle");
    }
  };

  const createBooking = async (e) => {
    e.preventDefault();
    try {
      await api.post("/service-bookings", bookingForm);
      setBookingForm({
        vehicle: "",
        serviceType: "General Service",
        appointmentDate: "",
        description: ""
      });
      await loadData();
      alert("Appointment booked");
    } catch (error) {
      alert(error.response?.data?.message || "Could not create booking");
    }
  };

  const history = async (vehicleId) => {
    try {
      const { data } = await api.get(`/vehicles/${vehicleId}/history`);
      setSelectedHistory(data);
      setTab("history");
    } catch (error) {
      alert(error.response?.data?.message || "History access denied");
    }
  };

  const deleteBooking = async (id) => {
    if (!confirm("Delete this booking?")) return;
    try {
      await api.delete(`/service-bookings/${id}`);
      loadData();
    } catch (error) {
      alert(error.response?.data?.message || "Cannot delete booking");
    }
  };

  const updateStatus = async (id) => {
    try {
      await api.patch(`/service-bookings/${id}/status`, {
        status: statusDraft[id] || "In Progress"
      });
      await loadData();
      alert("Status updated");
    } catch (error) {
      alert(error.response?.data?.message || "Cannot update status");
    }
  };

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <div className="brand">🚗 AutoCare</div>
          <span className="welcome">Hi, {user.name} · {user.role}</span>
        </div>
        <button className="logout" onClick={logout}>Logout</button>
      </header>

      <nav className="tabs">
        {user.role === "customer" && (
          <>
            <button onClick={() => setTab("vehicles")}>My Vehicles</button>
            <button onClick={() => setTab("book")}>Book Service</button>
            <button onClick={() => setTab("bookings")}>My Bookings</button>
          </>
        )}
        {user.role === "mechanic" && (
          <button onClick={() => setTab("jobs")}>Mechanic Jobs</button>
        )}
        {selectedHistory && (
          <button onClick={() => setTab("history")}>Service History</button>
        )}
      </nav>

      <main className="content">
        {tab === "vehicles" && (
          <section>
            <h2>My Vehicles</h2>
            <form className="grid-form" onSubmit={addVehicle}>
              <input placeholder="Registration No." value={vehicleForm.registrationNumber}
                onChange={(e) => setVehicleForm({ ...vehicleForm, registrationNumber: e.target.value })} required />
              <input placeholder="Make e.g. Honda" value={vehicleForm.make}
                onChange={(e) => setVehicleForm({ ...vehicleForm, make: e.target.value })} required />
              <input placeholder="Model e.g. City" value={vehicleForm.model}
                onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })} required />
              <input type="number" placeholder="Year" value={vehicleForm.year}
                onChange={(e) => setVehicleForm({ ...vehicleForm, year: e.target.value })} required />
              <button className="primary">+ Add Vehicle</button>
            </form>

            <div className="cards">
              {vehicles.map((v) => (
                <div className="card" key={v._id}>
                  <h3>{v.make} {v.model}</h3>
                  <p><b>{v.registrationNumber}</b> · {v.year}</p>
                  <button onClick={() => history(v._id)}>View Full History</button>
                </div>
              ))}
              {!vehicles.length && <p className="muted">No vehicles yet.</p>}
            </div>
          </section>
        )}

        {tab === "book" && (
          <section>
            <h2>Book Service</h2>
            <form className="form-card" onSubmit={createBooking}>
              <label>Vehicle</label>
              <select value={bookingForm.vehicle}
                onChange={(e) => setBookingForm({ ...bookingForm, vehicle: e.target.value })} required>
                <option value="">Select vehicle</option>
                {vehicles.map((v) => (
                  <option key={v._id} value={v._id}>{v.registrationNumber} - {v.make} {v.model}</option>
                ))}
              </select>

              <label>Service Type</label>
              <select value={bookingForm.serviceType}
                onChange={(e) => setBookingForm({ ...bookingForm, serviceType: e.target.value })}>
                {["General Service","Oil Change","Brake Service","Engine Repair","AC Service","Wheel Alignment","Other"].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>

              <label>Appointment</label>
              <input type="datetime-local" value={bookingForm.appointmentDate}
                onChange={(e) => setBookingForm({ ...bookingForm, appointmentDate: e.target.value })} required />

              <label>Description</label>
              <textarea placeholder="Describe the problem (optional)"
                value={bookingForm.description}
                onChange={(e) => setBookingForm({ ...bookingForm, description: e.target.value })} />

              <button className="primary">Book Appointment</button>
            </form>
          </section>
        )}

        {(tab === "bookings" || tab === "jobs") && (
          <section>
            <h2>{user.role === "mechanic" ? "All Service Jobs" : "My Service Bookings"}</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Vehicle</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Status</th>
                    {user.role === "mechanic" ? <th>Update</th> : <th>Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id}>
                      <td>{b.vehicle?.registrationNumber}</td>
                      <td>{b.serviceType}</td>
                      <td>{new Date(b.appointmentDate).toLocaleString()}</td>
                      <td><span className="status">{b.status}</span></td>
                      <td>
                        {user.role === "mechanic" ? (
                          <div className="inline">
                            <select
                              value={statusDraft[b._id] || b.status}
                              onChange={(e) => setStatusDraft({
                                ...statusDraft, [b._id]: e.target.value
                              })}
                            >
                              {["Booked","In Progress","Completed","Cancelled"].map((s) => (
                                <option key={s}>{s}</option>
                              ))}
                            </select>
                            <button onClick={() => updateStatus(b._id)}>Save</button>
                          </div>
                        ) : (
                          <button onClick={() => deleteBooking(b._id)}>Delete</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {tab === "history" && selectedHistory && (
          <section>
            <h2>Service History</h2>
            <div className="hero-card">
              <h3>{selectedHistory.vehicle.make} {selectedHistory.vehicle.model}</h3>
              <p>{selectedHistory.vehicle.registrationNumber} · {selectedHistory.vehicle.year}</p>
            </div>
            {selectedHistory.data.map((b) => (
              <div className="history-item" key={b._id}>
                <div>
                  <b>{b.serviceType}</b>
                  <p>{new Date(b.appointmentDate).toLocaleString()}</p>
                </div>
                <span className="status">{b.status}</span>
                <p>{b.description || "No description"}</p>
                {b.mechanicNote && <p><b>Mechanic:</b> {b.mechanicNote}</p>}
              </div>
            ))}
            {!selectedHistory.data.length && <p className="muted">No service history yet.</p>}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
