/**
 * @fileoverview Main application component for the Job Tracker application.
 * Displays a table of job applications fetched from the backend API.
 *
 * @requires react
 */

import { useState, useEffect } from "react"
import "./App.css"

/**
 * Main application component that fetches and displays job applications in a tabular format.
 * Implements loading states and error handling for data fetching.
 *
 * @component
 * @returns {JSX.Element} Rendered component
 */
function App() {
  // State management for applications data, loading state, and error handling
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  /**
   * Effect hook to fetch applications data from the backend API.
   * Sets loading state during fetch and handles potential errors.
   */
  useEffect(() => {
    fetch("http://localhost:8000/api/applications")
      .then((response) => response.json())
      .then((data) => {
        setApplications(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, []) // Empty dependency array ensures fetch occurs only on mount

  // Display loading state while fetching data
  if (loading) return <div>Loading applications...</div>

  // Display error message if fetch failed
  if (error) return <div>Error: {error}</div>

  return (
    <div className="container">
      <h1>Job Applications</h1>
      <table className="applications-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Position</th>
            <th>Status</th>
            <th>Location</th>
            <th>Salary Range</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id}>
              <td>{app.company_name}</td>
              <td>{app.position_title}</td>
              <td>{app.status}</td>
              <td>{app.location}</td>
              <td>{app.salary_range}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App
