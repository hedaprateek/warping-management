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
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
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
    <Box>
      <Tabs value={tabvalue} onChange={tabChange} aria-label="simple tabs example">
        <Tab label="Inward report" />
        <Tab label="Other reports" />
      </Tabs>
      <TabPanel value={tabvalue} index={0}>
        <InwardReport />
      </TabPanel>
      <TabPanel value={tabvalue} index={1}>
        Coming soon
      </TabPanel>
    </Box>
  )
}