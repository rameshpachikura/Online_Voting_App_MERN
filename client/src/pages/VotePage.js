import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './VotePage.css';
import ResultChart from '../components/ResultChart';

function VotePage() {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/vote/elections', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setElections(res.data);
        setLoading(false);
      } catch (err) {
        setMessage('❌ Failed to load elections');
        setLoading(false);
      }
    };

    fetchElections();
  }, [token]);

  const handleVote = async (electionId, candidateName) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/vote/cast',
        { electionId, candidateName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(res.data.message);

      // Refresh elections to update vote counts after voting
      const updated = await axios.get('http://localhost:5000/api/vote/elections', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setElections(updated.data);
    } catch (err) {
      setMessage(err.response?.data?.message || '❌ Vote failed');
    }
  };

  if (loading) return <p>Loading elections...</p>;

  return (
    <div className="vote-container">
      <h2>🗳️ Elections</h2>
      {message && <p className="message">{message}</p>}

      {elections.map((election) => (
        <div key={election._id} className="election-card">
          <h3>{election.title}</h3>
          {election.candidates.map((candidate, index) => (
            <div key={index} className="candidate">
              <span>{candidate.name} - {candidate.votes} votes</span>
              <button
                className="vote-button"
                onClick={() => handleVote(election._id, candidate.name)}
              >
                Vote
              </button>
            </div>
          ))}

          {/* 📊 Display Result Chart */}
          <ResultChart election={election} />
        </div>
      ))}
    </div>
  );
}

export default VotePage;
