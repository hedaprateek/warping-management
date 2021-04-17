import React from "react";
import DraggableDialog from "./modal-dialog";
import TableComponent from "./TableComponent";

class Parties extends React.Component {
     state = {
       filter: "",
    data : [
       {
         col1: 'Name 1',
         col2: 'Address 1',
         col3: 'GST 1',
         col4: 'Contact 1',
         col5: 'Yes',
       },
       {
         col1: 'Name 2',
         col2: 'Address 2',
         col3: 'GST 2',
         col4: 'Contact 2',
         col5: 'No',
       },
       {
         col1: 'Name 3',
         col2: 'Address 3',
         col3: 'GST 3',
         col4: 'Contact 3',
         col5: 'Yes',
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
     ],

     dialogBody: (
       <div>
         <h3>Name :<input type='text'></input></h3>
         <h3>Address :<input type='text'></input></h3>
         <h3>GSTIn :<input type='text'></input></h3>
         <h3>Contact :<input type='text'></input></h3>
         <h3>IsWeaver :    <input type="radio" id="isWeaverYes"
     name="weaver" value="weaverYes"/>Yes
     <input type="radio" id="isWeaverNo"
     name="weaver" value="weaverNo"/>No
    </h3>
         </div>
     )
   
    }

  render() {  
    return <div> 
      <h2>Parties

      </h2>
        <TableComponent columns={this.state.columns} data={this.state.data} filterText={this.state.filter}/>
        <DraggableDialog body={this.state.dialogBody} sectionTitle="Party"/>
    </div>;
}
}

export default Parties;
