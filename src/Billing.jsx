import {
  Box,
  Button,
  Divider,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import ReactToPrint from 'react-to-print';
import { InputDate, InputText, InputSelectSearch } from './FormElements';

class Billing extends React.Component {
  componentDidMount() {}

  state = {};

  render() {
    return (
      <div>
        {/* <InvoicePage /> */}
        <BillViewer></BillViewer>
      </div>
    );
  }
}

export default Billing;

function BillHeader({ settings }) {
  return (
    <Box textAlign="center">
      <Typography>Tax Invoice</Typography>
      <Box borderBottom={1} />
      <Typography style={{ fontWeight: 'bold' }}>
        {settings.companyName}
      </Typography>
      <Typography variant="subtitle2">{settings.companyAddress}</Typography>
      <Typography style={{ fontWeight: 'bold' }} variant="subtitle2">
        GSTIN: {settings.companyGst}
      </Typography>
      <Typography variant="body2">
        {settings.companyContact}, {settings.emailId}
      </Typography>
      <Box borderBottom={1} />
    </Box>
  );
}

const useStyles = makeStyles((theme) => ({
  viewerRoot: {
    flexGrow: 1,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid ' + theme.palette.grey[200],
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
  },
}));

function BillViewer({ children }) {
  const classes = useStyles();
  const reportRef = useRef();
  const [settings, setSettings] = useState({});
  const [parties, setParties] = useState({});
  const [partyGst, setPartyGst] = useState('-');

  const pageStyle = `
    @page {
      size: A4;
      margin: 0mm;
    }
  `;

  useEffect(() => {
    axios
      .get('/api/settings')
      .then((res) => {
        setSettings(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

      axios
        .get(`/api/parties`)
        .then((res) => {
          console.log(res);
          setParties(res.data.filter((p) => p.isWeaver === 'Party')
                .map((party) => ({ label: party.name, value: party.gstin })));
        })
        .catch((err) => {
          console.log(err);
        });
  }, []);


    const [selectedDate, handleDateChange] = useState(new Date());

    function updateGstFromParty(e, id) {
console.log(e, id, "")
setPartyGst(e);
// setPartyGst(parties.filter(party => party.id === id ? party.gstin : '-'));
    }

    // const getSelectValue = (options, value) => {
    //   let selectVal = options.filter((option) => option.id === value)[0];
    //   if (selectVal) {
    //     selectVal = {
    //       label: selectVal.name,
    //       value: selectVal.id,
    //     };
    //   }
    //   return selectVal;
    // };

  return (
    <Box className={classes.viewerRoot}>
      <Box p={1}>
        <ReactToPrint
          trigger={() => (
            <Button
              color="primary"
              variant="outlined"
              className={classes.toolButton}
            >
              Print
            </Button>
          )}
          content={() => reportRef.current}
          pageStyle={pageStyle}
        />
        <Button color="primary" variant="outlined" disabled>
          Download PDF
        </Button>
      </Box>
      <Box className={classes.viewerReport}>
        <Box ref={reportRef} className={classes.pages}>
          <BillHeader settings={settings} />
          <div>
            <Grid container spacing={2}>
              <Grid item lg={6} md={6} sm={6} xs={6}>
                <InputText
                  label="Invoice Number"
                  variant="outlined"
                  fullWidth
                  id="invoiceNumber"
                  // value={inwardValue.gatepass}
                  // onChange={updateInwardValues}
                  // isRequired={true}
                />
              </Grid>
              <Grid item lg={6} md={6} sm={6} xs={6}>
                <InputDate
                  id="date"
                  label="Date"
                  value={selectedDate}
                  onChange={(date) => handleDateChange(date)}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item lg={6} md={6} sm={6} xs={6}>
                <InputSelectSearch
                  // value={getSelectValue(props.parties, inwardValue.partyId)}
                  onChange={(value) => {
                    updateGstFromParty(value.value, 'partyId');
                  }}
                  options={parties}
                  // .filter((p) => p.isWeaver === 'Party')
                  // .map((party) => ({ label: party.name, value: party.id }))}
                  label="Party"
                />
              </Grid>
              <Grid item lg={6} md={6} sm={6} xs={6}>
                <InputText
                  label="GST"
                  variant="outlined"
                  fullWidth
                  id="gst"
                  value={partyGst}
                  // onChange={updateInwardValues}
                  // isRequired={true}
                  readOnly
                />
              </Grid>
            </Grid>
          </div>
        </Box>
      </Box>
    </Box>
  );
}
