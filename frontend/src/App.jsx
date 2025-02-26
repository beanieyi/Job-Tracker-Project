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
import { Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Typography from "@mui/material/Typography"

// motion.dev imports for animations
import * as motion from "motion/react-client"


// Application functionality
import { deleteApplication } from "./api/applications"
import { createApplication } from './api/applications'
import { updateApplication } from './api/applications'

// Contact functionality
import { createContact } from "./api/contacts"
import { deleteContact } from "./api/contacts"
import { updateContact } from "./api/contacts"

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
        credentials: "include",  // Ensure cookies are included
      });
  
      if (!response.ok) {
        throw new Error("Invalid Email or Password");
      }
  
      setIsAuthenticated(true); // User is authenticated after a successful login
    } catch (err) {
      console.error("Failed to Login:", err.message);
      throw err;
    }
  };
  

  // Log out
  const byebye = async () => {
    // localStorage.removeItem("access_token")
    const response = await fetch("http://localhost:8000/auth/logout", {
      method: "POST",
      credentials: "include"
    })
    const data = await response.json()
    console.log(data)
    setIsAuthenticated(false)
  }


  useEffect(() => {
    const fetchData = async () => {
      try {
        // // Token for specified user data
        // const bearerToken = localStorage.getItem("access_token")
        // const headers = bearerToken
        //   ? { Authorization: `Bearer ${bearerToken}` }
        //   : {}

        const [applicationsRes, timelinesRes, contactsRes, insightsRes] =
          await Promise.all([
            fetch("http://localhost:8000/api/applications", { method: "GET",credentials: "include" }),
            fetch("http://localhost:8000/api/timelines", { method: "GET",credentials: "include" }),
            fetch("http://localhost:8000/api/contacts", { method: "GET",credentials: "include" }),
            fetch("http://localhost:8000/api/role-insights", { method: "GET",credentials: "include" }),
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
        JOB TRACKER
        <Button variant="contained" sx={{ backgroundColor: "#5865F2" }} onClick={byebye}>Logout</Button>
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
function ApplicationView({ applications, setApplications }) {
  const [newApplication, setNewApplication] = useState({
    position: '',
    company: '',
    date: '',
    status: '',
    priority: '',
    matched_skills: [],
    required_skills: []
  });
  const [showForm, setShowForm] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);

  // Edit handle
  const handleEditClick = (app) => {
    setEditingApplication({ ...app }); 
    setShowForm(false);
  };

  // Input change for new application
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewApplication((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  // Edit input change
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingApplication((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle edit form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedApp = await updateApplication(editingApplication.id, editingApplication);
      setApplications((prevApplications) =>
        prevApplications.map((app) => (app.id === updatedApp.id ? updatedApp : app))
      );
      setEditingApplication(null);
    } catch (err) {
      console.error('Failed to update application:', err.message);
    }
  };

  // Delete App
  const handleDelete = async (appId) => {
    try {
      // Delete Call
      await deleteApplication(appId);    
      setApplications((prevApplications) =>
        prevApplications.filter((app) => app.id !== appId)
      );
    } catch (err) {
      console.error("Failed to delete application:", err.message);
    }
  };

  // Application Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call Application
      const createdApp = await createApplication(newApplication); 
      setApplications((prevApplications) => [...prevApplications, createdApp])
      setShowForm(false);
      setNewApplication({ position: '', company: '', date: '', status: '', priority:'' });
    } catch (err) {
      console.error('Failed to create application:', err.message);
    }
  };

  // Toggle Add App form visibility
  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div>
      {/* Add Application Button */}
      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <Button variant="contained" sx={{ backgroundColor: "#5865F2" }} onClick={toggleForm}>
          Add Application
        </Button>
      </div>

      {/* Add Application Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.6,
            delay: 0.3,
            ease: [0, 0.71, 0.2, 1.01],
          }}
          >
          <div
          style={{
            backgroundColor: 'white', 
            padding: '30px', 
            borderRadius: '8px',
            width: '100%', 
            maxWidth: '500px', 
            margin: '0 auto',
            marginBottom: '50px'
          }}>
            <form onSubmit={handleSubmit}>
              <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel htmlFor="priority">Priority</InputLabel>
                  <Select
                    label="Priority"
                    name="priority"
                    value={newApplication.priority}
                    onChange={handleInputChange}
                    inputProps={{ id: 'priority' }}
                  >
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                  </Select>
              </FormControl>
              <TextField
                label="Job Title"
                variant="outlined"
                fullWidth
                margin="normal"
                name="position"
                value={newApplication.position}
                onChange={handleInputChange}
              />
              <TextField
                label="Company"
                variant="outlined"
                fullWidth
                margin="normal"
                name="company"
                value={newApplication.company}
                onChange={handleInputChange}
              />
              <TextField
                variant="outlined"
                fullWidth
                margin="normal"
                name="date"
                value={newApplication.date}
                onChange={handleInputChange}
                type="date"
              />
              <TextField
                label="Status"
                variant="outlined"
                fullWidth
                margin="normal"
                name="status"
                value={newApplication.status}
                onChange={handleInputChange}
              />
            <div        
              style={{marginTop: '20px'}}
            >
              <Button 
                type="submit" 
                variant="contained" 
                sx={{ backgroundColor: "#5865F2" }}
                >
                  Submit
              </Button>
              <Button 
                variant="contained" 
                sx={{ backgroundColor: "#f44336", marginLeft: "10px" }} 
                onClick={() => setShowForm(false)}
                >
                  Cancel
              </Button>          
            </div>         
          </form>   
          </div>
        </motion.div>    
      )}

      {/* Edit Application Form */}
      {editingApplication && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.6,
            delay: 0.3,
            ease: [0, 0.71, 0.2, 1.01],
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "8px",
              width: "100%",
              maxWidth: "500px",
              margin: "0 auto",
              marginBottom: "50px",
            }}
          >
            <form onSubmit={handleEditSubmit}>
              <TextField
                label="Job Title"
                variant="outlined"
                fullWidth
                margin="normal"
                name="position"
                value={editingApplication.position}
                onChange={handleEditInputChange}
              />
              <TextField
                label="Company"
                variant="outlined"
                fullWidth
                margin="normal"
                name="company"
                value={editingApplication.company}
                onChange={handleEditInputChange}
              />
              <TextField
                variant="outlined"
                fullWidth
                margin="normal"
                name="date"
                value={editingApplication.date}
                onChange={handleEditInputChange}
                type="date"
              />
              <TextField
                label="Status"
                variant="outlined"
                fullWidth
                margin="normal"
                name="status"
                value={editingApplication.status}
                onChange={handleEditInputChange}
              />
              <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel htmlFor="priority">Priority</InputLabel>
                <Select
                  label="Priority"
                  name="priority"
                  value={editingApplication.priority}
                  onChange={handleEditInputChange}
                  inputProps={{ id: "priority" }}
                >
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </Select>
              </FormControl>
              <div style={{ marginTop: "20px" }}>
                <Button type="submit" variant="contained" sx={{ backgroundColor: "#5865F2" }}>
                  Save
                </Button>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#f44336", marginLeft: "10px" }}
                  onClick={() => setEditingApplication(null)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      )}

      {/* Applications Table */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.6,
          delay: 0.3,
          ease: [0, 0.71, 0.2, 1.01],
        }}
      >
      <TableContainer component={Paper} sx={{ backgroundColor: "#282b30" }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow sx={{ borderBottom: "2.5px solid #5865F2" }}>
              <TableCell sx={{ color: "white", fontSize: "1rem", fontWeight: "bold" }}>
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
              Priority
              </TableCell>
              <TableCell
                align="right"
                sx={{ color: "white", fontSize: "1rem", fontWeight: "bold" }}
              >
                Edit
              </TableCell>
              <TableCell
                align="right"
                sx={{ color: "white", fontSize: "1rem", fontWeight: "bold" }}
              >
                Delete
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
                <TableCell align="right" sx={{ color: "white" }}>
                  {app.priority}
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ backgroundColor: "#5865F2" }}
                    onClick={() => handleEditClick(app)}
                  >
                    Edit
                  </Button>
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ backgroundColor: "#800020" }}
                    onClick={() => {
                      console.log("Delete button clicked", app.id);
                      handleDelete(app.id);
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </motion.div>
    </div>
  );
}

// Timeline of applications page
function TimelineView() {
  return <p>Timeline View</p>
}

// Network Page
function NetworkView({ contacts, setContacts }) {
  const [newContact, setNewContact] = useState({ 
    name: "", 
    company: "", 
    role: "", 
    linkedin: "", 
    email: "" 
  });
  const [showForm, setShowForm] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  // Input change for new/edit application
  const handleInputChange = (e) => {
    if (showEditForm) {
      setSelectedContact({ ...selectedContact, [e.target.name]: e.target.value });
    } else {
      setNewContact({ ...newContact, [e.target.name]: e.target.value });
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newContact.name.trim() || !newContact.company.trim()) return;

    try {
      const createdContact = await createContact(newContact);
      setContacts((prevContacts) => [...prevContacts, createdContact]);
      setShowForm(false);
      setNewContact({ name: "", company: "", role: "", linkedin: "", email: "" });
    } catch (error) {
      console.error("Failed to add contact:", error);
    }
  };

  // Delete Contact
  const handleDelete = async (contactId) => {
    try {
      // Delete Call
      await deleteContact(contactId);
      
      setContacts((prevContacts) =>
        prevContacts.filter((contact) => contact.id !== contactId)
      );
    } catch (err) {
      console.error("Failed to delete contact:", err.message);
    }
  };

  // Handle edit button click
  const handleEditClick = (contact) => {
    setSelectedContact(contact);
    setShowEditForm(true);
  };

  // Handle updating contact
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
  
    if (!selectedContact.name.trim() || !selectedContact.company.trim()) return;
  
    try {
      const updatedContact = await updateContact(selectedContact.id, selectedContact);
  
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact.id === selectedContact.id ? updatedContact : contact
        )
      );
  
      setShowEditForm(false);
      setSelectedContact(null);
    } catch (error) {
      console.error("Failed to update contact:", error);
    }
  };

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
      
      {/* Add Contact Button */}
      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <Button 
          variant="contained" 
          sx={{ backgroundColor: "#5865F2" }} 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Add Contact"}
        </Button>
      </div>

      {/* Contact Form */}
      {showForm && (
        <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.6,
          delay: 0.3,
          ease: [0, 0.71, 0.2, 1.01],
        }}
        >
        <div
        style={{
          backgroundColor: 'white', 
          padding: '30px', 
          borderRadius: '8px',
          width: '100%', 
          maxWidth: '500px', 
          margin: '0 auto',
          marginBottom: '50px'
        }}>
        <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
          <TextField
            label="Name"
            name="name"
            value={newContact.name}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
            required
          />
          <TextField
            label="Company"
            name="company"
            value={newContact.company}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
            required
          />
          <TextField
            label="Role"
            name="role"
            value={newContact.role}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
            required
          />
          <TextField
            label="LinkedIn"
            name="linkedin"
            value={newContact.linkedin}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
            required
          />
          <TextField
            label="Email"
            name="email"
            value={newContact.email}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
            required
          />
          <Button type="submit" variant="contained" sx={{ backgroundColor: "#5865F2", marginTop: "10px" }}>
            Submit
          </Button>
        </form>
        </div>
        </motion.div>
      )}

      {/* Edit Contact Form */}
      {showEditForm && selectedContact && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0, 0.71, 0.2, 1.01] }}
        >
          <div
            style={{
              backgroundColor: 'white', 
              padding: '30px', 
              borderRadius: '8px',
              width: '100%', 
              maxWidth: '500px', 
              margin: '0 auto',
              marginBottom: '50px'
            }}
          >
            <form onSubmit={handleUpdateSubmit} style={{ marginBottom: "20px" }}>
              <TextField 
                label="Name" 
                name="name" 
                value={selectedContact.name} 
                onChange={handleInputChange} 
                fullWidth margin="dense" 
                required 
                />
              <TextField 
                label="Company" 
                name="company" 
                value={selectedContact.company} 
                onChange={handleInputChange} 
                fullWidth margin="dense" 
                required 
                />
              <TextField 
                label="Role" 
                name="role" 
                value={selectedContact.role} 
                onChange={handleInputChange} 
                fullWidth margin="dense" 
                required 
                />
              <TextField 
                label="LinkedIn" 
                name="linkedin" 
                value={selectedContact.linkedin} 
                onChange={handleInputChange} 
                fullWidth margin="dense" 
                required 
                />
              <TextField 
                label="Email" 
                name="email" 
                value={selectedContact.email} 
                onChange={handleInputChange} 
                fullWidth margin="dense" 
                required 
                />
              <Button 
                type="submit" 
                variant="contained" 
                sx={{ backgroundColor: "#5865F2", marginTop: "10px" }}
                >
                  Save Changes
              </Button>
              <Button 
                onClick={() => setShowEditForm(false)} 
                variant="contained" 
                sx={{ backgroundColor: "#800020", marginTop: "10px", marginLeft: "10px" }}
                >
                  Cancel
              </Button>
            </form>
          </div>
        </motion.div>
      )}

      {/* Contact Cards */}
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
                <Typography variant="body2" sx={{ color: "#FFFFFF" }}>
                  {contact.role || "Rolenot found."}
                </Typography>
              </CardContent>
              <CardActions>
                <Button sx={{ color: "#5865F2" }} size="small">
                  Email
                </Button>
                <Button sx={{ color: "#5865F2" }} size="small">
                  LinkedIn
                </Button>
                <Button 
                  variant="contained" sx={{     
                    backgroundColor: "#5865F2", 
                    fontSize: "0.65rem",
                    padding: "2px 7px",
                    minWidth: "auto"
                  }} 
                  size="small"
                  onClick={() => handleEditClick(contact)}
                >
                  Edit
                </Button>
                <Button 
                  variant="contained" sx={{     
                    backgroundColor: "#800020", 
                    fontSize: "0.65rem",
                    padding: "2px 7px",
                    minWidth: "auto"
                  }} 
                  size="small"
                  onClick={() => {
                    console.log("Delete button clicked", contact.id);
                    handleDelete(contact.id);
                  }}
                >
                  Delete
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
  setApplications: PropTypes.func,
}

NetworkView.propTypes = {
  contacts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      company: PropTypes.string,
    })
  ),
  setContacts: PropTypes.func,
}

export { ApplicationView, TimelineView, NetworkView, InsightView }
export default App
