import { useTheme } from '@material-ui/core';
import { Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import _ from 'lodash';

const useReportTableStyles = (theme)=>StyleSheet.create({
  table: {
    flexDirection: 'column',
    border: '1px solid #999999',
  },
  header: {
    fontWeight: 'bold',
  },
  row: {
    // flexDirection: 'row'
    flexDirection: 'row',
    borderBottomColor: '#bff0fd',
  },
  cell: {
    padding: '0.125rem 0.25rem',
    borderRight: '1px solid #999999',
    wordBreak: 'break-all',
    verticalAlign: 'top',
    borderBottom: '1px dotted #999999',
  },
  noBorderBottom: {
    borderBottom: 0,
  },
  noBorderRight: {
    borderRight: 0,
  },
});

export function ReportTable({columns=[], rows=[], children}) {
  const theme = useTheme();
  const styles = useReportTableStyles(theme);
  const headerCols = _.flatMap(columns, (column)=>{
    if(column.columns) {
      return column.columns;
    } else {
      return column;
    }
  });
  return (
    <View style={styles.table}>
      <ReportTableRow>
        {headerCols.map((col, ci)=>{
          return <ReportTableCell column={col} header last={ci===columns.length-1} />
        })}
      </ReportTableRow>
      {rows.map((row, ri)=>{
        return (<ReportTableRow>
        {columns.map((col, ci)=>{
          return <ReportTableCell column={col} row={row} last={ci===columns.length-1} lastRow={ri==rows.length-1} />
        })}
        </ReportTableRow>)
      })}
      {/* {children} */}
    </View>
  );
}

function ReportTableRow({children}) {
  const theme = useTheme();
  const styles = useReportTableStyles(theme);
  return <View style={styles.row}>
    {children}
  </View>
}

function ReportTableCell({column=null, row=null, header=false, last=false, lastRow=false}) {
  const theme = useTheme();
  const styles = useReportTableStyles(theme);


  /* Spanned */
  if(column.columns) {
    if(header) {
      return <ReportTableRow>
        {column.columns.map((sCol)=><Cell column={sCol} value={sCol.name} header={header}/>)}
      </ReportTableRow>
    } else {
      let pivotCols = column.pivot;
      let pivotValue = row[column.columns[0].key];
      let otherCols = column.columns.slice(1);
      let dummyLen = 7;
      return <View>
        {pivotCols.map((col, ci)=>{
          return <ReportTableRow>
            <Cell header column={col} value={col.name} />
            {pivotValue?.map((row, ri)=>{
              return <Cell column={col} value={row[col.key]} />
            })}
            {(new Array(dummyLen).fill(0)).map(()=>{
              return <Cell column={col} value={''} />
            })}
            {otherCols.map((ocol)=>{
              return <Cell column={ocol} value={row?.[ocol.key]?.[col.key]} />
            })}
          </ReportTableRow>
        })}
      </View>
    }
  }

  let value = column.name;
  if(!header) {
    value = row[column.key];
  }
  return <Cell header={header} last={last} lastRow={lastRow} column={column} value={value}/>
}

function Cell({header=false, last=false, lastRow=false, column, value=''}) {
  const theme = useTheme();
  const styles = useReportTableStyles(theme);
  return <Text style={[
    styles.cell,
    last ? styles.noBorderRight : null,
    lastRow ? styles.noBorderBottom : null,
    header ? styles.header : null,
    column.width ? {width: column.width} : null,
  ]}>
    {value}
  </Text>
}