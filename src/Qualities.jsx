import React from "react";
import DraggableDialog from "./modal-dialog";
import TableComponent from "./TableComponent";

class Qualities extends React.Component {
   state = {
       filter: "",
    data : [
       {
         col1: 'Quality name 1',
         col2: 'Quality Desc 1',
       },
       {
         col1: 'Quality name 2',
         col2: 'Quality Desc 2',
       },
     ]
   ,
 
    columns : [
       {
         Header: 'NAME',
         accessor: 'col1', // accessor is the "key" in the data
       },
       {
         Header: 'DESCRIPTION',
         accessor: 'col2',
       },
     ]
     , dialogBody: (
       <div> <h3>Name :<input type='text'></input></h3>
         <h3>Description :<input type='text'></input></h3></div>
     )
   
   
    }

  render() {  
    return <div> 
      <h2>Qualities</h2>
        <TableComponent columns={this.state.columns} data={this.state.data} filterText={this.state.filter}/>
                <DraggableDialog body={this.state.dialogBody} sectionTitle="Quality"/>

    </div>;
}
}


export default Qualities;
