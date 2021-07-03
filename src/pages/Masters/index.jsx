import { Box, Tab, Tabs } from '@material-ui/core';
import React from 'react';
import TabPanel from '../../components/TabPanel';
import CompanyAccounts from './CompanyAccounts';
import Parties from './Parties';
import Qualities from './Qualities';

export default function Masters() {
  const [tabvalue, setTabvalue] = React.useState(0);

  const tabChange = (event, newValue) => {
    setTabvalue(newValue);
  };

  return (
    <Box display="flex" flexDirection="column" height="100%" style={{minHeight: 0}}>
      <Box>
        <Tabs value={tabvalue} onChange={tabChange}>
          <Tab label="Accounts" />
          <Tab label="Qualities" />
          <Tab label="Companies Accounts" />
        </Tabs>
      </Box>
      <TabPanel value={tabvalue} index={0}>
        <Parties />
      </TabPanel>
      <TabPanel value={tabvalue} index={1}>
        <Qualities />
      </TabPanel>
      <TabPanel value={tabvalue} index={2}>
        <CompanyAccounts />
      </TabPanel>
    </Box>
  )
}
