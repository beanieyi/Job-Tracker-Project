import { useState, useEffect } from "react"
import "./App.css"

function App() {
  const [applications, setApplications] = useState([])
  const [timelines, setTimelines] = useState([])
  const [contacts, setContacts] = useState([])
  const [roleInsights, setRoleInsights] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("applications")

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
    <div className="container mx-auto p-4">
      <nav className="flex space-x-4 mb-4">
        <TabButton
          active={activeTab === "applications"}
          onClick={() => setActiveTab("applications")}
        >
          Applications
        </TabButton>
        <TabButton
          active={activeTab === "timeline"}
          onClick={() => setActiveTab("timeline")}
        >
          Timeline
        </TabButton>
        <TabButton
          active={activeTab === "contacts"}
          onClick={() => setActiveTab("contacts")}
        >
          Network
        </TabButton>
        <TabButton
          active={activeTab === "insights"}
          onClick={() => setActiveTab("insights")}
        >
          Role Insights
        </TabButton>
      </nav>

      {activeTab === "applications" && (
        <ApplicationsView applications={applications} />
      )}

      {activeTab === "timeline" && (
        <TimelineView timelines={timelines} applications={applications} />
      )}

      {activeTab === "contacts" && <NetworkView contacts={contacts} />}

      {activeTab === "insights" && <InsightsView insights={roleInsights} />}
    </div>
  )
}

function TimelineView({ timelines, applications }) {
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

function ApplicationsView({ applications }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Job Applications</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 border-b text-left">Company</th>
              <th className="px-6 py-3 border-b text-left">Position</th>
              <th className="px-6 py-3 border-b text-left">Status</th>
              <th className="px-6 py-3 border-b text-left">Date</th>
              <th className="px-6 py-3 border-b text-left">Priority</th>
              <th className="px-6 py-3 border-b text-left">Matched Skills</th>
              <th className="px-6 py-3 border-b text-left">Required Skills</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b">{app.company}</td>
                <td className="px-6 py-4 border-b">{app.position}</td>
                <td className="px-6 py-4 border-b">
                  <StatusBadge status={app.status} />
                </td>
                <td className="px-6 py-4 border-b">
                  {new Date(app.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 border-b">
                  <PriorityBadge priority={app.priority} />
                </td>
                <td className="px-6 py-4 border-b">
                  <SkillsList skills={app.matched_skills} />
                </td>
                <td className="px-6 py-4 border-b">
                  <SkillsList skills={app.required_skills} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function NetworkView({ contacts }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Network Contacts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contacts.map((contact) => (
          <div key={contact.id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-lg">{contact.name}</h3>
            <p className="text-gray-600">{contact.role}</p>
            <p className="text-gray-600">{contact.company}</p>
            <div className="mt-2">
              <p className="text-sm">
                <span className="font-semibold">Connection:</span>{" "}
                {contact.connection}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Last Contact:</span>{" "}
                {new Date(contact.last_contact).toLocaleDateString()}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Email:</span> {contact.email}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Phone:</span> {contact.phone}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function InsightsView({ insights }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Role Insights</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight) => (
          <div
            key={insight.role_title}
            className="bg-white p-4 rounded-lg shadow"
          >
            <h3 className="font-bold text-lg">{insight.role_title}</h3>
            <div className="mt-2">
              <p className="text-sm">
                <span className="font-semibold">Average Salary:</span>{" "}
                {insight.average_salary}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Demand:</span>{" "}
                {insight.demand_trend}
              </p>
              <div className="mt-2">
                <p className="font-semibold text-sm">Common Skills:</p>
                <SkillsList skills={insight.common_skills} />
              </div>
              <div className="mt-2">
                <p className="font-semibold text-sm">Top Companies:</p>
                <div className="flex flex-wrap gap-1">
                  {insight.top_companies.map((company, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                    >
                      {company}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TabButton({ children, active, onClick }) {
  return (
    <button
      className={`px-4 py-2 rounded-lg ${
        active
          ? "bg-blue-600 text-white"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

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

export default App
