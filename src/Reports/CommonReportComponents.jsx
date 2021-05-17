import { Box, Divider, makeStyles, Typography } from "@material-ui/core"
import { useTable } from "react-table"
import clsx from 'clsx';

const useStyles = makeStyles((theme)=>({
  table: {
    borderSpacing: 0,
    border: '1px solid black',
    width: '100%'
  },
  td: {
    margin: 0,
    padding: '0.25rem',
    borderBottom: '1px solid black',
    borderRight: '1px solid black'
  },
  noBorderBottom: {
    borderBottom: 0,
  },
  noBorderRight: {
    borderRight: 0,
  },
  reportStyles: {
    backgroundColor: '#fff',
  },
  dashedDivier: {
    borderTop: '1px dashed',
    margin: theme.spacing(1),
  }
}));

export function ReportTable({ columns, data, showFooter }) {
  const classes = useStyles();
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
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
            {headerGroup.headers.map((column,i)=> (
              <th {...column.getHeaderProps()}  width={column.width}
                className={clsx(classes.td, i==headerGroup.headers.length-1 ? classes.noBorderRight : null)}>
                  {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell, j) => {
                let finalClasses = [classes.td];
                (j===row.cells.length-1) && finalClasses.push(classes.noBorderRight);
                !showFooter && (i===rows.length-1) && finalClasses.push(classes.noBorderBottom);
                return <td {...cell.getCellProps()} className={clsx(finalClasses)}>{cell.render('Cell')}</td>
              })}
            </tr>
          )
        })}
      </tbody>
      {showFooter &&
        <tfoot>
        {footerGroups.map(group => (
          <tr {...group.getFooterGroupProps()}>
            {group.headers.map((column, i) => {
              return <td {...column.getFooterProps()}
                className={clsx(classes.td, classes.noBorderBottom, i==group.headers.length-1 ? classes.noBorderRight : null)}>
                  {column.render('Footer')}
              </td>
            })}
          </tr>
        ))}
      </tfoot>}
    </table>
  )
}

export function DashedDivider() {
  const classes = useStyles();
  return (
    <Box className={classes.dashedDivier}></Box>
  )
}

export function ReportField({name, value, margin}) {
  return (
    <Typography style={margin ? {marginLeft: '0.5rem'} : {}}><span style={{fontWeight: 'bold'}}>{name}: </span>{value}</Typography>
  )
}

export function NoData() {
  return (
    <Box textAlign="center">
      <Typography>---- No Data ----</Typography>
    </Box>
  )
}
