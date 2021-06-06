import { Box } from '@material-ui/core';
import React from 'react';

export default function TabPanel({children, classNameRoot, className, value, index}) {
  const active = value === index;
  return (
    <Box component="div" minHeight="0" flexGrow="1" hidden={!active}>
      <Box style={{height: '100%', display: 'flex', flexDirection: 'column'}} className={className}>{children}</Box>
    </Box>
  );
}
