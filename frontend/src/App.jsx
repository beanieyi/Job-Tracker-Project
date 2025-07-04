import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./App.css";
import NavTabs from "./components/NavTabs";

// MUI SignIn & SignUp Component
import SlotsSignIn from "./components/SignIn";
import SignUpForm from "./components/SignUp";

// MUI Imports (AppView Table)
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

// MUI Imports (NetworkView Cards)
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Autocomplete,
  Chip,
  Modal,
  Box,
} from "@mui/material";
import Typography from "@mui/material/Typography";

// motion.dev imports for animations
import * as motion from "motion/react-client";

// Application functionality
import {
  deleteApplication,
  createApplication,
  updateApplication,
  getApplicationTimeline,
  addTimelineEntry,
} from "./api/applications";

// Contact functionality
import { createContact } from "./api/contacts";
import { deleteContact } from "./api/contacts";
import { updateContact } from "./api/contacts";

import ApplicationSankeyDiagram from "./components/SankeyDiagram";

import { register } from "./api/auth";

// Main App function
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500, // Increased width
  maxHeight: "80vh",
  overflow: "auto", // Add scrolling for long content
  bgcolor: "#282b30",
  border: "2px solid #5865F2",
  boxShadow: 24,
  p: 4,
  color: "white",
  borderRadius: "8px",
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [applications, setApplications] = useState([]);
  const [timelines, setTimelines] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        credentials: "include", // Ensure cookies are included
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
      credentials: "include",
    });
    const data = await response.json();
    console.log(data);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // // Token for specified user data
        // const bearerToken = localStorage.getItem("access_token")
        // const headers = bearerToken
        //   ? { Authorization: `Bearer ${bearerToken}` }
        //   : {}

        const [applicationsRes, timelinesRes, contactsRes] = await Promise.all([
          fetch("http://localhost:8000/api/applications", {
            method: "GET",
            credentials: "include",
          }),
          fetch("http://localhost:8000/api/timelines", {
            method: "GET",
            credentials: "include",
          }),
          fetch("http://localhost:8000/api/contacts", {
            method: "GET",
            credentials: "include",
          }),
        ]);

        if (!applicationsRes.ok)
          throw new Error(
            `Applications fetch failed: ${applicationsRes.status}`,
          );
        if (!timelinesRes.ok)
          throw new Error(`Timelines fetch failed: ${timelinesRes.status}`);
        if (!contactsRes.ok)
          throw new Error(`Contacts fetch failed: ${contactsRes.status}`);

        const [applicationsData, timelinesData, contactsData] =
          await Promise.all([
            applicationsRes.json(),
            timelinesRes.json(),
            contactsRes.json(),
          ]);

        setApplications(applicationsData);
        setTimelines(timelinesData);
        setContacts(contactsData);

        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return showSignUp ? (
      <SignUpForm register={register} setShowSignUp={setShowSignUp} />
    ) : (
      <SlotsSignIn signIn={signIn} setShowSignUp={setShowSignUp} />
    );
  }

  if (loading) return <div className="p-4">Loading data...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap');
        `}
      </style>

      <h1 className="header">
        JOB TRACKER
        <Button
          variant="contained"
          sx={{ backgroundColor: "#5865F2" }}
          onClick={byebye}
        >
          Logout
        </Button>
      </h1>
      <nav>
        <NavTabs
          timelines={timelines}
          applications={applications}
          contacts={contacts}
          setApplications={setApplications}
          setContacts={setContacts}
          setTimelines={setTimelines}
        />
      </nav>
    </div>
  );
}

// Applications page
function ApplicationView({ applications, setApplications, setTimelines }) {
  const skillOptions = [
    "JavaScript",
    "React",
    "Node.js",
    "Python",
    "Java",
    "CSS",
    "HTML",
    "TypeScript",
    "SQL",
    "MongoDB",
    "Express",
    "AWS",
    "Docker",
    "Git",
    "Redux",
    "REST API",
    "GraphQL",
    "Agile",
    "Testing",
    "CI/CD",
  ];
  const [newApplication, setNewApplication] = useState({
    position: "",
    company: "",
    date: "",
    status: "",
    priority: "",
    matched_skills: [],
    required_skills: [],
  });
  // const [showForm, setShowForm] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedAppDetails, setSelectedAppDetails] = useState(null);
  const [timelineData, setTimelineData] = useState([]);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const handleOpenDetails = async (app) => {
    setSelectedAppDetails(app);
    setOpenModal(true);
    setTimelineLoading(true);

    try {
      const timeline = await getApplicationTimeline(app.id);
      setTimelineData(timeline);
    } catch (err) {
      console.error("Failed to fetch timeline:", err.message);
      setTimelineData([]);
    } finally {
      setTimelineLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Edit handle
  const handleEditClick = (event, app) => {
    event.stopPropagation();
    setEditingApplication({ ...app });
    setOpenEditModal(true);
  };

  // Input change for new application
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewApplication((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Edit input change
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingApplication((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle edit form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check if status has changed
      const originalApp = applications.find(
        (app) => app.id === editingApplication.id,
      );
      const statusChanged = originalApp.status !== editingApplication.status;

      // Update the application
      const updatedApp = await updateApplication(
        editingApplication.id,
        editingApplication,
      );

      // If status changed, create a timeline entry
      if (statusChanged) {
        // Create a new timeline entry
        const newTimelineData = {
          application_id: updatedApp.id,
          status: updatedApp.status,
          date: new Date().toISOString(),
          notes: `Status changed to ${updatedApp.status}`,
        };

        const newTimeline = await addTimelineEntry(
          updatedApp.id,
          newTimelineData,
        );

        // Update timelines state with the new entry
        setTimelines((prevTimelines) => [...prevTimelines, newTimeline]);
      }

      setApplications((prevApplications) =>
        prevApplications.map((app) =>
          app.id === updatedApp.id ? updatedApp : app,
        ),
      );
      setOpenEditModal(false); // Close the modal
      setEditingApplication(null);
    } catch (err) {
      console.error("Failed to update application:", err.message);
    }
  };

  // Delete App
  const handleDelete = async (event, appId) => {
    event.stopPropagation();
    try {
      // Delete Call
      await deleteApplication(appId);
      setApplications((prevApplications) =>
        prevApplications.filter((app) => app.id !== appId),
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

      const appTimeline = await getApplicationTimeline(createdApp.id);

      // Update states
      setApplications((prevApplications) => [...prevApplications, createdApp]);
      setTimelines((prevTimelines) => [...prevTimelines, ...appTimeline]);
      setOpenCreateModal(false);
      setNewApplication({
        position: "",
        company: "",
        date: "",
        status: "",
        priority: "",
        required_skills: [],
      });
    } catch (err) {
      console.error("Failed to create application:", err.message);
    }
  };

  return (
    <div>
      {/* Add Application Button */}
      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#5865F2" }}
          onClick={() => setOpenCreateModal(true)}
        >
          Add Application
        </Button>
      </div>

      {/* Add Application Form */}

      <Modal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        aria-labelledby="create-application-modal"
      >
        <Box sx={modalStyle}>
          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 3, color: "#5865F2", fontWeight: "bold" }}
          >
            Add New Application
          </Typography>
          <form onSubmit={handleSubmit}>
            <FormControl variant="outlined" fullWidth margin="normal">
              <InputLabel htmlFor="priority" style={{ color: "white" }}>
                Priority
              </InputLabel>
              <Select
                label="Priority"
                name="priority"
                required
                value={newApplication.priority}
                onChange={handleInputChange}
                slotProps={{
                  input: {
                    id: "priority",
                    style: { color: "white" },
                  },
                }}
                sx={{
                  color: "white",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#5865F2",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "white",
                  },
                }}
                inputProps={{ id: "priority" }}
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
              required
              margin="normal"
              name="position"
              slotProps={{
                inputLabel: {
                  style: { color: "white" },
                },
                input: {
                  style: { color: "white" },
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#5865F2",
                  },
                },
              }}
              value={newApplication.position}
              onChange={handleInputChange}
            />
            <TextField
              label="Company"
              variant="outlined"
              fullWidth
              required
              margin="normal"
              name="company"
              slotProps={{
                inputLabel: {
                  style: { color: "white" },
                },
                input: {
                  style: { color: "white" },
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#5865F2",
                  },
                },
              }}
              value={newApplication.company}
              onChange={handleInputChange}
            />
            <TextField
              variant="outlined"
              fullWidth
              required
              margin="normal"
              name="date"
              slotProps={{
                inputLabel: {
                  style: { color: "white" },
                },
                input: {
                  style: { color: "white" },
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#5865F2",
                  },
                },
              }}
              value={newApplication.date}
              onChange={handleInputChange}
              type="date"
            />
            <TextField
              label="Status"
              variant="outlined"
              fullWidth
              required
              margin="normal"
              name="status"
              slotProps={{
                inputLabel: {
                  style: { color: "white" },
                },
                input: {
                  style: { color: "white" },
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#5865F2",
                  },
                },
              }}
              value={newApplication.status}
              onChange={handleInputChange}
            />
            <Autocomplete
              multiple
              id="required-skills"
              options={skillOptions}
              freeSolo
              slotProps={{
                inputLabel: {
                  style: { color: "white" },
                },
                input: {
                  style: { color: "white" },
                },
              }}
              sx={{
                color: "white",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#5865F2",
                  },
                },
              }}
              value={newApplication.required_skills || []}
              onChange={(event, newValue) => {
                setNewApplication({
                  ...newApplication,
                  required_skills: newValue,
                });
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    key={index}
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                    sx={{ backgroundColor: "#5865F2", color: "white" }}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Required Skills"
                  placeholder="Add skills"
                  fullWidth
                  margin="normal"
                  slotProps={{
                    inputLabel: {
                      style: { color: "white" },
                    },
                  }}
                  sx={{
                    color: "white",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.5)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#5865F2",
                      },
                    },
                  }}
                />
              )}
            />
            <div style={{ marginTop: "20px" }}>
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
                onClick={() => setOpenCreateModal(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Box>
      </Modal>

      {/* Edit Application Form */}
      <Modal
        open={openEditModal && editingApplication !== null}
        onClose={() => setOpenEditModal(false)}
        aria-labelledby="edit-application-modal"
      >
        <Box sx={modalStyle}>
          {editingApplication && (
            <>
              <Typography
                variant="h6"
                component="h2"
                sx={{ mb: 3, color: "#5865F2", fontWeight: "bold" }}
              >
                Edit Application
              </Typography>
              <form onSubmit={handleEditSubmit}>
                <TextField
                  slotProps={{
                    inputLabel: {
                      style: { color: "white" },
                    },
                    input: {
                      style: { color: "white" },
                    },
                  }}
                  sx={{
                    color: "white",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.5)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#5865F2",
                      },
                    },
                  }}
                  label="Job Title"
                  variant="outlined"
                  fullWidth
                  required
                  margin="normal"
                  name="position"
                  value={editingApplication.position}
                  onChange={handleEditInputChange}
                />
                <TextField
                  label="Company"
                  variant="outlined"
                  fullWidth
                  required
                  margin="normal"
                  name="company"
                  slotProps={{
                    inputLabel: {
                      style: { color: "white" },
                    },
                    input: {
                      style: { color: "white" },
                    },
                  }}
                  sx={{
                    color: "white",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.5)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#5865F2",
                      },
                    },
                  }}
                  value={editingApplication.company}
                  onChange={handleEditInputChange}
                />
                <TextField
                  variant="outlined"
                  fullWidth
                  required
                  margin="normal"
                  name="date"
                  slotProps={{
                    inputLabel: {
                      style: { color: "white" },
                    },
                    input: {
                      style: { color: "white" },
                    },
                  }}
                  sx={{
                    color: "white",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.5)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#5865F2",
                      },
                    },
                  }}
                  value={editingApplication.date}
                  onChange={handleEditInputChange}
                  type="date"
                />
                <TextField
                  label="Status"
                  variant="outlined"
                  fullWidth
                  required
                  margin="normal"
                  name="status"
                  slotProps={{
                    inputLabel: {
                      style: { color: "white" },
                    },
                    input: {
                      style: { color: "white" },
                    },
                  }}
                  sx={{
                    color: "white",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.5)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#5865F2",
                      },
                    },
                  }}
                  value={editingApplication.status}
                  onChange={handleEditInputChange}
                />
                <FormControl variant="outlined" fullWidth margin="normal">
                  <InputLabel htmlFor="priority" style={{ color: "white" }}>
                    Priority
                  </InputLabel>
                  <Select
                    label="Priority"
                    name="priority"
                    required
                    value={editingApplication.priority}
                    slotProps={{
                      input: {
                        id: "priority",
                        style: { color: "white" },
                      },
                    }}
                    sx={{
                      color: "white",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255, 255, 255, 0.5)",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#5865F2",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "white",
                      },
                    }}
                    onChange={handleEditInputChange}
                    inputProps={{ id: "priority" }}
                  >
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                  </Select>
                </FormControl>
                <Autocomplete
                  multiple
                  id="edit-required-skills"
                  options={skillOptions}
                  freeSolo
                  value={editingApplication.required_skills || []}
                  onChange={(event, newValue) => {
                    setEditingApplication({
                      ...editingApplication,
                      required_skills: newValue,
                    });
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        key={index}
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                        sx={{ backgroundColor: "#5865F2", color: "white" }}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Required Skills"
                      placeholder="Add skills"
                      fullWidth
                      margin="normal"
                      slotProps={{
                        inputLabel: {
                          style: { color: "white" },
                        },
                      }}
                      sx={{
                        color: "white",
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.3)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.5)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#5865F2",
                          },
                        },
                      }}
                    />
                  )}
                />
                <div style={{ marginTop: "20px" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ backgroundColor: "#5865F2" }}
                  >
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
            </>
          )}
        </Box>
      </Modal>

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
                  onClick={() => handleOpenDetails(app)}
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
                      onClick={(event) => handleEditClick(event, app)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ backgroundColor: "#800020" }}
                      onClick={(event) => {
                        console.log("Delete button clicked", app.id);
                        handleDelete(event, app.id);
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
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="application-details-modal"
          aria-describedby="application-details-description"
        >
          <Box sx={modalStyle}>
            {selectedAppDetails && (
              <>
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{ mb: 2, color: "#5865F2", fontWeight: "bold" }}
                >
                  {selectedAppDetails.position} at {selectedAppDetails.company}
                </Typography>

                <Typography sx={{ mt: 2 }}>
                  <strong>Date Applied:</strong> {selectedAppDetails.date}
                </Typography>

                <Typography sx={{ mt: 1 }}>
                  <strong>Current Status:</strong> {selectedAppDetails.status}
                </Typography>

                <Typography sx={{ mt: 1 }}>
                  <strong>Priority:</strong> {selectedAppDetails.priority}
                </Typography>

                {/* Skills Section */}
                <Typography sx={{ mt: 2, mb: 1 }}>
                  <strong>Required Skills:</strong>
                </Typography>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selectedAppDetails.required_skills &&
                  selectedAppDetails.required_skills.length > 0 ? (
                    selectedAppDetails.required_skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        variant="outlined"
                        sx={{ bgcolor: "#5865F2", color: "white", mb: 1 }}
                      />
                    ))
                  ) : (
                    <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                      No skills listed
                    </Typography>
                  )}
                </Box>

                {/* Timeline Section */}
                <Typography sx={{ mt: 3, mb: 1 }}>
                  <strong>Status Timeline:</strong>
                </Typography>

                {timelineLoading ? (
                  <Typography>Loading timeline...</Typography>
                ) : timelineData.length > 0 ? (
                  <Box sx={{ ml: 2 }}>
                    {timelineData
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((entry, index) => (
                        <Box
                          key={index}
                          sx={{
                            position: "relative",
                            ml: 4,
                            pb: 3,
                            "&:before": {
                              content: '""',
                              position: "absolute",
                              left: "-10px",
                              top: "8px",
                              height: "12px",
                              width: "12px",
                              borderRadius: "50%",
                              backgroundColor: "#5865F2",
                            },
                            "&:after": {
                              content:
                                index < timelineData.length - 1 ? '""' : "none",
                              position: "absolute",
                              left: "-5px",
                              top: "20px",
                              bottom: "-10px",
                              width: "2px",
                              backgroundColor: "#5865F2",
                            },
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            sx={{
                              color: "#5865F2",
                              fontWeight: "bold",
                              paddingLeft: "5px",
                            }}
                          >
                            {entry.status}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: "#aaa", paddingLeft: "5px" }}
                          >
                            {new Date(entry.date).toLocaleDateString()}
                          </Typography>
                        </Box>
                      ))}
                  </Box>
                ) : (
                  <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                    No status changes recorded
                  </Typography>
                )}

                <Box
                  sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}
                >
                  <Button
                    onClick={handleCloseModal}
                    variant="contained"
                    sx={{ backgroundColor: "#5865F2" }}
                  >
                    Close
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Modal>
      </motion.div>
    </div>
  );
}

// Timeline of applications page
function TimelineView({ applications, timelines }) {
  const [timelineData, setTimelineData] = useState([]);

  useEffect(() => {
    // Process and organize timeline data by date
    try {
      if (
        timelines &&
        applications &&
        Array.isArray(timelines) &&
        Array.isArray(applications)
      ) {
        // Create a lookup of application IDs to their details
        const appLookup = applications.reduce((acc, app) => {
          if (app && app.id) {
            acc[app.id] = app;
          }
          return acc;
        }, {});

        // Enrich timeline data with application details
        const enhancedTimelines = timelines
          .filter((entry) => entry && entry.application_id) // Filter out invalid entries
          .map((entry) => ({
            ...entry,
            applicationDetails: appLookup[entry.application_id] || {
              position: "Unknown Position",
              company: "Unknown Company",
            },
          }));

        // Sort by date (newest first)
        const sorted = [...enhancedTimelines].sort((a, b) => {
          const dateA = a.date ? new Date(a.date) : new Date(0);
          const dateB = b.date ? new Date(b.date) : new Date(0);
          return dateB - dateA;
        });

        setTimelineData(sorted);
      } else {
        setTimelineData([]);
      }
    } catch (error) {
      console.error("Error processing timeline data:", error);
      setTimelineData([]);
    }
  }, [timelines, applications]);

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
      <h2
        className="timeline-header"
        style={{
          color: "white",
          marginBottom: "30px",
          fontSize: "1.8rem",
          fontWeight: "bold",
        }}
      >
        Application Timeline & Status Flow
      </h2>

      {/* Sankey Diagram */}
      <ApplicationSankeyDiagram
        applications={applications}
        timelines={timelines}
      />

      {/* Timeline List */}
      <Paper
        sx={{
          backgroundColor: "#282b30",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <Typography
          variant="h6"
          component="h2"
          sx={{
            color: "white",
            fontSize: "1.2rem",
            fontWeight: "bold",
            borderBottom: "2.5px solid #5865F2",
            paddingBottom: "10px",
            marginBottom: "20px",
          }}
        >
          Recent Status Changes
        </Typography>

        {timelineData.length > 0 ? (
          <div style={{ maxHeight: "500px", overflow: "auto" }}>
            {timelineData.map((entry, index) => {
              if (!entry || !entry.applicationDetails) {
                return null;
              }

              const position =
                entry.applicationDetails.position || "Unknown Position";
              const company =
                entry.applicationDetails.company || "Unknown Company";
              const status = entry.status || "Status Update";
              const dateString = entry.date
                ? new Date(entry.date).toLocaleDateString()
                : "Unknown Date";

              return (
                <div
                  key={entry.id || index}
                  style={{
                    padding: "15px",
                    marginBottom: "15px",
                    borderLeft: "4px solid #5865F2",
                    backgroundColor: "#36393f",
                    borderRadius: "0 4px 4px 0",
                    position: "relative",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "#5865F2", fontWeight: "bold" }}
                  >
                    {position} at {company}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "white", marginTop: "5px" }}
                  >
                    Status changed to:{" "}
                    <span style={{ fontWeight: "bold" }}>{status}</span>
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#aaa",
                      position: "absolute",
                      top: "15px",
                      right: "15px",
                    }}
                  >
                    {dateString}
                  </Typography>
                  {/* {entry.notes && (
                    <Typography 
                      variant="body2" 
                      sx={{ color: "#ddd", marginTop: "8px", fontStyle: "italic" }}
                    >
                      {entry.notes}
                    </Typography>
                  )} */}
                </div>
              );
            })}
          </div>
        ) : (
          <Typography
            variant="body1"
            sx={{ color: "white", textAlign: "center", padding: "30px 0" }}
          >
            No timeline data available. Start applying to jobs to build your
            timeline!
          </Typography>
        )}
      </Paper>
    </motion.div>
  );
}

// Network Page
function NetworkView({ contacts, setContacts }) {
  const [newContact, setNewContact] = useState({
    name: "",
    company: "",
    role: "",
    linkedin: "",
    email: "",
  });

  const [selectedContact, setSelectedContact] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  // Input change for new/edit application
  const handleInputChange = (e) => {
    if (openEditModal) {
      setSelectedContact({
        ...selectedContact,
        [e.target.name]: e.target.value,
      });
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
      setOpenCreateModal(false);
      setNewContact({
        name: "",
        company: "",
        role: "",
        linkedin: "",
        email: "",
      });
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
        prevContacts.filter((contact) => contact.id !== contactId),
      );
    } catch (err) {
      console.error("Failed to delete contact:", err.message);
    }
  };

  // Handle edit button click
  const handleEditClick = (contact) => {
    setSelectedContact(contact);
    setOpenEditModal(true);
  };

  // Handle updating contact
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (!selectedContact.name.trim() || !selectedContact.company.trim()) return;

    try {
      const updatedContact = await updateContact(
        selectedContact.id,
        selectedContact,
      );

      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact.id === selectedContact.id ? updatedContact : contact,
        ),
      );

      setOpenEditModal(false);
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
          onClick={() => setOpenCreateModal(true)}
        >
          Add Contact
        </Button>
      </div>

      {/* Contact Form */}
      <Modal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        aria-labelledby="create-contact-modal"
      >
        <Box sx={modalStyle}>
          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 3, color: "#5865F2", fontWeight: "bold" }}
          >
            Add New Contact
          </Typography>
          <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
            <TextField
              label="Name"
              name="name"
              value={newContact.name}
              onChange={handleInputChange}
              fullWidth
              margin="dense"
              required
              slotProps={{
                inputLabel: {
                  style: { color: "white" },
                },
                input: {
                  style: { color: "white" },
                },
              }}
              sx={{
                color: "white",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#5865F2",
                  },
                },
              }}
            />
            <TextField
              label="Company"
              name="company"
              value={newContact.company}
              onChange={handleInputChange}
              fullWidth
              margin="dense"
              required
              slotProps={{
                inputLabel: {
                  style: { color: "white" },
                },
                input: {
                  style: { color: "white" },
                },
              }}
              sx={{
                color: "white",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#5865F2",
                  },
                },
              }}
            />
            <TextField
              label="Role"
              name="role"
              value={newContact.role}
              onChange={handleInputChange}
              fullWidth
              margin="dense"
              required
              slotProps={{
                inputLabel: {
                  style: { color: "white" },
                },
                input: {
                  style: { color: "white" },
                },
              }}
              sx={{
                color: "white",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#5865F2",
                  },
                },
              }}
            />
            <TextField
              label="LinkedIn"
              name="linkedin"
              value={newContact.linkedin}
              onChange={handleInputChange}
              fullWidth
              margin="dense"
              required
              slotProps={{
                inputLabel: {
                  style: { color: "white" },
                },
                input: {
                  style: { color: "white" },
                },
              }}
              sx={{
                color: "white",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#5865F2",
                  },
                },
              }}
            />
            <TextField
              label="Email"
              name="email"
              value={newContact.email}
              onChange={handleInputChange}
              fullWidth
              margin="dense"
              required
              slotProps={{
                inputLabel: {
                  style: { color: "white" },
                },
                input: {
                  style: { color: "white" },
                },
              }}
              sx={{
                color: "white",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#5865F2",
                  },
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ backgroundColor: "#5865F2", marginTop: "10px" }}
            >
              Submit
            </Button>
            <Button
              onClick={() => {
                setOpenCreateModal(false);
              }}
              variant="contained"
              sx={{
                backgroundColor: "#800020",
                marginTop: "10px",
                marginLeft: "10px",
              }}
            >
              Cancel
            </Button>
          </form>
        </Box>
      </Modal>

      {/* Edit Contact Form */}
      <Modal
        open={openEditModal && selectedContact !== null}
        onClose={() => {
          setOpenEditModal(false);
          setSelectedContact(null);
        }}
        aria-labelledby="edit-contact-modal"
      >
        <Box sx={modalStyle}>
          {selectedContact && (
            <>
              <Typography
                variant="h6"
                component="h2"
                sx={{ mb: 3, color: "#5865F2", fontWeight: "bold" }}
              >
                Edit Contact
              </Typography>

              <form
                onSubmit={handleUpdateSubmit}
                style={{ marginBottom: "20px" }}
              >
                <TextField
                  label="Name"
                  name="name"
                  value={selectedContact.name}
                  onChange={handleInputChange}
                  fullWidth
                  margin="dense"
                  required
                  slotProps={{
                    inputLabel: {
                      style: { color: "white" },
                    },
                    input: {
                      style: { color: "white" },
                    },
                  }}
                  sx={{
                    color: "white",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.5)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#5865F2",
                      },
                    },
                  }}
                />
                <TextField
                  label="Company"
                  name="company"
                  value={selectedContact.company}
                  onChange={handleInputChange}
                  fullWidth
                  margin="dense"
                  required
                  slotProps={{
                    inputLabel: {
                      style: { color: "white" },
                    },
                    input: {
                      style: { color: "white" },
                    },
                  }}
                  sx={{
                    color: "white",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.5)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#5865F2",
                      },
                    },
                  }}
                />
                <TextField
                  label="Role"
                  name="role"
                  value={selectedContact.role}
                  onChange={handleInputChange}
                  fullWidth
                  margin="dense"
                  required
                  slotProps={{
                    inputLabel: {
                      style: { color: "white" },
                    },
                    input: {
                      style: { color: "white" },
                    },
                  }}
                  sx={{
                    color: "white",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.5)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#5865F2",
                      },
                    },
                  }}
                />
                <TextField
                  label="LinkedIn"
                  name="linkedin"
                  value={selectedContact.linkedin}
                  onChange={handleInputChange}
                  fullWidth
                  margin="dense"
                  required
                  slotProps={{
                    inputLabel: {
                      style: { color: "white" },
                    },
                    input: {
                      style: { color: "white" },
                    },
                  }}
                  sx={{
                    color: "white",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.5)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#5865F2",
                      },
                    },
                  }}
                />
                <TextField
                  label="Email"
                  name="email"
                  value={selectedContact.email}
                  onChange={handleInputChange}
                  fullWidth
                  margin="dense"
                  required
                  slotProps={{
                    inputLabel: {
                      style: { color: "white" },
                    },
                    input: {
                      style: { color: "white" },
                    },
                  }}
                  sx={{
                    color: "white",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.5)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#5865F2",
                      },
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ backgroundColor: "#5865F2", marginTop: "10px" }}
                >
                  Save Changes
                </Button>
                <Button
                  onClick={() => {
                    setOpenEditModal(false);
                    setSelectedContact(null);
                  }}
                  variant="contained"
                  sx={{
                    backgroundColor: "#800020",
                    marginTop: "10px",
                    marginLeft: "10px",
                  }}
                >
                  Cancel
                </Button>
              </form>
            </>
          )}
        </Box>
      </Modal>

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
                  variant="contained"
                  sx={{
                    backgroundColor: "#5865F2",
                    fontSize: "0.65rem",
                    padding: "2px 7px",
                    minWidth: "auto",
                  }}
                  size="small"
                  onClick={() => handleEditClick(contact)}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#800020",
                    fontSize: "0.65rem",
                    padding: "2px 7px",
                    minWidth: "auto",
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
  );
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
    }),
  ),
  setApplications: PropTypes.func,
  setTimelines: PropTypes.func,
};
TimelineView.propTypes = {
  timelines: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      application_id: PropTypes.number,
      status: PropTypes.string,
      date: PropTypes.string,
      notes: PropTypes.string,
    }),
  ),
  applications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      company: PropTypes.string,
      position: PropTypes.string,
      status: PropTypes.string,
      date: PropTypes.string,
      priority: PropTypes.string,
    }),
  ),
};
NetworkView.propTypes = {
  contacts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      company: PropTypes.string,
    }),
  ),
  setContacts: PropTypes.func,
};

export { ApplicationView, TimelineView, NetworkView };
export default App;
