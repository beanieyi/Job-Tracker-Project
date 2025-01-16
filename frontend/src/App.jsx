import { useState, useEffect } from "react"
import "./App.css"

function App() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
  }, [])

  if (loading) return <div>Loading applications...</div>
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
