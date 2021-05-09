import React from 'react';
import { Box, Tab, Tabs, Typography } from "@material-ui/core";
import InwardReport from './InwardReport';
import TabPanel from '../TabPanel';
import OutwardReport from './OutwardReport';

export default function Reports() {

  const [tabvalue, setTabvalue] = React.useState(0);

  const tabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  return (
    <Box display="flex" flexDirection="column" height="100%" style={{minHeight: 0}}>
      <Box>
        <Tabs value={tabvalue} onChange={tabChange} aria-label="simple tabs example">
          <Tab label="Inward Report" />
          <Tab label="Outward Report" />
        </Tabs>
      </Box>
      <TabPanel value={tabvalue} index={0}>
        <InwardReport />
      </TabPanel>
      <TabPanel value={tabvalue} index={1}>
        <OutwardReport />
      </TabPanel>
    </Box>
  )
}