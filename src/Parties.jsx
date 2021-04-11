import React from "react";
import TableComponent from "./TableComponent";

class Parties extends React.Component {
     state = {
       filter: "",
    data : [
       {
         col1: 'Hello',
         col2: 'World',
       },
       {
         col1: 'react-table',
         col2: 'rocks',
       },
       {
         col1: 'whatever',
         col2: 'you want',
       },
     ]
   ,
 
    columns : [
       {
         Header: 'NAME',
         accessor: 'col1', // accessor is the "key" in the data
       },
       {
         Header: 'ADDRESS',
         accessor: 'col2',
       },
       {
         Header: 'GSTIN',
         accessor: 'col3', // accessor is the "key" in the data
       },
       {
         Header: 'CONTACT',
         accessor: 'col4',
       },
       {
         Header: 'WEAVER',
         accessor: 'col5', // accessor is the "key" in the data
       },
     ]
   
    }

  render() {  
    return <div> 
      <h2>Parties</h2>
        <TableComponent columns={this.state.columns} data={this.state.data} filterText={this.state.filter}/>
    </div>;
}
}

export default Parties;
