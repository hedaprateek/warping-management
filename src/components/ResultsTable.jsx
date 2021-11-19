import { useCallback, useEffect, useMemo, useState } from 'react';
import DataGrid from 'react-data-grid';
import _ from 'lodash';
import { IconButton, makeStyles } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles((theme)=>({
  root: {
    height: '100%',
    color: theme.palette.text.primary,
    backgroundColor: '#fff',
    border: '1px solid ' + theme.palette.grey[300],
    '& .rdg-cell': {
      // ...theme.mixins.panelBorder.right,
      // ...theme.mixins.panelBorder.bottom,
      fontWeight: 'abc',
      '&[aria-selected=true]': {
        boxShadow: `inset 0 0 0 1.5px ${theme.palette.primary.main}`,
      },
      padding: '0px 10px',
      borderRight: '1px solid ' + theme.palette.grey[300],
      borderBottom: '1px solid ' + theme.palette.grey[300],
      '&:last-child': {
        borderRight: 0,
      },
    },
    '& .rdg-header-row': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
    '& .rdg-row': {
      backgroundColor: theme.palette.background.default,
      '&[aria-selected=true]': {
        backgroundColor: theme.palette.primary.light,
        '& .rdg-cell:nth-child(1)': {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        }
      },
      '&:hover': {
        backgroundColor: theme.palette.primary.light,
      }
    },
    '& .rdg-row-even': {
      // backgroundColor: theme.palette.primary.light,
    },
    '& .rdg-row-odd': {

    },
  },
}));

export function ResultsTable({rows, columns, rowKey='id', hasEdit=true, onEditClick, defaultSort=[], filterText=''}) {
  const classes = useStyles();
  const [formattedColumns, setColumns] = useState([]);
  const [sortColumns, setSortColumns] = useState(defaultSort||[]);
  const onSortColumnsChange = useCallback((sortColumns) => {
    setSortColumns(sortColumns.slice(-1));
  }, []);
  useEffect(()=>{
    let newColumns = columns.map((c)=>({
      ...c,
      sortable: c.sortable ?? true,
      resizable: c.resizable ?? true,
    }));
    if(hasEdit) {
      newColumns.unshift({
        key: 'btn-edit',
        name: '',
        minWidth: 45,
        width: 45,
        frozen: true,
        resizable: false,
        formatter: ({row})=>{
          return (
            <IconButton
              onClick={() => {
                onEditClick && onEditClick(row);
              }}
            >
              <EditIcon />
            </IconButton>
          );
        }
      })
    }
    setColumns(newColumns);
  }, [columns, rows]);

  const sortedRows = useMemo(()=>{
    if (sortColumns.length === 0) return rows;
    const { columnKey, direction } = sortColumns[0];
    const column = _.find(formattedColumns, (c)=>c.key==columnKey);

    let sortedRows = [...rows];
    sortedRows = sortedRows.sort((a, b) => {
      let aVal = a[columnKey], bVal = b[columnKey];
      if(_.isFunction(column?.formatter) && (column.sortFormatter ?? true)) {
        aVal = column.formatter({row: a, column: column});
        bVal = column.formatter({row: b, column: column});
      }
      if(_.isNull(aVal) || _.isUndefined(aVal) || _.isUndefined(bVal) || _.isUndefined(bVal)) {
        return 0;
      } else if(aVal.localeCompare) {
        return aVal.localeCompare(bVal);
      } else {
        return (aVal - bVal);
      }
    });
    return direction === 'DESC' ? sortedRows.reverse() : sortedRows;
  }, [rows, sortColumns, formattedColumns]);


  const filteredRows = useMemo(()=>{
    if(!filterText) {
      return sortedRows;
    }
    let filteredRows = [...sortedRows];
    filteredRows = sortedRows.filter((r) => {
      return Object.keys(r).some((key)=>{
        const column = _.find(formattedColumns, (c)=>c.key==key);
        let cellValue = r[key];
        if(!column) return false;
        if(column.formatter) {
          cellValue = column.formatter({row: r, column: column});
        }
        if(_.isNull(cellValue) || _.isUndefined(cellValue)) return false;
        return cellValue.toString().toLowerCase().indexOf(filterText.toLowerCase()) > -1;
      });
    });
    return filteredRows;
  }, [sortedRows, filterText])

  return <DataGrid
    rowKeyGetter={(row)=>row[rowKey]}
    rows={filteredRows}
    columns={formattedColumns}
    sortColumns={sortColumns}
    onSortColumnsChange={onSortColumnsChange}
    className={classes.root}
    rowHeight={28}
    minColumnWidth={30}
  />
}