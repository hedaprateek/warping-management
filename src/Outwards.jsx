import { Box, Tab, Tabs } from '@material-ui/core';
import React from 'react';
import TabPanel from './TabPanel';
import Warping from './Warping';

export default function Outwards() {
  const [tabvalue, setTabvalue] = React.useState(0);

  const tabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  return (
    <Box display="flex" flexDirection="column" height="100%" style={{minHeight: 0}}>
      <Box>
        <Tabs value={tabvalue} onChange={tabChange}>
          <Tab label="Warping" />
          <Tab label="Gatepass" />
        </Tabs>
      </Box>
      <TabPanel value={tabvalue} index={0}>
        <Warping />
      </TabPanel>
      <TabPanel value={tabvalue} index={1}>
        Coming soon
      </TabPanel>
    </Box>
  )
}
