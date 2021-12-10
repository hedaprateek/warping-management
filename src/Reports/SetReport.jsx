import { Box, Button, Grid } from '@material-ui/core';
import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { MyMath} from '../utils';
import _ from 'lodash';
import { View, Text } from '@react-pdf/renderer';
import {ReportTable, ReportField, ReportViewer, DashedDivider, NoData, ReportSection} from './PDFRenderComponents';
import { InputDate, InputText } from '../components/FormElements';
import Moment from 'moment';

const REPORT_NAME = 'SET REPORT';

export default function SetReport() {
  const [filter, setFilter] = useState({
    set_no: null,
    to_date: new Date(),
  });
  const [data, setData] = useState(null);

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
          <Grid item md={2} xs={12}>
              <InputText
                value={filter.set_no}
                onChange={(e) => {
                  setFilter((prev) => ({ ...prev, set_no: e.target.value }));
                }}
                label="Set No."
              />
          </Grid>
          <Grid item md={2} xs={12}>
            <InputDate
              label="As on date"
              value={filter.to_date}
              onChange={(value) => {
                setFilter((prev) => ({ ...prev, to_date: value }));
              }}
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
      <Box flexGrow="1">
        {useMemo(()=>{
          if(!data) {
            return <></>
          }
          return (
            <ReportViewer reportName={REPORT_NAME} orientation="landscape"
              getReportDetails={()=>(<>
                <ReportField name="Set No" value={filter.set_no} />
                <ReportField name="As on date" value={Moment(filter.to_date).format('DD/MM/YYYY')} />
                <ReportField name="Party" value={(_.find(parties,(o)=>o.id==data.partyId)||{name: 'No party'}).name} />
              </>)}
            >
              <FinalReport data={data} getParty={getParty} getQuality={getQuality} />
            </ReportViewer>
          )
        }, [data])}
      </Box>
    </Box>
  );
}

function WeaverBeamDetails({weaver, weaverName, getQuality}) {
  let beamRows = [];
  weaver.map((beam, i)=>{
    let beamRow = {
      srNo: i+1,
      date: beam.date,
      totalMeter: beam.totalMeter,
      cuts: MyMath(beam.cuts).toString(true, 2),
      beamYarnDetails: [],
      gatepass: beam.gatepass,
      total: {
        quality: '',
        ends: MyMath(0),
        netWt: MyMath(0),
      },
    };

    beam.qualities.map((row)=>{
      beamRow.total.ends = beamRow.total.ends.add(row.ends);
      beamRow.total.netWt = beamRow.total.netWt.add(row.usedYarn);
      beamRow.beamYarnDetails.push({
        quality: getQuality(row.qualityId), ends: row.ends, netWt: row.usedYarn
      })
    });
    beamRow.total.ends = beamRow.total.ends.toString();
    beamRow.total.netWt = beamRow.total.netWt.toString(true);
    beamRows.push(beamRow);
  })
  return (
    <>
    <ReportField name="Weaver" value={weaverName} style={{marginTop: '3mm', marginBottom: '1mm'}}/>
    <ReportTable columns={[
      {name: 'Sr No', key: 'srNo', width: '10mm'},
      {name: 'Gatepass No', key: 'gatepass', width: '22mm'},
      {name: 'Meters', key: 'totalMeter', width: '16mm'},
      {name: 'Cuts', key: 'cuts', width: '16mm'},
      {
        pivot: [
          {name: 'Quality', key: 'quality', width: '22mm'},
          {name: 'Ends', key: 'ends', width: '22mm'},
          {name: 'Net Wt.', key: 'netWt', width: '22mm'},
        ],
        columns: [
          {name: 'Beam Yarn Details', width: '198mm', key: 'beamYarnDetails', pivotDataLength: 8},
          {name: 'Total', width: '27mm', key: 'total'},
        ],
      },
    ]}
    rows={beamRows}
    />
    </>
  )
}

function WeaverOutwardDetails({bags, weaverName, getQuality, getParty}) {
  let bagRows = bags.map((bag, i)=>{
    return {
      bagNo: i+1,
      date: bag.date,
      gatepass: bag.gatepass,
      party: getParty(bag.partyId),
      quality: getQuality(bag.qualityId),
      cones: bag.cones,
      grossWt: MyMath(bag.grossWt).toString(true),
      emptyBagConeWt: `${bag.emptyConeWt} + ${bag.emptyBagWt}`,
      netWt: MyMath(bag.grossWt).sub(bag.emptyConeWt).sub(bag.emptyBagWt).toString(),
    };
  });
  return (
    <>
    <ReportField name="Weaver" value={weaverName} style={{marginTop: '3mm', marginBottom: '1mm'}}/>
    <ReportTable columns={[
      {name: 'Bag No', key: 'bagNo', width: '15mm'},
      {name: 'Date', key: 'date', width: '22mm'},
      {name: 'Gatepass No', key: 'gatepass', width: '40mm'},
      {name: 'Quality', key: 'quality', width: '90mm'},
      {name: 'Cones', key: 'cones', width: '20mm', align: 'right'},
      {name: 'Gross Wt', key: 'grossWt', width: '30mm', align: 'right'},
      {name: 'Empty Cone + Bag Wt', key: 'emptyBagConeWt', width: '42mm', align: 'right'},
      {name: 'Net Wt.', key: 'netWt', width: '30mm', align: 'right'},
    ]}
    rows={bagRows}
    />
    </>
  )
}

function FinalReport({data, getParty, getQuality}) {
  let programData = data['programData'] || {};
  let outwardData = data['outwardData'] || {};
  let setOpeningBalance = data['setOpeningBalance'] || {};

  /* Calculate the beam details summary */
  let beamDetailsSummary = {
    qualities: {},
    overall: {
      totalBeams: 0,
      totalMeter: MyMath(0),
      totalCuts: MyMath(0),
      netWeight: MyMath(0),
    }
  };
  Object.keys(programData).forEach((weaverId, i)=>{
    let weaver = programData[weaverId];
    weaver.forEach((beam)=>{
      beamDetailsSummary.overall.totalBeams += 1;
      beamDetailsSummary.overall.totalMeter = beamDetailsSummary.overall.totalMeter.add(beam.totalMeter);
      beamDetailsSummary.overall.totalCuts = beamDetailsSummary.overall.totalCuts.add(beam.cuts);
      beam.qualities.forEach((q)=>{
        beamDetailsSummary.qualities[q.qualityId] = beamDetailsSummary.qualities[q.qualityId] || MyMath(0);
        beamDetailsSummary.qualities[q.qualityId] = beamDetailsSummary.qualities[q.qualityId].add(q.usedYarn);
        beamDetailsSummary.overall.netWeight = beamDetailsSummary.overall.netWeight.add(q.usedYarn);
      });
    });
  });
  Object.keys(beamDetailsSummary.qualities).map((qualityId)=>{
    beamDetailsSummary.qualities[qualityId] = beamDetailsSummary.qualities[qualityId].toString();
  });
  beamDetailsSummary.overall.totalMeter = beamDetailsSummary.overall.totalMeter.toString();
  beamDetailsSummary.overall.totalCuts = beamDetailsSummary.overall.totalCuts.toString(true, 2);
  beamDetailsSummary.overall.netWeight = beamDetailsSummary.overall.netWeight.toString(true);

  /* Calculate the yarn outward summary */
  let yarnOutwardSummary = {
    qualities: {},
  }
  let flatOutwardData = {};
  Object.keys(outwardData).forEach((weaverId, i)=>{
    let weaver = outwardData[weaverId] || {};
    flatOutwardData[weaverId] = [];
    weaver.forEach((outward)=>{
      yarnOutwardSummary.qualities[outward.qualityId] = yarnOutwardSummary.qualities[outward.qualityId] || MyMath(0);
      yarnOutwardSummary.qualities[outward.qualityId] = yarnOutwardSummary.qualities[outward.qualityId].add(outward.netWt);

      /* Bags process */
      let totalCones = MyMath(0);
      outward.bags.forEach((bag)=>{
        totalCones = totalCones.add(bag.cones);
      });
      totalCones = totalCones.toString();
      outward.bags.forEach((bag)=>{
        flatOutwardData[weaverId].push({
          ...outward,
          cones: bag.cones,
          grossWt: bag.grossWt,
          emptyConeWt: MyMath(outward.emptyConeWt).div(totalCones).mul(bag.cones).toString(true),
          emptyBagWt: MyMath(outward.emptyBagWt).div(outward.bags.length).toString(true),
        });
      });
    });
  });
  Object.keys(yarnOutwardSummary.qualities).map((qualityId)=>{
    yarnOutwardSummary.qualities[qualityId] = yarnOutwardSummary.qualities[qualityId].toString(true);
  });

  return (
    <>
    <ReportSection text="Beam details" />
    {Object.keys(programData).map((weaverId, wi)=>{
      let weaver = programData[weaverId];
      return <>
        <WeaverBeamDetails weaver={weaver} weaverName={getParty(weaverId)||''} getQuality={getQuality} />
      </>
    })}
    <View wrap={false}>
      <ReportSection text="Beam yarn summary" />
      <ReportTable columns={[
        {name: 'Overall Total Beams', key: 'totalBeams', width: '90mm', align: 'center'},
        {name: 'Overall Total Meter', key: 'totalMeter', width: '90mm', align: 'center'},
        {name: 'Overall Total Cuts', key: 'totalCuts', width: '90mm', align: 'center'},
        {name: 'Overall Net Wt', key: 'netWeight', width: '90mm', align: 'center'},
      ]}
      rows={
        [beamDetailsSummary.overall]
      }
      />
    </View>
    <DashedDivider />
    <ReportSection text="Yarn Outward" />
    {Object.keys(flatOutwardData).map((weaverId, wi)=>{
      let bags = flatOutwardData[weaverId];
      return <>
        <WeaverOutwardDetails bags={bags} weaverName={getParty(weaverId)||''} getQuality={getQuality} getParty={getParty}/>
      </>
    })}
    {Object.keys(flatOutwardData).length==0 && <NoData />}
    <DashedDivider />
    <ReportSection text="Yarn Outward Summary" />
    {Object.keys(yarnOutwardSummary.qualities).length > 0 &&
    <View style={{flexDirection: 'row'}}>
      <ReportTable columns={[
          {name: 'Sr No', key: 'srNo', width: '12mm'},
          {name: 'Quality', key: 'quality', width: '90mm'},
          {name: 'Net Wt.', key: 'netWt', width: '50mm', align: 'right'},
        ]}
        rows={
          Object.keys(yarnOutwardSummary.qualities).map(
            (qualityId, i)=>({
              srNo: i+1, quality: getQuality(qualityId), netWt: yarnOutwardSummary.qualities[qualityId]
            })
          )
        }
        style={{flexBasis: '50%'}}
      />
    </View>}
    {Object.keys(yarnOutwardSummary.qualities).length == 0 &&
    <NoData />}
    <DashedDivider />
    <ReportSection text="Overall Yarn Summary" />
    <ReportTable columns={[
        {name: 'Sr No', key: 'srNo', width: '12mm'},
        {name: 'Quality', key: 'quality', width: '90mm'},
        {name: 'Opening', key: 'opening', width: '90mm', align: 'right'},
        {name: 'Warping', key: 'warping', width: '60mm', align: 'right'},
        {name: 'Outward', key: 'outward', width: '60mm', align: 'right'},
        {name: 'Total', key: 'total', width: '65mm', align: 'right'},
      ]}
      rows={
        Object.keys(setOpeningBalance).map(
          (qualityId, i)=>({
            srNo: i+1,
            quality: getQuality(qualityId),
            opening: MyMath(setOpeningBalance[qualityId] || 0).toString(true),
            warping: MyMath(beamDetailsSummary.qualities[qualityId] || 0).toString(true),
            outward: MyMath(yarnOutwardSummary.qualities[qualityId] || 0).toString(true),
            total: MyMath(setOpeningBalance[qualityId]).sub(beamDetailsSummary.qualities[qualityId] || 0).sub(yarnOutwardSummary.qualities[qualityId]).toString(),
          })
        )
      }
    />
    </>
  )
}