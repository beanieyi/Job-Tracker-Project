// frontend/src/App.jsx

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

// Component Imports
import Login from "./components/Auth/Login"
import NavTabs from "./components/Navigation/NavTabs"
import Dashboard from "./components/Dashboard/Dashboard"
import ApplicationView from "./components/Applications/ApplicationView"
import NetworkView from "./components/Network/NetworkView"
import InsightView from "./components/Insights/InsightView"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true) // Skip auth for now
  const [activeTab, setActiveTab] = useState("dashboard")
  const [applications, setApplications] = useState([])
  const [contacts, setContacts] = useState([])
  const [roleInsights, setRoleInsights] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        // Fetch applications
        const appResponse = await fetch(
          "http://localhost:8000/api/applications"
        )
        if (!appResponse.ok) {
          throw new Error(`Applications API error: ${appResponse.statusText}`)
        }
        const appData = await appResponse.json()
        console.log("Applications data:", {
          count: appData.length,
          sample: appData[0],
        })
        setApplications(appData)

        // Fetch contacts
        const contactsResponse = await fetch(
          "http://localhost:8000/api/contacts"
        )
        if (!contactsResponse.ok) {
          throw new Error(`Contacts API error: ${contactsResponse.statusText}`)
        }
        const contactsData = await contactsResponse.json()
        console.log("Contacts data:", {
          count: contactsData.length,
          sample: contactsData[0],
        })
        setContacts(contactsData)

        // Fetch role insights
        const insightsResponse = await fetch(
          "http://localhost:8000/api/role-insights"
        )
        if (!insightsResponse.ok) {
          throw new Error(`Insights API error: ${insightsResponse.statusText}`)
        }
        const insightsData = await insightsResponse.json()
        console.log("Insights data:", {
          count: insightsData.length,
          sample: insightsData[0],
        })
        setRoleInsights(insightsData)
      } catch (err) {
        console.error("Fetch error:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Debug effect to log state changes
  useEffect(() => {
    console.log("Current state:", {
      applicationsCount: applications.length,
      contactsCount: contacts.length,
      insightsCount: roleInsights.length,
    })
  }, [applications, contacts, roleInsights])

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#313338] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white text-xl"
        >
          Loading...
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#313338] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-500 text-xl p-4 bg-[#2B2D31] rounded-lg"
        >
          <div className="font-bold mb-2">Error loading data:</div>
          <div>{error}</div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#313338]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <NavTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <AnimatePresence mode="wait">
          <motion.main
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6"
          >
            {activeTab === "dashboard" && (
              <Dashboard applications={applications} />
            )}
            {activeTab === "applications" && (
              <ApplicationView applications={applications} />
            )}
            {activeTab === "network" && <NetworkView contacts={contacts} />}
            {activeTab === "insights" && (
              <InsightView roleInsights={roleInsights} />
            )}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App
