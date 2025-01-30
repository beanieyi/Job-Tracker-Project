import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

// Component Imports
import Login from "./components/Auth/Login"
import NavTabs from "./components/Navigation/NavTabs"
import Dashboard from "./components/Dashboard/Dashboard"
import ApplicationView from "./components/Applications/ApplicationView"
import NetworkView from "./components/Network/NetworkView"
import InsightView from "./components/Insights/InsightView"

// Sample data for development
const sampleApplications = [
  {
    id: 1,
    position: "Frontend Developer",
    company: "Tech Corp",
    status: "Applied",
    date: "2025-01-15",
    priority: "High",
  },
  {
    id: 2,
    position: "Full Stack Developer",
    company: "Design Co",
    status: "Technical Interview",
    date: "2025-01-14",
    priority: "Medium",
  },
  // Add more sample data as needed
]

const sampleContacts = [
  {
    id: 1,
    name: "Alice Johnson",
    role: "Recruiter",
    company: "Tech Corp",
    linkedin: "linkedin.com",
    email: "alice@techcorp.com",
    phone: "555-0101",
  },
  // Add more sample contacts
]

const sampleRoleInsights = [
  {
    role_title: "Frontend Developer",
    common_skills: ["React", "JavaScript", "CSS", "HTML"],
    average_salary: "$80K - $110K",
    demand_trend: "High",
  },
  // Add more sample insights
]

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [applications] = useState(sampleApplications)
  const [contacts] = useState(sampleContacts)
  const [roleInsights] = useState(sampleRoleInsights)

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
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
