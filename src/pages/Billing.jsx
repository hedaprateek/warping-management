import {
  Box,
  Button,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  TextField,
  Select as MUISelect,
  Typography,
  Input,
} from '@material-ui/core';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import {
  FormField,
  InputDate,
  InputSelectSearch,
  InputText,
} from '../components/FormElements';
import { parse, round } from '../utils';
import { _ } from 'globalthis/implementation';
import Moment from 'moment';
import {
  DashedDivider,
  NoData,
  ReportField,
  ReportTable,
} from '../Reports/ReportComponents';
import ReportViewer from '../Reports/ReportViewer';

const useStyles = makeStyles((theme) => ({
  reportContainer: {
    height: '100%',
    overflow: 'auto',
    flexGrow: 1,
    minHeight: 0,
  },
}));

export default function Billing() {
  const [filter, setFilter] = useState({
    set_no: null,
  });
  const [data, setData] = useState([]);

  /* Used by report */
  const [parties, setParties] = useState([]);
  const [qualities, setQualities] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [billRows, setBillRows] = useState([]);

  function setBillRecords(data) {
    let programData = data['programData'] || {};

    let beamDetailsSummary = {
      weaverName: '',
      totalMeter: 0,
      netWeight: 0,
      weaverDesc: '',
      rate: 0,
      amount: 0,
      hsnSacCode: '',
    };

    let finalRows = [];
    Object.keys(programData).forEach((weaverId, i) => {
      let weaver = programData[weaverId];
      beamDetailsSummary.weaverName = getParty(weaverId);
      // let weaver = programData[weaverId];
      weaver.forEach((beam) => {
        beamDetailsSummary.totalMeter += beam.totalMeter;
        beam.qualities.forEach((q) => {
          beamDetailsSummary.netWeight += q.usedYarn;
        });
      });
      console.log('beamDetailsSummary  : ', beamDetailsSummary);
      finalRows.push(beamDetailsSummary);
      beamDetailsSummary = {
        weaverName: '',
        totalMeter: 0,
        netWeight: 0,
        weaverDesc: '',
        rate: 0,
        amount: 0,
        hsnSacCode: '',
      };
    });
    setBillRows(finalRows);
  }

    function updateBillingValues(e, index) {
    if (e?.target) {

      setBillRows((prevValue) => {
        let updatedValue = [...prevValue];
        let rowOfConcern = updatedValue[index];
        if (e.target.id === 'weaverDesc') 
        {
          rowOfConcern.weaverDesc = e.target.value;
        } else {
          // rowOfConcern.rate = e.target.value;
          rowOfConcern.amount = e.target.value * rowOfConcern.netWeight;
        }
        return updatedValue;
      });
    }
    }
  const onReportClick = () => {
    axios
      .get('/api/reports/set', {
        params: {
          ...filter,
        },
      })
      .then((res) => {
        console.log(res.data);
        setData(res.data);
        setBillRecords(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    axios
      .get('/api/parties')
      .then((res) => {
        setParties(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const updateBillDate = (date) => {
    setSelectedDate(date);
  };

  const getParty = (id) => (_.find(parties, (w) => w.id == id) || {}).name;
  const getQuality = (id) => (_.find(qualities, (w) => w.id == id) || {}).name;

    const billingCols = useMemo(()=>[
            {
              Header: 'Weaver Name',
              accessor: 'weaverName',
              Cell: ({ row, value }) => {
                return (
                  <InputText
                    label={value}
                    variant="outlined"
                    fullWidth
                    id="weaverDesc"
                    value={row.values.weaverDesc}
                    onChange={(e) => updateBillingValues(e, row.index)}
                  />
                );
              },
            },
            {
              Header: 'Weight',
              accessor: 'netWeight',
            },
            {
              Header: 'Rate',
              // accessor: 'rate',
              Cell: ({ row, value }) => {
                return (
                  <InputText
                    label={value}
                    variant="outlined"
                    fullWidth
                    id="rate"
                    value={row.values.rate }
                    onChange={(e) => updateBillingValues(e, row.index)}
                  />
                );
              },
            },
            {
              Header: 'Amount',
              accessor: 'amount',
            },
            
    ],[]);


  return (
    <Box style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box p={1}>
        <Grid container spacing={2}>
          <Grid item md={4} xs={12}>
            <InputText
              value={filter.set_no}
              onChange={(e) => {
                setFilter((prev) => ({ ...prev, set_no: e.target.value }));
              }}
              label="Set No."
            />
            <InputDate
              id="date"
              label="Date"
              value={selectedDate}
              onChange={updateBillDate}
            />
          </Grid>
          <Grid item md={4} xs={12} style={{ display: 'flex' }}>
            <Button
              color="primary"
              variant="contained"
              style={{ marginTop: 'auto' }}
              onClick={onReportClick}
            >
              Fetch Bill details
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Grid>
        <ReportTable showFooter data={billRows} columns={billingCols} />
      </Grid>

      <ReportViewer
        defaultHeaders={false}
        getReportDetails={() => (
          <>
            <ReportField name="Set No" value={filter.set_no} />
            <ReportField
              name="Party"
              value={
                (
                  _.find(parties, (o) => o.id == data.partyId) || {
                    name: 'No party',
                  }
                ).name
              }
            />
            <ReportField
              name="Party GST"
              value={
                (
                  _.find(parties, (o) => o.id == data.partyGst) || {
                    name: 'No GST',
                  }
                ).name
              }
            />

            <ReportField name="Date" value={selectedDate.toDateString()} />
          </>
        )}
      >
        <FinalReport data={data} getParty={getParty} getQuality={getQuality} billRows={billRows} />
      </ReportViewer>
    </Box>
  );
}

function BillPrintDetails({ billRows }) {
  return (
    <>
      <ReportTable
        showFooter
        data={billRows}
        columns={[
          {
            Header: 'Weaver Name',
            accessor: 'weaverName',
            Cell: (row) => {
              return (
                <div>
                  <span>
                    {row.data[row.row.index].weaverName}
                  </span>
                  <br  />
                  <span>
                    {row.data[row.row.index].weaverDesc}
                  </span>
                </div>
              );
            },
          },
          {
            Header: 'HSN/SAC Code',
            accessor: 'hsnSacCode',
          },
          {
            Header: 'Weight',
            accessor: 'netWeight',
          },
          {
            Header: 'Rate',
            accessor: 'rate',
          },
          {
            Header: 'Amount',
            accessor: 'amount',
          },
        ]}
      />
    </>
  );
}

function FinalReport({ data, getParty, getQuality, billRows }) {
  let programData = data['programData'] || {};
  let outwardData = data['outwardData'] || {};
  let inwardOpeningBalance = data['inwardOpeningBalance'] || {};

  /* Calculate the beam details summary */
  let beamDetailsSummary = {
    qualities: {},
    overall: {
      totalMeter: 0,
      totalCuts: 0,
      netWeight: 0,
    },
  };
  Object.keys(programData).forEach((weaverId, i) => {
    let weaver = programData[weaverId];
    weaver.forEach((beam) => {
      beamDetailsSummary.overall.totalMeter += beam.totalMeter;
      beamDetailsSummary.overall.totalCuts += beam.cuts;
      beam.qualities.forEach((q) => {
        beamDetailsSummary.qualities[q.qualityId] =
          beamDetailsSummary.qualities[q.qualityId] || 0;
        beamDetailsSummary.qualities[q.qualityId] += q.usedYarn;
        beamDetailsSummary.overall.netWeight += q.usedYarn;
      });
    });
  });
  beamDetailsSummary.overall.totalMeter = parse(
    beamDetailsSummary.overall.totalMeter
  );
  beamDetailsSummary.overall.totalCuts = parse(
    beamDetailsSummary.overall.totalCuts
  );
  beamDetailsSummary.overall.netWeight = parse(
    beamDetailsSummary.overall.netWeight
  );

  /* Calculate the yarn outward summary */
  let yarnOutwardSummary = {
    qualities: {},
  };
  Object.keys(outwardData).forEach((weaverId, i) => {
    let weaver = outwardData[weaverId] || {};
    weaver.forEach((outward) => {
      yarnOutwardSummary.qualities[outward.qualityId] =
        yarnOutwardSummary.qualities[outward.qualityId] || 0;
      yarnOutwardSummary.qualities[outward.qualityId] += outward.netWt;
    });
  });

  let allQualities = (
    _.union(
      Object.keys(beamDetailsSummary.qualities),
      Object.keys(yarnOutwardSummary.qualities)
    ) || []
  ).map((v) => ({ qualityId: v }));

  return (
    <>
      <Typography
        style={{
          fontWeight: 'bold',
          textAlign: 'center',
          textDecoration: 'underline',
        }}
      >
        TAX INVOICE
      </Typography>
      {Object.keys(programData).length === 0 && <NoData />}
      {Object.keys(programData).length > 0 && (
        <>
          <BillPrintDetails billRows={billRows} />

          <DashedDivider />

          <Box marginTop="0.5rem">
            <Grid container spacing={2}>
              <Grid item xs>
                <ReportTable
                  data={Object.keys(beamDetailsSummary.qualities).map(
                    (qualityId) => ({
                      qualityId: qualityId,
                      netWt: beamDetailsSummary.qualities[qualityId],
                    })
                  )}
                  columns={[
                    {
                      Header: 'Quality',
                      accessor: (row) => getQuality(row.qualityId),
                    },
                    {
                      Header: 'Net Wt.',
                      accessor: 'netWt',
                    },
                  ]}
                />
              </Grid>
              <Grid item xs>
                <ReportField
                  name="Overall Total Meter"
                  value={beamDetailsSummary.overall.totalMeter}
                />
                <ReportField
                  name="Overall Total Cuts"
                  value={beamDetailsSummary.overall.totalCuts}
                />
                <ReportField
                  name="Overall Net Wt"
                  value={beamDetailsSummary.overall.netWeight}
                />
              </Grid>
            </Grid>
          </Box>
        </>
      )}
      <DashedDivider />
    </>
  );
}
