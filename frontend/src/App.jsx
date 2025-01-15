/**
 * Job Tracker Application main component.
 * Displays job applications in a tabular format with data fetched from the backend API.
 */

import { useState, useEffect } from "react"
import "./App.css"

function App() {
  // State management for applications data and loading states
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch applications data on component mount
  useEffect(() => {
    fetch("http://localhost:8000/api/applications")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch applications")
        }
        return response.json()
      })
      .then((data) => {
        setApplications(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  // Loading state handler
  if (loading) return <div>Loading applications...</div>

  // Error state handler
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
