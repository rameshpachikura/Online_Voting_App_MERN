import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminResults() {
  const [elections, setElections] = useState([]);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/vote/results', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setElections(res.data);
      } catch (err) {
        setError('❌ Failed to load results');
      }
    };

    fetchResults();
  }, [token]);

  return (
    <div style={{ textAlign: 'center', marginTop: '40px' }}>
      <h2>📊 Admin Results</h2>
      {error && <p>{error}</p>}
      {elections.map((election) => (
        <div key={election._id} style={{ marginBottom: '30px' }}>
          <h3>{election.title}</h3>
          <ul>
            {election.candidates.map((c, index) => (
              <li key={index}>
                {c.name}: {c.votes} votes
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default AdminResults;
