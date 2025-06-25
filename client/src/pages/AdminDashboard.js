import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './AdminDashboard.css'; // custom styling

function AdminDashboard() {
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [candidates, setCandidates] = useState(['', '']);
  const token = localStorage.getItem('token');

  // ✅ useCallback to avoid missing dependency warning
  const fetchResults = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/vote/results', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResults(res.data);
    } catch (err) {
      setError('❌ Failed to fetch results');
    }
  }, [token]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handleCandidateChange = (index, value) => {
    const updated = [...candidates];
    updated[index] = value;
    setCandidates(updated);
  };

  const addCandidate = () => {
    setCandidates([...candidates, '']);
  };

  const handleCreateElection = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:5000/api/vote/create-election',
        { title, candidates },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(res.data.message);
      setTitle('');
      setCandidates(['', '']);
      fetchResults(); // refresh
    } catch (err) {
      alert('❌ Failed to create election');
    }
  };

  const handleDeleteElection = async (id) => {
    if (!window.confirm('Are you sure you want to delete this election?')) return;
    try {
      const res = await axios.delete(`http://localhost:5000/api/vote/delete-election/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(res.data.message);
      fetchResults(); // refresh
    } catch (err) {
      alert('❌ Failed to delete election');
    }
  };

  return (
    <div className="admin-container">
      <h2>🛠️ Admin Dashboard</h2>

      <nav className="admin-nav">
        <button onClick={() => window.location.href = '/'}>🏠 Home</button>
        <button onClick={() => window.location.href = '/vote'}>🗳️ Voting Page</button>
        <button onClick={fetchResults}>🔄 Refresh Results</button>
      </nav>

      <section className="create-election">
        <h3>📋 Create New Election</h3>
        <form onSubmit={handleCreateElection}>
          <input
            type="text"
            placeholder="Election Title"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
          />
          {candidates.map((c, idx) => (
            <input
              key={idx}
              type="text"
              placeholder={`Candidate ${idx + 1}`}
              value={c}
              required
              onChange={(e) => handleCandidateChange(idx, e.target.value)}
            />
          ))}
          <button type="button" onClick={addCandidate}>➕ Add Candidate</button>
          <button type="submit">✅ Create Election</button>
        </form>
      </section>

      <section className="results">
        <h3>📊 Election Results</h3>
        {error && <p className="error">{error}</p>}
        {results.map((election) => (
          <div key={election._id} className="election-card">
            <h4>{election.title}</h4>
            {election.candidates.map((c, i) => (
              <p key={i}>{c.name}: {c.votes} votes</p>
            ))}
            <button
              className="delete-button"
              onClick={() => handleDeleteElection(election._id)}
            >
              🗑️ Delete
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}

export default AdminDashboard;
