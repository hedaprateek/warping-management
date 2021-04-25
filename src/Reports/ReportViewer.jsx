import { Box, Button, makeStyles } from '@material-ui/core';
import React, { useRef } from 'react';
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

export default function ReportViewer({children}) {
  const classes = useStyles();
  const reportRef = useRef();

  const pageStyle = `
    @media all {
      .pagebreak {
        display: none;
      }

      .footer {
        display: none;
      }
    }

    @media print {
      .pagebreak {
        page-break-before: always;
      }

      .footer {
        display: block;
        position: fixed;
        bottom: 0pt;
        right: 0pt;
      }

      :after {
        content: counter(page);
        counter-increment: page;
      }
    }
  `;

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
        <Box ref={reportRef} className={classes.pages}>{children}</Box>
      </Box>
    </Box>
  )
}