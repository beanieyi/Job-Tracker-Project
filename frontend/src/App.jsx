import { useState, useEffect } from "react"
import "./App.css"
import NavTabs from './components/NavTabs'


// MUI Imports (AppView Table)
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


// Main App function
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
function ApplicationView( { applications } ) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Job Title</TableCell>
            <TableCell align="right">Company</TableCell>
            <TableCell align="right">Date Applied</TableCell>
            <TableCell align="right">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {applications.map((row) => (
            <TableRow
              key={app.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{app.company}</TableCell>
              <TableCell align="right">{app.dateApplied}</TableCell>
              <TableCell align="right">{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export { ApplicationView }


// Timeline of applications page
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


// Network Page
function NetworkView() {
  return (
    <p>People</p>
  )
}
export { NetworkView }


// Insight page
function InsightView() {
  return (
    <p>No way</p>
  )
}
export { InsightView }


export default App;