import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./SectorHead/LoadingSpinner";
import IssueCard from "./IssueCard";
import IssueDetailsModal from "./CitizenDashboard/IssueDetailsModal";
import NewIssueModal from "./CitizenDashboard/NewIssueModal";
import FeedbackModal from "./FeedbackModal";

function CitizenRequests({ requests, setRequests, onCreateRequest }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://civicconnect-backend.onrender.com/api/request/my-requests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(res.data);
      } catch (err) {
        console.error("Error fetching requests:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [setRequests]);

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <>
      <style>{`
        .citizen-requests {
          padding: 16px;
        }

        .citizen-requests h2 {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 12px;
        }

        .empty-msg {
          color: gray;
          font-style: italic;
        }

        .request-card {
          border: 1px solid #ddd;
          border-radius: 10px;
          padding: 16px;
          margin-bottom: 12px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          background: #fff;
        }

        .request-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .request-header h3 {
          margin: 0;
          font-weight: bold;
          font-size: 16px;
        }

        .status {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: bold;
          text-transform: capitalize;
        }

        .status-approved {
          background: #d4edda;
          color: #155724;
        }

        .status-rejected {
          background: #f8d7da;
          color: #721c24;
        }

        .status-pending {
          background: #fff3cd;
          color: #856404;
        }

        .remarks {
          margin-top: 8px;
          color: #555;
          font-style: italic;
        }

        .loading {
          text-align: center;
          color: gray;
        }

        .create-request-btn {
          margin-bottom: 20px;
          padding: 10px 20px;
          background-color: #64ffda;
          color: #0a192f;
          border: none;
          border-radius: 6px;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .create-request-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(100, 255, 218, 0.3);
        }
      `}</style>

      <div className="citizen-requests">
        <h2>My Gathering Requests</h2>
        
        <button 
          className="create-request-btn"
          onClick={onCreateRequest}
        >
          <i className="fas fa-plus"></i> Create New Request
        </button>
        
        {requests.length === 0 ? (
          <p className="empty-msg">No requests submitted yet.</p>
        ) : (
          requests.map((req) => (
            <div key={req._id} className="request-card">
              <div className="request-header">
                <h3>{req.gatheringName}</h3>
                <span
                  className={`status ${
                    req.status === "approved"
                      ? "status-approved"
                      : req.status === "rejected"
                      ? "status-rejected"
                      : "status-pending"
                  }`}
                >
                  {req.status}
                </span>
              </div>
              <p>📍 {req.location}</p>
              <p>👥 {req.expectedPeople} people</p>
              <p>📅 {new Date(req.date).toLocaleDateString()}</p>
              <p>🎯 {req.type}</p>
              {req.remarks && <p className="remarks">Remarks: {req.remarks}</p>}
            </div>
          ))
        )}
      </div>
    </>
  );
}

function NewRequestModal({ onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    gatheringName: "",
    type: "Cultural",
    expectedPeople: "",
    date: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.gatheringName.trim()) {
      newErrors.gatheringName = "Gathering name is required";
    }
    
    if (!formData.expectedPeople || formData.expectedPeople <= 0) {
      newErrors.expectedPeople = "Please enter a valid number of people";
    }
    
    if (!formData.date) {
      newErrors.date = "Date is required";
    }
    
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error creating request:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#112240',
        padding: '30px',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        border: '1px solid #233554'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          paddingBottom: '15px',
          borderBottom: '1px solid #233554'
        }}>
          <h2 style={{
            color: '#64ffda',
            margin: 0,
            fontSize: '1.5rem'
          }}>
            Create New Gathering Request
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ccd6f6',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '5px'
            }}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#ccd6f6',
              fontWeight: '500'
            }}>
              Gathering Name *
            </label>
            <input
              type="text"
              name="gatheringName"
              value={formData.gatheringName}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: errors.gatheringName ? '2px solid #ff6b6b' : '1px solid #233554',
                background: '#0a192f',
                color: '#ccd6f6',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              placeholder="Enter gathering name"
            />
            {errors.gatheringName && (
              <p style={{ color: '#ff6b6b', fontSize: '0.875rem', marginTop: '5px' }}>
                {errors.gatheringName}
              </p>
            )}
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#ccd6f6',
              fontWeight: '500'
            }}>
              Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #233554',
                background: '#0a192f',
                color: '#ccd6f6',
                fontSize: '1rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="Cultural">Cultural</option>
              <option value="Religious">Religious</option>
              <option value="Political">Political</option>
              <option value="Family">Family</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#ccd6f6',
              fontWeight: '500'
            }}>
              Expected Number of People *
            </label>
            <input
              type="number"
              name="expectedPeople"
              value={formData.expectedPeople}
              onChange={handleChange}
              min="1"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: errors.expectedPeople ? '2px solid #ff6b6b' : '1px solid #233554',
                background: '#0a192f',
                color: '#ccd6f6',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              placeholder="Enter number of people"
            />
            {errors.expectedPeople && (
              <p style={{ color: '#ff6b6b', fontSize: '0.875rem', marginTop: '5px' }}>
                {errors.expectedPeople}
              </p>
            )}
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#ccd6f6',
              fontWeight: '500'
            }}>
              Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: errors.date ? '2px solid #ff6b6b' : '1px solid #233554',
                background: '#0a192f',
                color: '#ccd6f6',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
            />
            {errors.date && (
              <p style={{ color: '#ff6b6b', fontSize: '0.875rem', marginTop: '5px' }}>
                {errors.date}
              </p>
            )}
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#ccd6f6',
              fontWeight: '500'
            }}>
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: errors.location ? '2px solid #ff6b6b' : '1px solid #233554',
                background: '#0a192f',
                color: '#ccd6f6',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              placeholder="Enter location details"
            />
            {errors.location && (
              <p style={{ color: '#ff6b6b', fontSize: '0.875rem', marginTop: '5px' }}>
                {errors.location}
              </p>
            )}
          </div>
          
          <div style={{
            display: 'flex',
            gap: '15px',
            justifyContent: 'flex-end',
            marginTop: '30px'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                borderRadius: '6px',
                border: '1px solid #233554',
                background: 'transparent',
                color: '#ccd6f6',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 20px',
                borderRadius: '6px',
                border: 'none',
                background: '#64ffda',
                color: '#0a192f',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Creating...
                </>
              ) : (
                'Create Request'
              )}
            </button>
          </div>
        </form>
      </div>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');
      `}</style>
    </div>
  );
}

export default function CitizenDashboard() {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [citizenName, setCitizenName] = useState("");
  const [showNewIssueModal, setShowNewIssueModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [exporting, setExporting] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [issueToFeedback, setIssueToFeedback] = useState(null);
  const [feedbacks, setFeedbacks] = useState({});
  const [showRequests, setShowRequests] = useState(false);
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  const statusFilters = [
    { id: "all", label: "All Issues" },
    { id: "pending", label: "Pending" },
    { id: "in-progress", label: "In Progress" },
    { id: "resolved", label: "Resolved" },
    { id: "escalated", label: "Escalated" },
    { id: "closed", label: "Closed" }
  ];

  const fetchFeedbacks = async (token, issuesData) => {
    const closedIssues = issuesData.filter(issue => issue.status === "closed");
    if (closedIssues.length > 0) {
      try {
        const response = await axios.get(
          "https://civicconnect-backend.onrender.com/api/feedback/batch",
          {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              issueIds: closedIssues.map(issue => issue._id).join(',')
            }
          }
        );
        
        if (response.data && response.data.feedbacks) {
          const feedbacksMap = {};
          response.data.feedbacks.forEach(feedback => {
            if (feedback) {
              feedbacksMap[feedback.issueId] = feedback;
            }
          });
          return feedbacksMap;
        }
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    }
    return {};
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      const [citizenRes, issuesRes] = await Promise.all([
        axios.get("https://civicconnect-backend.onrender.com/api/citizen/me", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("https://civicconnect-backend.onrender.com/api/issues/my", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setCitizenName(citizenRes.data.name || "Citizen");
      const issuesData = Array.isArray(issuesRes.data)
        ? issuesRes.data
        : issuesRes.data?.issues || [];
      
      const feedbacksData = await fetchFeedbacks(token, issuesData);
      
      setIssues(issuesData);
      setFilteredIssues(issuesData);
      setFeedbacks(feedbacksData);
      
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredIssues(issues);
    } else {
      const normalize = (str) => str?.toLowerCase().replace(/[\s_]+/g, "-");
      setFilteredIssues(
        issues.filter(
          (issue) => normalize(issue.status) === normalize(activeFilter)
        )
      );
    }
  }, [activeFilter, issues]);

  const handleIssueClick = (issue) => {
    setSelectedIssue(issue);
  };

  const handleCreateNewIssue = async (newIssueData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://civicconnect-backend.onrender.com/api/issues/report",
        newIssueData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIssues([response.data, ...issues]);
      setFilteredIssues([response.data, ...filteredIssues]);
      setShowNewIssueModal(false);
    } catch (error) {
      console.error("Error creating new issue:", error);
    }
  };

  const handleCreateNewRequest = async (requestData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://civicconnect-backend.onrender.com/api/request/create",
        requestData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Refresh the requests list
      const token2 = localStorage.getItem("token");
      const requestsRes = await axios.get("https://civicconnect-backend.onrender.com/api/request/my-requests", {
        headers: { Authorization: `Bearer ${token2}` }
      });
      
      setRequests(requestsRes.data);
      
      return response.data;
    } catch (error) {
      console.error("Error creating new request:", error);
      throw error;
    }
  };

  const handleExportIssues = async () => {
    try {
      setExporting(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://civicconnect-backend.onrender.com/api/issues/export-issues",
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob"
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "my-issues-export.csv");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error exporting issues:", error);
    } finally {
      setExporting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const closeModal = () => {
    setSelectedIssue(null);
  };

  const handleFeedbackClick = (issue) => {
    setIssueToFeedback(issue);
    setShowFeedbackModal(true);
  };

  const handleFeedbackSubmit = async (issueId, rating, comment) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://civicconnect-backend.onrender.com/api/feedback/submit",
        { issueId, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIssues((prev) =>
        prev.map((issue) => {
          if (!issue || !issue._id) return issue;
          return issue._id === issueId ? { ...issue, hasFeedback: true } : issue;
        })
      );
    } catch (err) {
      console.error("Error submitting feedback:", err.message);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0a192f",
        fontFamily: "'Poppins', sans-serif",
        color: "#ccd6f6",
        display: "flex",
        flexDirection: "column",
        margin: 0,
        padding: 0,
        width: "100vw",
        overflowX: "hidden"
      }}
    >
      <header
        style={{
          backgroundColor: "#112240",
          padding: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              margin: 0,
              color: "#64ffda"
            }}
          >
            <i className="fas fa-user" style={{ marginRight: "10px" }}></i>
            {citizenName}'s Dashboard
          </h1>
        </div>

        <div style={{ display: "flex", gap: "15px" }}>
          <button
            onClick={() => setShowRequests(true)}
            style={{
              padding: "8px 15px",
              borderRadius: "100px",
              border: "none",
              background: "#64ffda",
              color: "#0a192f",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.9rem",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <i className="fas fa-calendar-check"></i> My Requests
          </button>

          <button
            onClick={() => setShowNewIssueModal(true)}
            style={{
              padding: "8px 15px",
              borderRadius: "100px",
              border: "none",
              background: "#64ffda",
              color: "#0a192f",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.9rem",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <i className="fas fa-plus"></i> New Issue
          </button>

          <button
            onClick={handleExportIssues}
            disabled={exporting}
            style={{
              padding: "8px 15px",
              borderRadius: "100px",
              border: "none",
              background: "#1e90ff",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.9rem",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              opacity: exporting ? 0.7 : 1
            }}
          >
            {exporting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Exporting...
              </>
            ) : (
              <>
                <i className="fas fa-download"></i> Export Issues
              </>
            )}
          </button>

          <button
            onClick={handleLogout}
            style={{
              padding: "8px 15px",
              borderRadius: "100px",
              border: "none",
              background: "#ff6b6b",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.9rem",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </header>

      <div
        style={{
          flex: 1,
          width: "100%",
          overflowY: "auto",
          padding: "20px",
          boxSizing: "border-box"
        }}
      >
        {!showRequests ? (
          <div
            style={{
              width: "100%",
              maxWidth: "100%",
              padding: "0 20px",
              boxSizing: "border-box"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
                flexWrap: "wrap",
                gap: "15px"
              }}
            >
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  color: "#ccd6f6"
                }}
              >
                <i className="fas fa-exclamation-circle"></i> Your Reported Issues
              </h2>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {statusFilters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    style={{
                      padding: "8px 15px",
                      borderRadius: "20px",
                      border: "none",
                      background:
                        activeFilter === filter.id ? "#64ffda" : "#112240",
                      color:
                        activeFilter === filter.id ? "#0a192f" : "#ccd6f6",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "0.8rem",
                      transition: "all 0.3s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px"
                    }}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredIssues.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  color: "#8892b0",
                  backgroundColor: "#112240",
                  borderRadius: "8px",
                  marginTop: "20px"
                }}
              >
                <i
                  className="fas fa-check-circle"
                  style={{
                    fontSize: "3rem",
                    color: "#64ffda",
                    marginBottom: "15px"
                  }}
                ></i>
                <p style={{ fontSize: "1.1rem" }}>
                  {activeFilter === "all"
                    ? "You haven't reported any issues yet."
                    : `No ${
                        statusFilters.find((f) => f.id === activeFilter)?.label
                      } issues found.`}
                </p>
                <button
                  onClick={() => setShowNewIssueModal(true)}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "5px",
                    border: "none",
                    background: "#64ffda",
                    color: "#0a192f",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    transition: "all 0.3s ease",
                    marginTop: "15px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  <i className="fas fa-plus"></i> Report Your First Issue
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "20px",
                  width: "100%"
                }}
              >
                {filteredIssues.map((issue) => (
                  <IssueCard
                    key={issue._id}
                    issue={issue}
                    isSelected={selectedIssue?._id === issue._id}
                    onClick={() => handleIssueClick(issue)}
                    onFeedbackClick={
                      issue.status?.toLowerCase() === "closed" && !feedbacks[issue._id]
                        ? () => handleFeedbackClick(issue)
                        : null
                    }
                    feedback={feedbacks[issue._id]}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                margin: 0,
                color: '#ccd6f6'
              }}>
                My Gathering Requests
              </h2>
              <button
                onClick={() => setShowRequests(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#64ffda',
                  color: '#0a192f',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <i className="fas fa-arrow-left"></i>
                Back to Issues
              </button>
            </div>
            <CitizenRequests 
              requests={requests}
              setRequests={setRequests}
              onCreateRequest={() => setShowNewRequestModal(true)} 
            />
          </div>
        )}
      </div>

      {showNewIssueModal && (
        <NewIssueModal
          onSubmit={handleCreateNewIssue}
          onClose={() => setShowNewIssueModal(false)}
        />
      )}

      {showNewRequestModal && (
        <NewRequestModal
          onSubmit={handleCreateNewRequest}
          onClose={() => setShowNewRequestModal(false)}
        />
      )}

      {selectedIssue && (
        <IssueDetailsModal
          selectedIssue={selectedIssue}
          onClose={closeModal}
          isCitizenView={true}
          feedback={feedbacks[selectedIssue._id]}
        />
      )}

      {showFeedbackModal && issueToFeedback && (
        <FeedbackModal
          issue={issueToFeedback}
          existingFeedback={feedbacks[issueToFeedback._id]}
          onSubmit={(rating, comment) => 
            handleFeedbackSubmit(issueToFeedback._id, rating, comment)
          }
          onClose={() => {
            setShowFeedbackModal(false);
            setIssueToFeedback(null);
          }}
        />
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');
       
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
       
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }

        .issue-card {
          transition: all 0.3s ease;
        }

        .issue-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 8px rgba(255, 255, 255, 0.15);
        }
      `}</style>
    </div>
  );
}
