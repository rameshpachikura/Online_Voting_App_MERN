import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { useNavigate } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);

// Use environment variable for API base URL
const API = process.env.REACT_APP_API_URL;

function ResultChart({ election }) {
  const labels = election.candidates.map(c => c.name);
  const votes = election.candidates.map(c => c.votes);
  const totalVotes = votes.reduce((a, b) => a + b, 0);

  const data = {
    labels,
    datasets: [
      {
        label: 'Votes',
        data: votes,
        backgroundColor: [
          '#3b82f6',
          '#f97316',
          '#10b981',
          '#ef4444',
          '#a855f7',
        ],
        borderRadius: 6,
        borderSkipped: false,
        barThickness: 30,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 2,
    plugins: {
      title: {
        display: true,
        text: 'Vote Count',
        font: { size: 16, weight: 'bold' },
      },
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.raw;
            const percent = ((value / totalVotes) * 100).toFixed(1);
            return `${value} votes (${percent}%)`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, precision: 0, color: '#6b7280' },
        title: {
          display: true,
          text: 'Votes',
          color: '#374151',
          font: { weight: 'bold' },
        },
        grid: { color: '#e5e7eb' },
      },
      x: {
        ticks: { color: '#374151' },
        grid: { display: false },
      },
    },
  };

  return (
    <div style={{ height: '250px', maxWidth: '600px', margin: '0 auto' }}>
      <Bar data={data} options={options} />
    </div>
  );
}

function ViewResults() {
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    fetch(`${API}/api/vote/results`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setResults)
      .catch(console.error);
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Election Results</h2>

      <button style={styles.backButton} onClick={() => navigate('/dashboard')}>
        ← Back to Dashboard
      </button>

      {results.length === 0 ? (
        <p style={styles.noResults}>No results available yet.</p>
      ) : (
        results.map((result) => (
          <div key={result._id} style={styles.card}>
            <h3 style={styles.electionTitle}>{result.title}</h3>
            <div style={styles.candidateList}>
              {result.candidates.map((c) => (
                <p key={c._id} style={styles.candidateText}>
                  <strong>{c.name}</strong>: {c.votes} votes
                </p>
              ))}
            </div>
            <ResultChart election={result} />
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '30px',
    backgroundColor: '#f9fafb',
    fontFamily: 'Arial, sans-serif',
    minHeight: '100vh',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#1f2937',
    textAlign: 'center',
  },
  backButton: {
    marginBottom: '20px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    fontSize: '14px',
  },
  noResults: {
    fontSize: '16px',
    color: '#6b7280',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    padding: '20px',
    marginBottom: '30px',
    maxWidth: '800px',
    margin: '0 auto 30px auto',
  },
  electionTitle: {
    fontSize: '20px',
    color: '#1d4ed8',
    marginBottom: '10px',
    textAlign: 'center',
  },
  candidateList: {
    marginBottom: '15px',
    color: '#374151',
  },
  candidateText: {
    fontSize: '15px',
    marginBottom: '4px',
  },
};

export default ViewResults;
