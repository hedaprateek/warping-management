import React from 'react';
import { Box, Tab, Tabs, Typography } from "@material-ui/core";
import InwardReport from './InwardReport';


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{flexGrow: 1, minHeight: 0}}
    >
      {value === index && (
        <>{children}</>
      )}
    </div>
  );
}

export default function Reports() {

  const [tabvalue, setTabvalue] = React.useState(0);

  const tabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  return (
    <Box display="flex" flexDirection="column" height="100%" style={{minHeight: 0}}>
      <Box>
        <Tabs value={tabvalue} onChange={tabChange} aria-label="simple tabs example">
          <Tab label="Inward report" />
          <Tab label="Other reports" />
        </Tabs>
      </Box>
      <TabPanel value={tabvalue} index={0}>
        <InwardReport />
      </TabPanel>
      <TabPanel value={tabvalue} index={1}>
        Coming soon
      </TabPanel>
    </Box>
  )
}