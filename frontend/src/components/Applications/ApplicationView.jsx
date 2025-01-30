import { useState, useEffect } from "react"
import Login from "./components/Login"
import NavTabs from "./components/NavTabs"
import Dashboard from "./components/Dashboard"
import ApplicationView from "./components/ApplicationView"
import NetworkView from "./components/NetworkView"
import InsightView from "./components/InsightView"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [userData, setUserData] = useState(null)

  // State for all our data
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
            contactsData.json(),
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

    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated])

  const handleLogin = (userData) => {
    setIsAuthenticated(true)
    setUserData(userData)
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#313338] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#313338] flex items-center justify-center">
        <div className="text-[#ED4245]">Error: {error}</div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard applications={applications} />
      case "applications":
        return <ApplicationView applications={applications} />
      case "network":
        return <NetworkView contacts={contacts} />
      case "insights":
        return <InsightView roleInsights={roleInsights} />
      default:
        return <Dashboard applications={applications} />
    }
  }

  return (
    <div className="min-h-screen bg-[#313338]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <NavTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {renderContent()}
      </div>
    </div>
  )
}

export default App
