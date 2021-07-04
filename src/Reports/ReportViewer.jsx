import { Box, Button, Divider, Grid, makeStyles, Typography } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import ReactToPrint from 'react-to-print';
import { ReportField } from './ReportComponents';
import Moment from 'moment';
import { InputSelectSearch } from '../components/FormElements';
import _ from 'lodash';

const useStyles = makeStyles((theme)=>({
  viewerRoot: {
    flexGrow: 1,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid '+theme.palette.grey[200],
  },
  viewerReport: {
    backgroundColor: theme.palette.grey[300],
    flexGrow: 1,
    overflow: 'auto',
    padding: theme.spacing(1),
    fontSize: 12,
  },
  pages: {
    width: '210mm',
    backgroundColor: '#fff',
    // padding: '5mm',
    color: '#000',
  },
  toolButton: {
    marginRight: '0.5rem',
  }
}));

export function ReportHeader({reportName, getReportDetails, compHeader}) {
  let reportDetails = getReportDetails && getReportDetails();

  return (
    <>
    <Box>
      <Typography
        style={{
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        {reportName}
      </Typography>
    </Box>
    <Box borderBottom={1} borderTop={1}>

      <Grid container borderBottom={1} spacing={1}>
        <Grid item xs>
          <Typography style={{fontWeight: 'bold', lineHeight: 1.3, fontSize: 14}}>{compHeader.name}</Typography>
          <Typography style={{lineHeight: 1.3}} variant="subtitle2">{compHeader.address}</Typography>
          <Typography style={{fontWeight: 'bold', lineHeight: 1.3, fontSize: 12}} variant="subtitle2">GSTIN: {compHeader.gst}</Typography>
          <Typography style={{lineHeight: 1.3}} variant="subtitle2">{compHeader.contact}, {compHeader.email}</Typography>
        </Grid>
        <Grid item xs>
          <ReportField name="Generated On" value={Moment(new Date()).format('DD-MM-YYYY')} />
          {reportDetails}
        </Grid>
      </Grid>
    </Box>
    </>
  );
}

export default function ReportViewer({reportName, getReportDetails, withHeader=true, children}) {
  const classes = useStyles();
  const reportRef = useRef();
  const [compHeaders, setCompHeaders] = useState([]);
  const [compHeadId, setCompHeadId] = useState(1);

  const pageStyle = `
    @page {
      size: A4;
      margin: 5mm 5mm 17mm 5mm;
    }

    * {
      font-size: 12px;
    }

    @page {
      @bottom-right {
        content: counter(page) " of " counter(pages);
      }
    }
  `;

  useEffect(()=>{
    axios.get(`/api/companies`).then((res) => {
      setCompHeaders(res.data.map((c)=>({label: c.name, value: c.id, data: c})));
    });
  }, []);

  const compHeader = _.find(compHeaders, (c) => c.value === compHeadId)?.data || {};

  return (
    <Box className={classes.viewerRoot}>
      <Box p={1} display="flex">
        <ReactToPrint
          trigger={()=><Button color="primary" variant="outlined" className={classes.toolButton}>Print</Button>}
          content={()=>reportRef.current}
          pageStyle={pageStyle}
        />
        <Button color="primary" variant="outlined" disabled>Download PDF</Button>
        <Box style={{marginLeft: '0.5rem', width: '200px'}}>
          <InputSelectSearch
            value={compHeaders.filter(
              (c) => c.value === compHeadId
            )}
            onChange={(op) => setCompHeadId(op?.value)}
            options={compHeaders}
            label=""
          />
        </Box>
      </Box>
      <Box className={classes.viewerReport}>
        <Box ref={reportRef} className={classes.pages}>
          {withHeader && <ReportHeader reportName={reportName} getReportDetails={getReportDetails} compHeader={compHeader} />}
          {React.cloneElement(children, {compHeader: compHeader})}
        </Box>
      </Box>
    </Box>
  )
}