import { Box, Button, Grid, InputLabel, makeStyles, MenuItem, TextField, Select as MUISelect, Typography } from '@material-ui/core';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DashedDivider, NoData, ReportField, ReportTable, ReportTableSection, ReportTableData, ReportTableRow } from './ReportComponents';
import axios from 'axios';
import ReportViewer from './ReportViewer';
import {FormField, InputDate, InputSelectSearch, InputText} from '../components/FormElements';
import { parse, round } from '../utils';
import { _ } from 'globalthis/implementation';
import Moment from 'moment';


const useStyles = makeStyles((theme)=>({
  reportContainer: {
    height: '100%',
    overflow: 'auto',
    flexGrow: 1,
    minHeight: 0,
  }
}));

const REPORT_NAME = 'SET REPORT';

export default function SetReport() {
  const [filter, setFilter] = useState({
    set_no: null,
  });
  const [data, setData] = useState([]);

  /* Used by report */
  const [parties, setParties] = useState([]);
  const [qualities, setQualities] = useState([]);

  const onReportClick = ()=>{
    axios.get('/api/reports/set', {
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
        setParties(res.data);
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

  const getParty = (id)=>(_.find(parties, (w)=>w.id==id)||{}).name;
  const getQuality = (id)=>(_.find(qualities, (w)=>w.id==id)||{}).name;

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
          </Grid>
          <Grid item md={4} xs={12} style={{ display: 'flex' }}>
            <Button
              color="primary"
              variant="contained"
              style={{ marginTop: 'auto' }}
              onClick={onReportClick}
            >
              Get report
            </Button>
          </Grid>
        </Grid>
      </Box>
      <ReportViewer reportName={REPORT_NAME}
        getReportDetails={()=>(<>
          <ReportField name="Set No" value={filter.set_no} />
          <ReportField name="Party" value={(_.find(parties,(o)=>o.id==data.partyId)||{name: 'No party'}).name} />
        </>)}
      >
        <FinalReport data={data} getParty={getParty} getQuality={getQuality} />
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


function FinalReport({data, getParty, getQuality}) {
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
        beamDetailsSummary.qualities[q.qualityId] += q.usedYarn;
        beamDetailsSummary.overall.netWeight += q.usedYarn;
      });
    });
  });
  beamDetailsSummary.overall.totalMeter = parse(beamDetailsSummary.overall.totalMeter);
  beamDetailsSummary.overall.totalCuts = parse(beamDetailsSummary.overall.totalCuts);
  beamDetailsSummary.overall.netWeight = parse(beamDetailsSummary.overall.netWeight);

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

  let allQualities =
    (_.union(Object.keys(beamDetailsSummary.qualities),
      Object.keys(yarnOutwardSummary.qualities)) || []).map((v)=>({qualityId: v}));

  return (
    <>
      <Typography style={{fontWeight: 'bold', textAlign: 'center', textDecoration: 'underline'}}>Beam details</Typography>
      {Object.keys(programData).length === 0 && <NoData />}
      {Object.keys(programData).length > 0 &&
      <>
      {Object.keys(programData).map((weaverId, wi)=>{
        let weaver = programData[weaverId];
        return (
          <>
          <ReportField name="Weaver" value={getParty(weaverId)} />
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
      <Typography style={{fontWeight: 'bold', textAlign: 'center', textDecoration: 'underline'}}>Yarn Outward</Typography>
      {Object.keys(outwardData).length === 0 && <NoData />}
      {Object.keys(outwardData).length > 0 &&
      <>
      {Object.keys(outwardData).map((weaverId)=>{
        let qualities = outwardData[weaverId];
        return (
          <>
          <ReportField name="Party/Weaver" value={getParty(weaverId)} />
          <QualityDetails qualities={qualities} getQuality={getQuality}/>
          <DashedDivider />
          </>
        )
      })}
      <Box>
        <ReportTable data={
            Object.keys(yarnOutwardSummary.qualities).map(
              (qualityId)=>({
                qualityId: qualityId, netWt: yarnOutwardSummary.qualities[qualityId]
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
      <Typography style={{fontWeight: 'bold', textAlign: 'center', textDecoration: 'underline'}}>Yarn Summary</Typography>
      <ReportTable data={allQualities} columns={[
          {
            Header: 'Quality',
            accessor: (row)=>getQuality(row.qualityId),
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
            Header: 'Total',
            accessor: (row)=>{
              return (beamDetailsSummary.qualities[row.qualityId] || 0)
                + (yarnOutwardSummary.qualities[row.qualityId] || 0);
            }
          },
      ]}/>
    </>
  )
}