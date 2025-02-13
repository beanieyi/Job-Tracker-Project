import * as React from "react"
import PropTypes from "prop-types"
import Box from "@mui/material/Box"
import Tab from "@mui/material/Tab"
import TabContext from "@mui/lab/TabContext"
import TabList from "@mui/lab/TabList"
import TabPanel from "@mui/lab/TabPanel"
import { ApplicationView, TimelineView, NetworkView, InsightView } from "../App"

// motion.dev imports for animations
import * as motion from "motion/react-client"

export default function LabTabs({
  timelines,
  applications,
  contacts,
  roleInsights,
}) {
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
              TabIndicatorProps={{ sx: { backgroundColor: "#5865F2" } }}
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

LabTabs.propTypes = {
  timelines: PropTypes.array,
  applications: PropTypes.array,
  contacts: PropTypes.array,
  roleInsights: PropTypes.array,
}
