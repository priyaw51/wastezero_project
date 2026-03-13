import React, { useEffect, useState } from "react";
import axios from "axios";

const MatchDashboard = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMatches = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/matches");
      setMatches(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching matches:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Loading Matches...</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Match Dashboard</h1>

      {matches.length === 0 ? (
        <p style={{ textAlign: "center" }}>No matches found</p>
      ) : (
        <div style={styles.grid}>
          {matches.map((match) => (
            <div key={match._id} style={styles.card}>
              <h3>{match.title || "Match Request"}</h3>

              <p>
                <strong>NGO:</strong> {match.ngoName || "N/A"}
              </p>

              <p>
                <strong>Volunteer:</strong> {match.volunteerName || "N/A"}
              </p>

              <p>
                <strong>Location:</strong> {match.location || "N/A"}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color:
                      match.status === "completed"
                        ? "green"
                        : match.status === "pending"
                        ? "orange"
                        : "blue",
                    fontWeight: "bold",
                  }}
                >
                  {match.status || "pending"}
                </span>
              </p>

              <button style={styles.button}>View Details</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    backgroundColor: "#f4f6f8",
    minHeight: "100vh",
  },

  heading: {
    textAlign: "center",
    marginBottom: "30px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "20px",
  },

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
  },

  button: {
    marginTop: "10px",
    padding: "8px 15px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default MatchDashboard;