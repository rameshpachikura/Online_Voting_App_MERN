import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DeleteElection = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  // Fetch all elections
  const fetchElections = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/elections', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setElections(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching elections:', error);
      setLoading(false);
    }
  };

  // Delete election by ID
  const deleteElection = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this election?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/delete-election/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Election deleted!");
      fetchElections(); // Refresh after delete
    } catch (error) {
      console.error('Delete failed:', error);
      alert("Failed to delete election.");
    }
  };

  useEffect(() => {
    fetchElections();
  }, []);

  if (loading) return <div>Loading elections...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <button 
        onClick={() => navigate('/dashboard')} 
        style={{ 
          marginBottom: '20px',
          backgroundColor: '#4CAF50', 
          color: 'white', 
          border: 'none', 
          padding: '10px 15px',
          cursor: 'pointer',
          borderRadius: '5px'
        }}
      >
        ← Back to Dashboard
      </button>

      <h2>🗳️ All Elections</h2>
      {elections.length === 0 ? (
        <p>No elections found.</p>
      ) : (
        <ul>
          {elections.map((election) => (
            <li key={election._id} style={{ marginBottom: '10px' }}>
              <strong>{election.title}</strong> - {election.description}
              <button
                style={{ 
                  marginLeft: '10px', 
                  color: 'white', 
                  background: 'red', 
                  border: 'none', 
                  padding: '5px 10px',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
                onClick={() => deleteElection(election._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DeleteElection;
