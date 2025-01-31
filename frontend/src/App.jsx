import { useState, useEffect } from "react"
import "./App.css"
import NavTabs from './components/NavTabs'
import * as React from 'react';

// MUI Toolpad (Auth Page)
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage } from '@toolpad/core/SignInPage';
import { createTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';

// MUI Imports (AppView Table)
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

// MUI Imports (NetworkView Cards)
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// motion.dev imports for animations
import * as motion from "motion/react-client";

// Create theme for Auth page
const customTheme = createTheme({
  palette: {
    primary: {
      main: '#5865F2', // Primary buttons color
    },
    secondary: {
      main: '#ff4081', // Secondary
    },
    background: {
      default: '#2f3136', // Background color
      paper: '#ffffff', // Background color for paper components like cards
    },
  },
});


// Authentication state
const providers = [{ id: 'credentials', name: 'Email and Password' }];

// Main App function
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [applications, setApplications] = useState([])
  const [timelines, setTimelines] = useState([])
  const [contacts, setContacts] = useState([])
  const [roleInsights, setRoleInsights] = useState([])
  const [loading, setLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null)

  // Sign-in function
  const signIn = async (provider, formData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsLoading(false); ;
        setIsAuthenticated(true); // Set user as authenticated
        resolve();
      }, 300);
    });
  };

  useEffect(() => {

    if (!isAuthenticated) return;

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
  }, [isAuthenticated])

  // If not authenticated, show Sign-In Page
  if (!isAuthenticated) {
    return (
      <AppProvider theme={customTheme}>
        {isLoading ? (
              // Show the spinner while loading
              <CircularProgress />
            ) : (
              // Show the SignInPage when not loading
              <SignInPage
                signIn={signIn}
                providers={providers}
                slotProps={{ emailField: { autoFocus: false } }}
              />
            )}
      </AppProvider>
    );
  }

  if (loading) return <div className="p-4">Loading data...</div>
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>

  return (
    <div>
      {/* Import fonts */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap');
        `}
      </style>

      <h1 className="header">
        Job Tracker Application
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

  // Debugging Purposes
  // console.log(applications);

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
            {applications.map((app) => (
              <TableRow
                key={app.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="app">
                  {app.position}
                </TableCell>
                <TableCell align="right">{app.company}</TableCell>
                <TableCell align="right">{app.date}</TableCell>
                <TableCell align="right">{app.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </motion.div>
  );
}
export { ApplicationView }


// Timeline of applications page
function TimelineView() {
  return (
    <p>Wowwww</p>
  )
}
export { TimelineView }


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
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '50px', justifyContent: 'flex-start' }}>
        {contacts.map((contact, index) => (
          <motion.div
            whileHover={{ scale: 1.2 }}
          >
            <Card key={index} sx={{ width: 300, backgroundColor: '#282b30' }}>
              <CardContent>
                <Typography sx={{color:'#FFFFFF'}} gutterBottom variant="h5" component="div">
                  {contact.name || "Unknown Name"}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', color:'#FFFFFF'}}>
                  {contact.company || "Company not found."}
                </Typography>
              </CardContent>
              <CardActions>
                <Button sx={{color:'#5865F2'}} size="small">Email</Button>
                <Button sx={{color:'#5865F2'}} size="small">LinkedIn</Button>
              </CardActions>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
export { NetworkView }


// Insight page
function InsightView() {
  return (
    <p>hello</p>
  )
}
export { InsightView }


export default App;