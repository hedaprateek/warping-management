import { Box, Divider, makeStyles, Typography } from "@material-ui/core"
import { useFlexLayout, useTable } from "react-table"
import clsx from 'clsx';

const useStyles = makeStyles((theme)=>({
  table: {
    borderSpacing: 0,
    border: '1px solid '+theme.palette.grey[400],
    width: '100%',
    // pageBreakInside: 'avoid'
  },
  th: {
    margin: 0,
    padding: '0.25rem',
    borderBottom: '1px solid '+theme.palette.grey[400],
    borderRight: '1px solid '+theme.palette.grey[400],
    pageBreakAfter: 'auto',
    textAlign: 'left',
  },
  td: {
    margin: 0,
    padding: '0.125rem 0.25rem',
    borderRight: '1px solid '+theme.palette.grey[400],
    pageBreakAfter: 'auto',
    wordBreak: 'break-all',
    verticalAlign: 'top',
    borderBottom: '1px dotted '+theme.palette.grey[400],
  },
  tf: {
    margin: 0,
    padding: '0.25rem',
    borderTop: '1px solid '+theme.palette.grey[400],
    borderRight: '1px solid '+theme.palette.grey[400],
    // pageBreakInside: 'avoid',
    pageBreakAfter: 'auto'
  },
  tr: {
    // pageBreakInside: 'avoid',
    pageBreakAfter: 'auto'
  },
  thead: {
    display: 'table-row-group',
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

export function ReportTableRow(props) {
  const classes = useStyles();
  return (
    <tr {...props} className={classes.tr} />
  );
}

export function ReportTableData({footer=false, header=false, last=false, lastRow=false, ...props}) {
  const classes = useStyles();
  let finalClasses = null;
  if(footer) {
    finalClasses = [classes.tf];
    last && finalClasses.push(classes.noBorderRight);
  } else if(header) {
    finalClasses = [classes.th];
    last && finalClasses.push(classes.noBorderRight);
  } else {
    finalClasses = [classes.td];
    last && finalClasses.push(classes.noBorderRight);
    lastRow && finalClasses.push(classes.noBorderBottom);
  }
  if(header) {
    return (
      <th {...props} className={clsx(finalClasses)} />
    );
  }
  return (
    <td {...props} className={clsx(finalClasses)} />
  );
}

export function ReportTableSection({head=false, foot=false, ...props}) {
  const classes = useStyles();
  if(head) {
    return <thead {...props} className={classes.thead} />;
  } else if(foot) {
    return <thead {...props} className={classes.thead} />;
  } else {
    return <tbody {...props} />;
  }
}


export function ReportTable({children, ...props}) {
  const classes = useStyles();
  if(props.columns) {
    return <ReactTable {...props} />
  } else {
    return <table className={classes.table} {...props}>{children}</table>;
  }
}

function ReactTable({ columns, data, showFooter, style }) {
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
    <ReportTable {...getTableProps()} style={style}>
      <ReportTableSection head>
        {headerGroups.map(headerGroup => (
          <ReportTableRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column,i)=> (
              <ReportTableData header {...column.getHeaderProps()}  width={column.width} last={i==headerGroup.headers.length-1 }>
                 {column.render('Header')}
              </ReportTableData>
            ))}
          </ReportTableRow>
        ))}
      </ReportTableSection>
      <ReportTableSection {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <ReportTableRow {...row.getRowProps()} >
              {row.cells.map((cell, j) => {
                return <ReportTableData {...cell.getCellProps()} last={j===row.cells.length-1} lastRow={i==rows.length-1}>
                  {cell.render('Cell')}
                </ReportTableData>
              })}
            </ReportTableRow>
          )
        })}
      </ReportTableSection>
      {showFooter &&
        <ReportTableSection foot>
          {footerGroups.map(group => (
            <ReportTableRow {...group.getFooterGroupProps()}>
              {group.headers.map((column, i) => {
                return <ReportTableData footer last={i==group.headers.length-1} {...column.getFooterProps()}>
                  {column.render('Footer')}
                </ReportTableData>
              })}
            </ReportTableRow>
          ))}
      </ReportTableSection>}
    </ReportTable>
  );
}

export function DashedDivider() {
  const classes = useStyles();
  return (
    <Box className={classes.dashedDivier}></Box>
  )
}

export function ReportField({name, value, margin, style}) {
  return (
    <Typography style={margin ? {marginRight: '0.5rem', ...style} : style}>
      <span style={{fontWeight: 'bold'}}>{name}: </span>{value}
    </Typography>
  )
}

export function NoData() {
  return (
    <Box textAlign="center">
      <Typography>---- No Data ----</Typography>
    </Box>
  )
}

const headerProps = (props, { column }) => getStyles(props, column.align)

const cellProps = (props, { cell }) => getStyles(props, cell.column.align)

const getStyles = (props, align = 'left') => [
  props,
  {
    style: {
      justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
      alignItems: 'flex-start',
      display: 'flex',
    },
  },
]

const useBillStyles = makeStyles((theme)=>({
  table: {
    borderSpacing: 0,
    border: '1px solid '+theme.palette.grey[400],
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  th: {
    margin: 0,
    padding: '0.25rem',
    borderBottom: '1px solid '+theme.palette.grey[400],
    borderRight: '1px solid '+theme.palette.grey[400],
    pageBreakAfter: 'auto',
    textAlign: 'left',
  },
  td: {
    margin: 0,
    padding: '0.125rem 0.25rem',
    borderRight: '1px solid '+theme.palette.grey[400],
    pageBreakAfter: 'auto',
    wordBreak: 'break-all',
    verticalAlign: 'top',
  },
  tdNogrow:{
    flexGrow: '0 !important',
  },
  tbody: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  tf: {
    margin: 0,
    padding: '0.25rem',
    borderTop: '1px solid '+theme.palette.grey[400],
    borderRight: '1px solid '+theme.palette.grey[400],
    // pageBreakInside: 'avoid',
    pageBreakAfter: 'auto'
  },
  tr: {
    // pageBreakInside: 'avoid',
    pageBreakAfter: 'auto'
  },
}));


export function BillTable({ columns, data, style }) {
  // Use the state and functions returned from useTable to build your UI
  const classes = useBillStyles();
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
  }, useFlexLayout);

  return (
    <div {...getTableProps()} className={classes.table} style={style}>
      <div>
        {headerGroups.map(headerGroup => (
          <div
            {...headerGroup.getHeaderGroupProps()}
            className={classes.tr}
          >
            {headerGroup.headers.map(column => (
              <div {...column.getHeaderProps(headerProps)} className={classes.th}>
                {column.render('Header')}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className={classes.tbody} {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <>
            <div {...row.getRowProps()} className={clsx(classes.tr, i==rows.length-1 ? null : classes.tdNogrow)}>
              {row.cells.map(cell => {
                return (
                  <div {...cell.getCellProps(cellProps)} className={classes.td}>
                    {cell.render('Cell')}
                  </div>
                )
              })}
            </div>
            </>
          )
        })}
      </div>
    </div>
  )
}