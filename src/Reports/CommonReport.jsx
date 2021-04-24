import { Box, Divider, makeStyles } from "@material-ui/core"
import { Component } from "react"
import { useTable } from "react-table"

// const Styles = styled.div`
//   padding: 1rem;

//   table {
//     border-spacing: 0;
//     border: 1px solid black;

//     tr {
//       :last-child {
//         td {
//           border-bottom: 0;
//         }
//       }
//     }

//     th,
//     td {
//       margin: 0;
//       padding: 0.5rem;
//       border-bottom: 1px solid black;
//       border-right: 1px solid black;

//       :last-child {
//         border-right: 0;
//       }
//     }
//   }
// `


const useStyles = makeStyles(()=>({
  table: {
    borderSpacing: 0,
    border: '1px solid black',
  },
  tr: {

  },
  th: {

  },
  td: {
    margin: 0,
    padding: '0.5rem',
    borderBottom: '1px solid black',
    borderRight: '1px solid black'
  }
}));

function ReportTable({ columns, data }) {
  const classes = useStyles();
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  })

  // Render the UI for your table
  return (
    <table {...getTableProps()} className={classes.table}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()} className={classes.td}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()} className={classes.td}>{cell.render('Cell')}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default class CommonReport extends Component {
  constructor({columns, data}) {
    super();
    this.columns = columns || [];
    this.data = data || [];
  }

  render() {
    const pageStyle = {
      height: '297mm',
      width: '210mm',
    }
    return (
      <Box style={pageStyle}>
        <Box>Some company name</Box>
        <Box>
          <ReportTable columns={this.columns} data={this.data} />
        </Box>
      </Box>
    )
  }
}