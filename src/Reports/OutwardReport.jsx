import { Box, Button, Grid, InputLabel, makeStyles, MenuItem, TextField, Select as MUISelect } from '@material-ui/core';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DashedDivider, NoData, ReportField, ReportTable, ReportTableSection, ReportTableData, ReportTableRow } from './ReportComponents';
import axios from 'axios';
import ReportViewer from './ReportViewer';
import {FormField, InputDate, InputSelectSearch, InputText} from '../components/FormElements';
import { parse, round } from '../utils';
import _ from 'lodash';
import Moment from 'moment';

const REPORT_NAME = 'OUTWARD REPORT';

export default function OutwardReport() {
  const [dateType, setDateType] = useState('custom-date');
  const [filter, setFilter] = useState({
    party_id: null,
    from_date: new Date(),
    to_date: new Date(),
  });
  const [data, setData] = useState([]);
  const [partiesOpts, setPartiesOpts] = useState([]);

  /* Used by report */
  const [weavers, setWeavers] = useState([]);
  const [qualities, setQualities] = useState([]);

  useEffect(()=>{
    let today = new Date();
    let from_date = new Date();
    let to_date = new Date();

    if(dateType === 'current' || dateType === 'last-f') {
      from_date.setMonth(3);
      from_date.setDate(1);
      to_date.setMonth(2);
      to_date.setDate(31);

      if(today.getMonth()+1 <= 3) {
        let yearDiff = dateType === 'current' ? 0 : 1;
        from_date.setFullYear(today.getFullYear()-1-yearDiff);
        to_date.setFullYear(today.getFullYear()-yearDiff);
      } else {
        let yearDiff = dateType === 'current' ? 1 : 0;
        from_date.setFullYear(today.getFullYear()-1+yearDiff);
        to_date.setFullYear(today.getFullYear()+yearDiff);
      }
    } else if(dateType === 'last-m') {
      let year = today.getMonth() === 0 ? today.getFullYear() -1 : today.getFullYear();
      let month = today.getMonth() === 0 ? 11 : today.getMonth() - 1;
      from_date = new Date(year, month, 1);
      to_date = new Date(year, month + 1, 0);
    }

    setFilter((prev)=>({
      ...prev,
      from_date: from_date,
      to_date: to_date,
    }));
  }, [dateType]);

  const onReportClick = ()=>{
    axios.get('/api/reports/outward', {
      params: {
        ...filter,
      }
    })
    .then((res)=>{
      console.log(res.data);
      setData(res.data);
    })
    .catch((err)=>{
      console.log(err);
    });
  };

  useEffect(()=>{
    axios.get('/api/parties')
      .then((res)=>{
        setPartiesOpts(res.data.filter((o)=>o.isWeaver==='Party').map((party)=>({label: party.name, value: party.id})));
        setWeavers(res.data);
      })
      .catch((err)=>{
        console.log(err);
      });

    axios.get('/api/qualities')
      .then((res)=>{
        setQualities(res.data);
      })
      .catch((err)=>{
        console.log(err);
      });
  }, []);

  const getWeaver = (id)=>(_.find(weavers, (w)=>w.id==id)||{}).name;
  const getQuality = (id)=>(_.find(qualities, (w)=>w.id==id)||{}).name;

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box p={1} paddingBottom={0.5}>
        <Grid container spacing={1}>
          <Grid item md={4} xs={12}>
              <InputSelectSearch
                value={partiesOpts.filter(
                  (party) => party.value === filter.party_id
                )}
                onChange={(op) => {
                  setFilter((prev) => ({ ...prev, party_id: op?.value }));
                }}
                options={partiesOpts}
                label="Party"
                isClearable
              />
          </Grid>
        </Grid>
      </Box>
      <Box p={1} paddingTop={0.5}>
        <Grid container spacing={1}>
          <Grid item md={4} xs={12}>
            <FormField label="Date type">
              <MUISelect
                value={dateType}
                onChange={(e) => setDateType(e.target.value)}
                variant="outlined"
                name="date_type"
                margin="dense"
                fullWidth
              >
                <MenuItem value={'current'}>Current financial year</MenuItem>
                <MenuItem value={'last-m'}>Last month</MenuItem>
                <MenuItem value={'custom-date'}>Custom date range</MenuItem>
                <MenuItem value={'last-f'}>Last financial year</MenuItem>
              </MUISelect>
            </FormField>
          </Grid>
          <Grid item md={2} xs={12}>
            <InputDate
              label="From date"
              value={filter.from_date}
              onChange={(value) => {
                setFilter((prev) => ({ ...prev, from_date: value }));
              }}
            />
          </Grid>
          <Grid item md={2} xs={12}>
            <InputDate
              label="To date"
              value={filter.to_date}
              onChange={(value) => {
                setFilter((prev) => ({ ...prev, to_date: value }));
              }}
            />
          </Grid>
        </Grid>
      </Box>
      <Box p={1} paddingTop={0.5}>
        <Button
          color="primary"
          variant="contained"
          style={{ marginTop: 'auto' }}
          onClick={onReportClick}
        >
          Get report
        </Button>
      </Box>
      <ReportViewer reportName={REPORT_NAME} getReportDetails={()=>(<>
          <ReportField name="Party" value={(_.find(partiesOpts,(o)=>o.value==filter.party_id)||{label: ''}).label} />
          <ReportField name="Date" value={Moment(filter.from_date).format('DD-MM-YYYY') + " to " + Moment(filter.to_date).format('DD-MM-YYYY')} />
        </>)
      }>
        <FinalReport data={data} getWeaver={getWeaver} getQuality={getQuality} />
      </ReportViewer>
    </Box>
  );
}

function BeamDetails({beam, beamNo, getQuality}) {
  return (
    <>
    <ReportTable>
      <ReportTableSection>
        <ReportTableRow>
          <ReportTableData width='30%' style={{verticalAlign: 'top'}} lastRow>
            <Box>
              <ReportField name="Beam No" value={beamNo} margin/>
            </Box>
            <Box display="flex"  flexWrap="wrap">
              <ReportField name="Lassa" value={beam.lassa} margin/>
              <ReportField name="Cuts" value={beam.cuts} margin/>
              <ReportField name="Total meters" value={beam.totalMeter}/>
            </Box>
          </ReportTableData>
          <ReportTableData style={{padding: 0}} last lastRow>
            <ReportTable style={{border: 'none'}} showFooter data={beam.qualities} columns={[
              {
                Header: 'Quality',
                accessor: (row)=>getQuality(row.qualityId),
                width: '50%'
              },
              {
                Header: 'Ends',
                accessor: 'ends',
              },
              {
                Header: 'Net Wt.',
                accessor: 'usedYarn',
                Footer: (info)=>{
                  let total = info.rows.reduce((sum, row) => {
                      return (parse(row.values[info.column.id]) || 0) + sum
                    }, 0
                  );
                  total = round(total);
                  return <span style={{fontWeight: 'bold'}}>{total}</span>
                }
              },
            ]}/>
          </ReportTableData>
        </ReportTableRow>
      </ReportTableSection>
    </ReportTable>
    </>
  );
}

function QualityDetails({qualities, getQuality}) {
  return (
    <>
    <ReportTable showFooter data={qualities} columns={[
      {
        Header: 'Date',
        accessor: 'date',
      },
      {
        Header: 'Quality',
        accessor: (row)=>getQuality(row.qualityId),
        width: '50%'
      },
      {
        Header: 'Net Wt.',
        accessor: 'netWt',
        Footer: (info)=>{
          let total = info.rows.reduce((sum, row) => {
              return (parse(row.values[info.column.id]) || 0) + sum
            }, 0
          );
          total = round(total);
          return <span style={{fontWeight: 'bold'}}>{total}</span>
        }
      },
    ]}/>
    </>
  );
}


function FinalReport({data, getWeaver, getQuality}) {
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
    }
  };
  Object.keys(programData).forEach((weaverId, i)=>{
    let weaver = programData[weaverId];
    weaver.forEach((beam)=>{
      beamDetailsSummary.overall.totalMeter += beam.totalMeter;
      beamDetailsSummary.overall.totalCuts += beam.cuts;
      beam.qualities.forEach((q)=>{
        beamDetailsSummary.qualities[q.qualityId] = beamDetailsSummary.qualities[q.qualityId] || 0;
        beamDetailsSummary.qualities[q.qualityId] += parse(q.usedYarn);
        beamDetailsSummary.overall.netWeight += parse(q.usedYarn);
      });
    });
  });
  Object.keys(beamDetailsSummary.qualities).map((qualityId)=>{
    beamDetailsSummary.qualities[qualityId] = round(beamDetailsSummary.qualities[qualityId]);
  });
  beamDetailsSummary.overall.totalMeter = round(beamDetailsSummary.overall.totalMeter);
  beamDetailsSummary.overall.totalCuts = round(beamDetailsSummary.overall.totalCuts);
  beamDetailsSummary.overall.netWeight = round(beamDetailsSummary.overall.netWeight);

  /* Calculate the yarn outward summary */
  let yarnOutwardSummary = {
    qualities: {},
  }
  Object.keys(outwardData).forEach((weaverId, i)=>{
    let weaver = outwardData[weaverId] || {};
    weaver.forEach((outward)=>{
      yarnOutwardSummary.qualities[outward.qualityId] = yarnOutwardSummary.qualities[outward.qualityId] || 0;
      yarnOutwardSummary.qualities[outward.qualityId] += outward.netWt;
    });
  });
  Object.keys(yarnOutwardSummary.qualities).map((qualityId)=>{
    yarnOutwardSummary.qualities[qualityId] = round(yarnOutwardSummary.qualities[qualityId]);
  });

  return (
    <>
      <div style={{fontWeight: 'bold', textAlign: 'center', textDecoration: 'underline'}}>Beam details</div>
      {Object.keys(programData).length === 0 && <NoData />}
      {Object.keys(programData).length > 0 &&
      <>
      {Object.keys(programData).map((weaverId)=>{
        let weaver = programData[weaverId];
        return (
          <>
          <ReportField name="Weaver" value={getWeaver(weaverId)} />
          {weaver.map((beam, i)=>{
            return <BeamDetails beam={beam} beamNo={i+1} getQuality={getQuality}/>
          })}
          <DashedDivider />
          </>
        )
      })}
      <Box marginTop="0.5rem">
        <Grid container spacing={2}>
          <Grid item xs>
            <ReportTable data={
              Object.keys(beamDetailsSummary.qualities).map(
                (qualityId)=>({
                  qualityId: qualityId, netWt: beamDetailsSummary.qualities[qualityId]
                })
              )
            } columns={[
              {
                Header: 'Quality',
                accessor: (row)=>getQuality(row.qualityId),
              },
              {
                Header: 'Net Wt.',
                accessor: 'netWt',
              },
            ]}/>
          </Grid>
          <Grid item xs>
            <ReportField name="Overall Total Meter" value={beamDetailsSummary.overall.totalMeter} />
            <ReportField name="Overall Total Cuts" value={beamDetailsSummary.overall.totalCuts} />
            <ReportField name="Overall Net Wt" value={beamDetailsSummary.overall.netWeight} />
          </Grid>
        </Grid>
      </Box>
      </>}
      <DashedDivider />
      <div style={{fontWeight: 'bold', textAlign: 'center', textDecoration: 'underline'}}>Yarn Outward</div>
      {Object.keys(outwardData).length === 0 && <NoData />}
      {Object.keys(outwardData).length > 0 &&
      <>
      {Object.keys(outwardData).map((weaverId)=>{
        let qualities = outwardData[weaverId];
        return (
          <>
          <ReportField name="Party/Weaver" value={getWeaver(weaverId)} />
          <QualityDetails qualities={qualities} getQuality={getQuality}/>
          <DashedDivider />
          </>
        )
      })}
      <Box>
        <ReportTable data={
            Object.keys(yarnOutwardSummary.qualities).map(
              (qualityId)=>({
                qualityId: qualityId, netWt: round(yarnOutwardSummary.qualities[qualityId])
              })
            )
          } columns={[
            {
              Header: 'Quality',
              accessor: (row)=>getQuality(row.qualityId),
            },
            {
              Header: 'Net Wt.',
              accessor: 'netWt',
            },
        ]}/>
      </Box>
      </>}
      <DashedDivider />
      <div style={{fontWeight: 'bold', textAlign: 'center', textDecoration: 'underline'}}>Yarn Summary</div>
      <ReportTable data={
          Object.keys(inwardOpeningBalance).map(
            (qualityId)=>({
              qualityId: qualityId,
              openBalance: round(inwardOpeningBalance[qualityId]),
            })
          )
        } columns={[
          {
            Header: 'Quality',
            accessor: (row)=>getQuality(row.qualityId),
          },
          {
            Header: 'Inward',
            accessor: 'openBalance',
          },
          {
            Header: 'Warping',
            accessor: (row)=>{
              return beamDetailsSummary.qualities[row.qualityId] || 0;
            }
          },
          {
            Header: 'Outward',
            accessor: (row)=>{
              return yarnOutwardSummary.qualities[row.qualityId] || 0;
            }
          },
          {
            Header: 'Balance',
            accessor: (row)=>{
              return round(row.openBalance - (beamDetailsSummary.qualities[row.qualityId] || 0)
                - (yarnOutwardSummary.qualities[row.qualityId] || 0));
            }
          },
      ]}/>
    </>
  )
}