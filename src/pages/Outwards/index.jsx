import { Box, Tab, Tabs } from '@material-ui/core';
import React from 'react';
import YarnOutward from './YarnOutward';
import TabPanel from '../../components/TabPanel';
import Warping from './Warping';

export default function Outwards({licexpired}) {
  const [tabvalue, setTabvalue] = React.useState(0);

  const tabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  return (
    <Box display="flex" flexDirection="column" height="100%" style={{minHeight: 0}}>
      <Box>
        <Tabs value={tabvalue} onChange={tabChange}>
          <Tab label="Warping Program" />
          <Tab label="Yarn Outward" />
        </Tabs>
      </Box>
      <TabPanel value={tabvalue} index={0}>
        <Warping licexpired={licexpired}/>
      </TabPanel>
      <TabPanel value={tabvalue} index={1}>
        <YarnOutward licexpired={licexpired}/>
      </TabPanel>
    </Box>
  )
}
