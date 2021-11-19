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

export function ResultsTable({rows, columns, rowKey='id', hasEdit=true, onEditClick}) {
  const classes = useStyles();
  const [formattedColumns, setColumns] = useState([]);
  const [sortColumns, setSortColumns] = useState([]);
  const onSortColumnsChange = useCallback((sortColumns) => {
    setSortColumns(sortColumns.slice(-1));
  }, []);
  useEffect(()=>{
    let newColumns = [...columns];
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
      if(_.isFunction(column.formatter)) {
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

  return <DataGrid
    rowKeyGetter={(row)=>row[rowKey]}
    rows={sortedRows}
    columns={formattedColumns}
    sortColumns={sortColumns}
    onSortColumnsChange={onSortColumnsChange}
    className={classes.root}
    rowHeight={28}
    minColumnWidth={30}
  />
}