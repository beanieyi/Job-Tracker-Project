import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { ApplicationView, TimelineView, NetworkView, InsightView } from '../App';

export default function LabTabs() {
  const [value, setValue] = React.useState('applications');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="navigation bar">
            <Tab label="Application" value="applications" />
            <Tab label="Timeline" value="timelines" />
            <Tab label="Network" value="networks" />
            <Tab label="Insight" value="insights" />
          </TabList>
        </Box>

        <TabPanel value="applications">
          <ApplicationView />
        </TabPanel>

        <TabPanel value="timelines">
          <TimelineView/>
        </TabPanel>

        <TabPanel value="networks">
          <NetworkView/>
        </TabPanel>

        <TabPanel value="insights">
          <InsightView/>
        </TabPanel>

      </TabContext>
    </Box>
  );
}