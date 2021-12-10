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
  InputSelect,
  InputSelectSearch,
  InputText,
} from '../components/FormElements';
import { convertAmountToWords, parse, round } from '../utils';
import { _ } from 'globalthis/implementation';
import Moment from 'moment';
import {
  BillTable,
  DashedDivider,
  NoData,
  ReportField,
  ReportTable,
} from '../Reports/ReportComponents';
import ReportViewer, { ReportHeader } from '../Reports/ReportViewer';
import DataGrid from '../components/DataGrid';

const useStyles = makeStyles((theme) => ({
  reportContainer: {
    height: '100%',
    overflow: 'auto',
    flexGrow: 1,
    minHeight: 0,
  },
}));

export default function Billing(props) {
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
    let finalRows = [];
    Object.keys(programData).forEach((weaverId, i) => {
      let beamDetailsSummary = {
        weaverName: '',
        totalMeter: 0,
        netWeight: 0,
        netLength: 0,
        netQuantity: 0,
        unit: 'wt',
        weaverDesc: '',
        rate: 0,
        amount: 0,
        hsnSacCode: '',
        quantity: 0,
      };
      let beams = programData[weaverId];
      beamDetailsSummary.weaverName = getParty(weaverId);
      beamDetailsSummary.netQuantity = beams.length;

      beams.forEach((beam) => {
        beamDetailsSummary.netLength += beam.totalMeter;
        beam.qualities.forEach((q) => {
          beamDetailsSummary.netWeight += q.usedYarn;
        });
      });

      beamDetailsSummary.netWeight = round(beamDetailsSummary.netWeight);

      if (beamDetailsSummary.unit === 'wt') {
        beamDetailsSummary.quantity = beamDetailsSummary.netWeight;
        beamDetailsSummary.unitLabel = 'Kgs.';
      } if (beamDetailsSummary.unit === 'ln') {
        beamDetailsSummary.quantity = beamDetailsSummary.netLength;
        beamDetailsSummary.unitLabel = 'Mtr.';
      } if (beamDetailsSummary.unit === 'qn') {
        beamDetailsSummary.quantity = beamDetailsSummary.netQuantity;
        beamDetailsSummary.unitLabel = 'Nos.';
      }
      finalRows.push(beamDetailsSummary);
    });
    setBillRows(finalRows);
  }

  function updateBillingValues(e, index, id) {
    if (e?.target) {
      setBillRows((prevValue) => {
        let updatedValue = [...prevValue];
        let rowOfConcern = updatedValue[index];
        let targetId = e.target.id || id;
        rowOfConcern[targetId] = e.target.value;

        if (rowOfConcern.unit === "wt") {
          rowOfConcern.amount = round(parse(rowOfConcern.rate) * rowOfConcern.netWeight, true, 2);
          rowOfConcern.quantity = rowOfConcern.netWeight;
          rowOfConcern.unitLabel = 'Kgs.';
        }
        if (rowOfConcern.unit === "ln") {
          rowOfConcern.amount = round(parse(rowOfConcern.rate) * rowOfConcern.netLength, true, 2);
          rowOfConcern.quantity = rowOfConcern.netLength;
          rowOfConcern.unitLabel = 'Mtr.';
        }
        if (rowOfConcern.unit === "qn") {
          rowOfConcern.amount = round(parse(rowOfConcern.rate) * rowOfConcern.netQuantity, true, 2);
          rowOfConcern.quantity = rowOfConcern.netQuantity;
          rowOfConcern.unitLabel = 'Nos.';
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
      style: {width: 250},
    },
    {
      Header: 'Notes',
      accessor: 'weaverDesc',
      Cell: ({ row, value }) => {
        return (
          <InputText
            variant="outlined"
            fullWidth
            value={value}
            onChange={(e) => updateBillingValues(e, row.index, 'weaverDesc')}
          />
        );
      },
      style: {width: 250},
    },
    {
      Header: 'Unit',
      accessor: 'unit',
      Cell: ({ row, value }) => {
        return (
          <InputSelect options={[
              {label: 'Kgs.', value: 'wt'},
              {label: 'Mtr.', value: 'ln'},
              {label: 'Nos.', value: 'qn'},
            ]}
            value={value}
            onChange={(e) => updateBillingValues(e, row.index, "unit")}
          />
        );
      },
      style: {width: 100},
    },
    {
      Header: 'Rate',
      accessor: 'rate',
      Cell: ({ row, value }) => {
        return (
          <InputText
            variant="outlined"
            fullWidth
            value={value}
            onChange={(e) => updateBillingValues(e, row.index, "rate")}
          />
        );
      },
      style: {width: 200},
    },
    {
      Header: 'Amount',
      accessor: 'amount',
      style: {width: 220},
    },
  ],[]);

  return (
    <Box style={{height: '100%'}}>
      <Box p={1}>
        <Grid container spacing={2}>
          <Grid item md={3} xs={12}>
            <InputText
              value={filter.set_no}
              onChange={(e) => {
                setFilter((prev) => ({ ...prev, set_no: e.target.value }));
              }}
              label="Set No."
            />
          </Grid>
          <Grid item md={3} xs={12} style={{ display: 'flex' }}>
            <Button
              color="primary"
              variant="contained"
              style={{ marginTop: 'auto' }}
              onClick={onReportClick}
              disabled={props.licexpired}
            >
              Fetch details
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item md={4} xs={12} style={{ display: 'flex' }}>
            <InputDate
              id="date"
              label="Date"
              value={selectedDate}
              onChange={updateBillDate}
            />
          </Grid>
        </Grid>
      </Box>
      <Grid container>
        <Grid item lg={8} md={12} sm={12} xs={12}>
          <DataGrid showFooter data={billRows} columns={billingCols} />
        </Grid>
      </Grid>

      <ReportViewer withHeader={false}>
        <FinalReport data={data} getParty={getParty} getQuality={getQuality} billRows={billRows}
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
        />
      </ReportViewer>
    </Box>
  );
}

function BillLeaflet({ billRows, amountTotal, getReportDetails, compHeader }) {
  return (
    <Box display="flex" flexDirection="column" height="270mm" marginLeft="5mm">
      <ReportHeader reportName={'TAX INVOICE'} getReportDetails={getReportDetails} compHeader={compHeader}/>
      <Box flexGrow="1" display="flex" flexDirection="column">
        <BillTable
          style={{height: '100%'}}
          showFooter
          data={billRows}
          columns={[
            {
              Header: 'Sr. No.',
              id: 'srno',
              Cell: ({row})=>{
                return <span>{row.index+1}</span>;
              },
              width: 10,
            },
            {
              Header: 'Description',
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
              width: 120,
            },
            {
              Header: 'HSN/SAC Code',
              accessor: 'hsnSacCode',
              width: 30
            },
            {
              Header: 'Qty.',
              accessor: 'quantity',
              width: 40,
            },
            {
              Header: 'Unit',
              accessor: 'unitLabel',
              width: 20,
            },
            {
              Header: 'Rate',
              accessor: 'rate',
              width: 50,
              Footer: ()=><span style={{fontWeight: 'bold'}}>Total</span>
            },
            {
              Header: 'Amount',
              accessor: 'amount',
              width: 50,
              align: 'right',
              Footer: (info)=>{
                return <span style={{fontWeight: 'bold'}}>{amountTotal}</span>
              }
            },
          ]}
        />
      </Box>
      <Box>
        <ReportField name="Amount in words" value={convertAmountToWords(amountTotal)} />
      </Box>
    </Box>
  );
}

function FinalReport({ data, getParty, getQuality, billRows, getReportDetails, compHeader }) {
  let amountTotal = billRows.reduce((sum, row) => {
    return (parse(row.amount) || 0) + sum
  }, 0);
  amountTotal = round(amountTotal, true, 2);

  return (
    <>
      <BillLeaflet billRows={billRows} amountTotal={amountTotal} getReportDetails={getReportDetails} compHeader={compHeader} />
    </>
  );
}