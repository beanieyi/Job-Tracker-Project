import { useState, useEffect } from "react"
import "./App.css"
import NavTabs from './components/NavTabs'

function App() {
  const [applications, setApplications] = useState([])
  const [timelines, setTimelines] = useState([])
  const [contacts, setContacts] = useState([])
  const [roleInsights, setRoleInsights] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [applicationsRes, timelinesRes, contactsRes, insightsRes] =
          await Promise.all([
            fetch("http://localhost:8000/api/applications"),
            fetch("http://localhost:8000/api/timelines"),
            fetch("http://localhost:8000/api/contacts"),
            fetch("http://localhost:8000/api/role-insights"),
          ])

        if (!applicationsRes.ok)
          throw new Error(
            `Applications fetch failed: ${applicationsRes.status}`
          )
        if (!timelinesRes.ok)
          throw new Error(`Timelines fetch failed: ${timelinesRes.status}`)
        if (!contactsRes.ok)
          throw new Error(`Contacts fetch failed: ${contactsRes.status}`)
        if (!insightsRes.ok)
          throw new Error(`Insights fetch failed: ${insightsRes.status}`)

        const [applicationsData, timelinesData, contactsData, insightsData] =
          await Promise.all([
            applicationsRes.json(),
            timelinesRes.json(),
            contactsRes.json(),
            insightsRes.json(),
          ])

        setApplications(applicationsData)
        setTimelines(timelinesData)
        setContacts(contactsData)
        setRoleInsights(insightsData)
        setLoading(false)
      } catch (err) {
        console.error("Fetch error:", err)
        setError(err.message)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div className="p-4">Loading data...</div>
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>


  return (
    <div>
      <h1 className="header">
        Robin Yi 
      </h1>
      <nav>
        <NavTabs/>
      </nav>
    </div>
  )

}


function ApplicationView() {
  return (
    <p>Hello</p>
  )
  
}
export { ApplicationView }


function TimelineView({timelines, applications}) {
  // Create a map of application IDs to company names for reference
  const applicationMap = applications.reduce((acc, app) => {
    acc[app.id] = { company: app.company, position: app.position }
    return acc
  }, {})

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Application Timeline</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 border-b text-left">Company</th>
              <th className="px-6 py-3 border-b text-left">Position</th>
              <th className="px-6 py-3 border-b text-left">Status</th>
              <th className="px-6 py-3 border-b text-left">Date</th>
              <th className="px-6 py-3 border-b text-left">Notes</th>
            </tr>
          </thead>
          <tbody>
            {timelines.map((entry) => (
              <tr key={entry.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b">
                  {applicationMap[entry.application_id]?.company || "Unknown"}
                </td>
                <td className="px-6 py-4 border-b">
                  {applicationMap[entry.application_id]?.position || "Unknown"}
                </td>
                <td className="px-6 py-4 border-b">
                  <StatusBadge status={entry.status} />
                </td>
                <td className="px-6 py-4 border-b">
                  {new Date(entry.date).toLocaleString()}
                </td>
                <td className="px-6 py-4 border-b">{entry.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    )
  }
export { TimelineView }


function NetworkView() {
  return (
    <p>People</p>
  )
}
export { NetworkView }


function InsightView() {
  return (
    <p>No way</p>
  )
}
export { InsightView }


function StatusBadge({ status }) {
  const statusColors = {
    Offer: "bg-green-100 text-green-800",
    Accepted: "bg-blue-100 text-blue-800",
    Rejected: "bg-red-100 text-red-800",
    Withdrawn: "bg-gray-100 text-gray-800",
    "No Response": "bg-yellow-100 text-yellow-800",
    "Technical Interview": "bg-purple-100 text-purple-800",
    "Initial Screen": "bg-indigo-100 text-indigo-800",
    "Final Interview": "bg-pink-100 text-pink-800",
    Applied: "bg-orange-100 text-orange-800",
  }

  const colorClass = statusColors[status] || "bg-gray-100 text-gray-800"

  return (
    <span className={`px-2 py-1 rounded-full text-sm ${colorClass}`}>
      {status}
    </span>
  )
}

function PriorityBadge({ priority }) {
  const priorityColors = {
    High: "bg-red-100 text-red-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Low: "bg-green-100 text-green-800",
  }

  const colorClass = priorityColors[priority] || "bg-gray-100 text-gray-800"

  return (
    <span className={`px-2 py-1 rounded-full text-sm ${colorClass}`}>
      {priority}
    </span>
  )
}

function SkillsList({ skills }) {
  if (!Array.isArray(skills)) return null

  return (
    <div className="flex flex-wrap gap-1">
      {skills.map((skill, index) => (
        <span
          key={index}
          className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
        >
          {skill}
        </span>
      ))}
    </div>
  )
}


export default App;