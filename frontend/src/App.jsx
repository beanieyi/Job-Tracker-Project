import { useState, useEffect } from "react"
import PropTypes from "prop-types"
import "./App.css"
import NavTabs from "./components/NavTabs"

// MUI SignIn Component
import SlotsSignIn from "./components/SignIn"

// MUI Imports (AppView Table)
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"

// MUI Imports (NetworkView Cards)
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"

// motion.dev imports for animations
import * as motion from "motion/react-client"

// Main App function
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [applications, setApplications] = useState([])
  const [timelines, setTimelines] = useState([])
  const [contacts, setContacts] = useState([])
  const [roleInsights, setRoleInsights] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const signIn = async (formData) => {
    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: formData.email,
          password: formData.password,
        }).toString(),
      })

      if (!response.ok) {
        throw new Error("Invalid Email or Password")
      }

      const data = await response.json()
      localStorage.setItem("access_token", data.access_token)
      setIsAuthenticated(true)
    } catch (err) {
      console.error("Failed to Login:", err.message)
      throw err
    }
  }

  // Log out
  const byebye = () => {
    localStorage.removeItem("access_token")
    setIsAuthenticated(false)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Token for specified user data
        const bearerToken = localStorage.getItem("access_token")
        const headers = bearerToken
          ? { Authorization: `Bearer ${bearerToken}` }
          : {}

        const [applicationsRes, timelinesRes, contactsRes, insightsRes] =
          await Promise.all([
            fetch("http://localhost:8000/api/applications", { headers }),
            fetch("http://localhost:8000/api/timelines", { headers }),
            fetch("http://localhost:8000/api/contacts", { headers }),
            fetch("http://localhost:8000/api/role-insights", { headers }),
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

    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return <SlotsSignIn signIn={signIn} />
  }

  if (loading) return <div className="p-4">Loading data...</div>
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>

  return (
    <div>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap');
        `}
      </style>

      <h1 className="header">
        Job Tracker Application
        <Button onClick={byebye}>Logout</Button>
      </h1>
      <nav>
        <NavTabs
          timelines={timelines}
          applications={applications}
          contacts={contacts}
          roleInsights={roleInsights}
        />
      </nav>
    </div>
  )
}

// Applications page
function ApplicationView({ applications }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: 0.3,
        ease: [0, 0.71, 0.2, 1.01],
      }}
    >
      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <Button variant="contained" sx={{ backgroundColor: "#5865F2" }}>
          Add Application
        </Button>
      </div>

      <TableContainer component={Paper} sx={{ backgroundColor: "#282b30" }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow sx={{ borderBottom: "2.5px solid #5865F2" }}>
              <TableCell
                sx={{ color: "white", fontSize: "1rem", fontWeight: "bold" }}
              >
                Job Title
              </TableCell>
              <TableCell
                align="right"
                sx={{ color: "white", fontSize: "1rem", fontWeight: "bold" }}
              >
                Company
              </TableCell>
              <TableCell
                align="right"
                sx={{ color: "white", fontSize: "1rem", fontWeight: "bold" }}
              >
                Date Applied
              </TableCell>
              <TableCell
                align="right"
                sx={{ color: "white", fontSize: "1rem", fontWeight: "bold" }}
              >
                Status
              </TableCell>
              <TableCell
                align="right"
                sx={{ color: "white", fontSize: "1rem", fontWeight: "bold" }}
              >
                Edit
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications?.map((app) => (
              <TableRow
                key={app.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="app" sx={{ color: "white" }}>
                  {app.position}
                </TableCell>
                <TableCell align="right" sx={{ color: "white" }}>
                  {app.company}
                </TableCell>
                <TableCell align="right" sx={{ color: "white" }}>
                  {app.date}
                </TableCell>
                <TableCell align="right" sx={{ color: "white" }}>
                  {app.status}
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ backgroundColor: "#5865F2" }}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </motion.div>
  )
}

// Timeline of applications page
function TimelineView() {
  return <p>Timeline View</p>
}

// Network Page
function NetworkView({ contacts }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: 0.3,
        ease: [0, 0.71, 0.2, 1.01],
      }}
    >
      <h2 className="network-header">Professional Network</h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "50px",
          justifyContent: "flex-start",
        }}
      >
        {contacts?.map((contact) => (
          <motion.div key={contact.id} whileHover={{ scale: 1.2 }}>
            <Card sx={{ width: 300, backgroundColor: "#282b30" }}>
              <CardContent>
                <Typography
                  sx={{ color: "#FFFFFF" }}
                  gutterBottom
                  variant="h5"
                  component="div"
                >
                  {contact.name || "Unknown Name"}
                </Typography>
                <Typography variant="body2" sx={{ color: "#FFFFFF" }}>
                  {contact.company || "Company not found."}
                </Typography>
              </CardContent>
              <CardActions>
                <Button sx={{ color: "#5865F2" }} size="small">
                  Email
                </Button>
                <Button sx={{ color: "#5865F2" }} size="small">
                  LinkedIn
                </Button>
              </CardActions>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// Insight page
function InsightView() {
  return <p>Insights View</p>
}

// PropTypes
ApplicationView.propTypes = {
  applications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      position: PropTypes.string,
      company: PropTypes.string,
      date: PropTypes.string,
      status: PropTypes.string,
    })
  ),
}

NetworkView.propTypes = {
  contacts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      company: PropTypes.string,
    })
  ),
}

export { ApplicationView, TimelineView, NetworkView, InsightView }
export default App
