import { Box, Button, Divider, makeStyles, Typography } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import ReactToPrint from 'react-to-print';
import CommonReport from './CommonReport';

const useStyles = makeStyles((theme)=>({
  viewerRoot: {
    flexGrow: 1,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid '+theme.palette.grey[200]
  },
  viewerReport: {
    backgroundColor: theme.palette.grey[300],
    flexGrow: 1,
    overflow: 'auto',
    padding: theme.spacing(1),
  },
  pages: {
    width: '210mm',
    backgroundColor: '#fff',
    padding: '5mm',
    color: '#000',
  },
  toolButton: {
    marginRight: '0.5rem',
  }
}));

function ReportHeader({reportName, settings}) {
  return (
    <Box textAlign="center">
      <Typography>{reportName}</Typography>
      <Box borderBottom={1} />
      <Typography style={{fontWeight: 'bold'}}>{settings.companyName}</Typography>
      <Typography variant="subtitle2">{settings.companyAddress}</Typography>
      <Typography style={{fontWeight: 'bold'}} variant="subtitle2">GSTIN: {settings.companyGst}</Typography>
      <Typography variant="body2">{settings.companyContact}</Typography>
      <Box borderBottom={1} />
    </Box>
  )
}

export default function ReportViewer({reportName, children}) {
  const classes = useStyles();
  const reportRef = useRef();
  const [settings, setSettings] = useState({});

  const pageStyle = `
    @page {
      size: A4;
      margin: 0mm;
    }
  `;

  useEffect(()=>{
    axios.get('/api/settings')
      .then((res)=>{
        setSettings(res.data);
      }).catch((err)=>{
        console.log(err);
      });
  }, []);

  return (
    <Box className={classes.viewerRoot}>
      <Box p={1}>
        <ReactToPrint
          trigger={()=><Button color="primary" variant="outlined" className={classes.toolButton}>Print</Button>}
          content={()=>reportRef.current}
          pageStyle={pageStyle}
        />
        <Button color="primary" variant="outlined" disabled>Download PDF</Button>
      </Box>
      <Box className={classes.viewerReport}>
        <Box ref={reportRef} className={classes.pages}>
          <ReportHeader reportName={reportName} settings={settings} />
          {children}
        </Box>
      </Box>
    </Box>
  )
}