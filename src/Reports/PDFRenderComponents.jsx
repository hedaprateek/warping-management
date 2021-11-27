import { useTheme } from '@material-ui/core';
import { Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import _ from 'lodash';

const useReportTableStyles = (theme)=>StyleSheet.create({
  table: {
    flexDirection: 'column',
    border: '1px solid #999999',
    boxSizing: 'border-box',
  },
  header: {
    fontWeight: 'bold',
    boxSizing: 'border-box',
  },
  row: {
    // flexDirection: 'row'
    flexDirection: 'row',
    borderBottomColor: '#bff0fd',
    boxSizing: 'border-box',
  },
  cell: {
    padding: '0.25rem 0.25rem',
    borderRight: '1px solid #999999',
    wordBreak: 'break-all',
    verticalAlign: 'top',
    borderBottom: '1px dotted #999999',
    boxSizing: 'border-box',
  },
  noBorderBottom: {
    borderBottom: 0,
  },
  noBorderRight: {
    borderRight: 0,
  },
});

export function ReportTable({columns=[], rows=[]}) {
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
          return <ReportTableCell column={col} header last={ci===headerCols.length-1} />
        })}
      </ReportTableRow>
      {(rows||[]).map((row, ri)=>{
        return (
          <ReportTableRow>
          {columns.map((col, ci)=>{
            return <ReportTableCell column={col} row={row} last={ci===columns.length-1} lastRow={ri==rows.length-1} />
          })}
          </ReportTableRow>
        );
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
  /* Spanned */
  if(column.columns) {
    if(header) {
      return <ReportTableRow>
        {column.columns.map((sCol, ci)=><Cell column={sCol} value={sCol.name} header={header}
          last={last && ci==column.columns.length-1}/>)}
      </ReportTableRow>
    } else {
      let pivotCols = column.pivot;
      let pivotValue = row[column.columns[0].key];
      let otherCols = column.columns.slice(1);
      let dummyLen = column.columns[0].pivotDataLength - pivotValue.length;
      return <View>
        {pivotCols.map((col, pi)=>{
          let cells = [];
          cells.push([col, col.name]);
          pivotValue?.map((row, ri)=>{
            cells.push([col, row[col.key]]);
          });
          (new Array(dummyLen).fill(0)).map(()=>{
            cells.push([col, '']);
          })
          otherCols.map((ocol)=>{
            cells.push([ocol, row?.[ocol.key]?.[col.key]]);
          });
          return <ReportTableRow>
            {cells.map((cell, ci)=>{
              return <Cell header={ci==0} column={cell[0]} value={cell[1]}
                last={last && ci==cells.length-1} lastRow={lastRow && pi==pivotCols.length-1}/>
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
  const finalStyle = [styles.cell];
  last && finalStyle.push(styles.noBorderRight);
  lastRow && finalStyle.push(styles.noBorderBottom);
  header && finalStyle.push(styles.header);
  column.width && finalStyle.push({width: column.width});
  return <Text style={finalStyle}>
    {value ?? ''}
  </Text>
}