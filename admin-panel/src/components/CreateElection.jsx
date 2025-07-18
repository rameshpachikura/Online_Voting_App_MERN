import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 for navigation

function CreateElection() {
  const [title, setTitle] = useState('');
  const [candidates, setCandidates] = useState(['']);
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // 👈 React Router hook

  const handleCandidateChange = (index, value) => {
    const updated = [...candidates];
    updated[index] = value;
    setCandidates(updated);
  };

  const addCandidate = () => {
    setCandidates([...candidates, '']);
  };

  const removeCandidate = (index) => {
    const updated = candidates.filter((_, i) => i !== index);
    setCandidates(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    try {
      const res = await fetch('http://localhost:5000/api/admin/create-election', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, candidates })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Election created successfully!');
        setTitle('');
        setCandidates(['']);
      } else {
        setMessage(`❌ ${data.message || 'Failed to create election'}`);
      }
    } catch (error) {
      console.error(error);
      setMessage('❌ Error while creating election');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f2f5'
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '500px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Create Voting</h2>

        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', marginBottom: '8px' }}>Title:</label>
          <input
            type="text"
            placeholder="Voting Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '15px',
              borderRadius: '5px',
              border: '1px solid #ccc'
            }}
          />

          <label style={{ display: 'block', marginBottom: '8px' }}>Candidates:</label>
          {candidates.map((name, index) => (
            <div key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                placeholder={`Candidate ${index + 1}`}
                value={name}
                onChange={e => handleCandidateChange(index, e.target.value)}
                required
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  marginRight: '10px'
                }}
              />
              {candidates.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCandidate(index)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '4px',
                    backgroundColor: '#e74c3c',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addCandidate}
            style={{
              backgroundColor: '#3498db',
              color: '#fff',
              padding: '8px 14px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginBottom: '20px'
            }}
          >
            + Add Candidate
          </button>

          <br />

          <button
            type="submit"
            style={{
              width: '100%',
              backgroundColor: '#2ecc71',
              color: '#fff',
              padding: '10px',
              border: 'none',
              borderRadius: '5px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Create Voting
          </button>
        </form>

        {message && (
          <p style={{ marginTop: '15px', textAlign: 'center', color: message.startsWith('✅') ? 'green' : 'red' }}>
            {message}
          </p>
        )}

        {/* 🚀 Back to Dashboard Button */}
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            marginTop: '20px',
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            backgroundColor: '#34495e',
            color: '#fff',
            border: 'none',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default CreateElection;
