import * as React from "react"
import PropTypes from "prop-types"
import Box from "@mui/material/Box"
import Tab from "@mui/material/Tab"
import TabContext from "@mui/lab/TabContext"
import TabList from "@mui/lab/TabList"
import TabPanel from "@mui/lab/TabPanel"
import { ApplicationView, TimelineView, NetworkView, InsightView } from "../App"
import * as motion from "motion/react-client"

const NavTabs = ({ timelines, applications, contacts, roleInsights }) => {
  const [value, setValue] = React.useState("applications")

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            type: "spring",
            bounce: 0.5,
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={handleChange}
              aria-label="navigation bar"
              TabIndicatorProps={{
                sx: { backgroundColor: "#5865F2" },
              }}
            >
              <Tab
                label="Application"
                value="applications"
                sx={{ color: "white", "&.Mui-selected": { color: "white" } }}
              />
              <Tab
                label="Timeline"
                value="timelines"
                sx={{ color: "white", "&.Mui-selected": { color: "white" } }}
              />
              <Tab
                label="Network"
                value="contacts"
                sx={{ color: "white", "&.Mui-selected": { color: "white" } }}
              />
              <Tab
                label="Insight"
                value="roleInsights"
                sx={{ color: "white", "&.Mui-selected": { color: "white" } }}
              />
            </TabList>
          </Box>
        </motion.div>
        <TabPanel value="applications">
          <ApplicationView applications={applications} />
        </TabPanel>
        <TabPanel value="timelines">
          <TimelineView timelines={timelines} applications={applications} />
        </TabPanel>
        <TabPanel value="contacts">
          <NetworkView contacts={contacts} />
        </TabPanel>
        <TabPanel value="roleInsights">
          <InsightView roleInsights={roleInsights} />
        </TabPanel>
      </TabContext>
    </Box>
  )
}

NavTabs.propTypes = {
  timelines: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      application_id: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      notes: PropTypes.string,
    })
  ).isRequired,
  applications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      company: PropTypes.string.isRequired,
      position: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      priority: PropTypes.string.isRequired,
      matched_skills: PropTypes.arrayOf(PropTypes.string),
      required_skills: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
  contacts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      company: PropTypes.string.isRequired,
      linkedin: PropTypes.string.isRequired,
      email: PropTypes.string,
      phone: PropTypes.string,
    })
  ).isRequired,
  roleInsights: PropTypes.arrayOf(
    PropTypes.shape({
      role_title: PropTypes.string.isRequired,
      common_skills: PropTypes.arrayOf(PropTypes.string).isRequired,
      average_salary: PropTypes.string.isRequired,
      demand_trend: PropTypes.string.isRequired,
      top_companies: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ).isRequired,
}

export default NavTabs
