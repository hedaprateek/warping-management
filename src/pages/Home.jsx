import { Grid, Card, CardContent, Box, Button, CardHeader } from '@material-ui/core';
import axios from 'axios';
import _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { InputSelectSearch } from '../components/FormElements';
import { ResultsTable } from '../components/ResultsTable';

function LiveBalance({accounts, qualities}) {
  const columns = useMemo(()=>[
    {
      name: 'Quality',
      key: 'quality',
      width: 300,
    },
    {
      name: 'Balance yarn (Kg)',
      key: 'balance',
    },
  ], []);
  const [partyId, setPartyId] = useState();
  const [balanceData, setBalanceData] = useState([]);

  const onGetClick = async ()=>{
    let res = await axios.get('/api/inward/balance/'+partyId);
    let finalList = Object.keys(res.data||{}).map((qualityId)=>({
      quality: _.find(qualities, (q)=>q.id==qualityId)?.name,
      balance: res.data[qualityId],
    }));
    setBalanceData(finalList);
  }

  const partiesOpts = accounts.filter((a)=>a.isWeaver=='Party').map((p)=>({label: p.name, value: p.id}));

  return (
    <Card>
      <CardHeader title="Live yarn balance" />
      <CardContent>
        <Box display="flex" width="100%" alignItems="flex-end">
          <Box flexGrow="1">
            <InputSelectSearch label="Party"
              value={_.find(partiesOpts, (p)=>p.value==partyId)}
              onChange={async (value)=>{
                setPartyId(value?.value);
              }}
              options={partiesOpts}
              autoFocus
            />
          </Box>
          <Box style={{marginLeft: '0.5rem'}}>
            <Button variant="outlined" color="primary" onClick={onGetClick}>Get Balance</Button>
          </Box>
        </Box>
        <Box marginTop={1} height="250px" overflow="auto">
          <ResultsTable
            columns={columns}
            rows={balanceData}
            hasEdit={false}
          />
        </Box>
      </CardContent>
    </Card>
  );
}

export default function Home() {
    const [accounts, setAccounts] = useState([]);
    const [qualities, setQualities] = useState([]);
    useEffect(async ()=>{
      let res = await axios.get('/api/qualities');
      setQualities(res.data);
      res = await axios.get('/api/parties');
      setAccounts(res.data);
    }, []);

    return (
      <Box p={1} height="100%">
        <Grid container>
          <Grid item lg={4} md={4} sm={12} xs={12}>
            <LiveBalance accounts={accounts} qualities={qualities}/>
          </Grid>
        </Grid>
      </Box>
    );
};
