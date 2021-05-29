import { makeStyles } from "@material-ui/core";
import { matchSorter } from "match-sorter";
import React, { useEffect } from "react";
import { useAsyncDebounce, useFilters, useGlobalFilter, useSortBy, useTable } from 'react-table';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import clsx from 'clsx';

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}

const useStyles = makeStyles((theme) => ({
  th: {
    backgroundColor: theme.palette.primary.main,
     color: theme.palette.primary.contrastText,
    '& th': {
      fontWeight: 'normal',
      borderBottom: '2px solid ' + theme.palette.primary.main,
      borderTop: '2px solid ' + theme.palette.primary.main,
    },
  },
  tr: {
    // '&:nth-of-type(odd)': {
    //   backgroundColor: theme.palette.primary.,
    // },
    '&:nth-of-type(even)': {
      backgroundColor: theme.palette.primary.light,
    },
  },
  table: {
    width: '100%',
    // border: '1px solid',
    borderSpacing: 0,
    // borderTop: '1px solid ' + theme.palette.grey[400],
  },
  cell: {
    margin: 0,
    padding: '0 10px',
    borderBottom: '1px solid ' + theme.palette.grey[400],
    borderRight: '1px solid ' + theme.palette.grey[400],
    '&:last-child': {
      borderRight: 0,
    },
    textAlign: 'left',
  },
  actionBtn: {
    width: '30px',
  },
}));

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = val => !val
function TableComponent(props) {
  const filter = ""; // TODO : Later for filtering

  //    const defaultColumn = React.useMemo(
  //   () => ({
  //     // Let's set up our default Filter UI
  //     Filter: DefaultColumnFilter,
  //   }),
  //   []
  // )

  const classes = useStyles();

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable(
    { columns: props.columns, data: props.data },
    useFilters,
    useGlobalFilter, useSortBy);

  useEffect(()=>{
    setGlobalFilter(props.filterText);
  }, [props.filterText])

  return (
    <div>
      <table {...getTableProps()} className={classes.table}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className={classes.th}>
              {headerGroup.headers.map((column) => {
                let actionBtn = column?.id.startsWith('btn-');
                return (
                  <th
                    {...column.getHeaderProps(
                      actionBtn ? {} : column.getSortByToggleProps()
                    )}
                    className={clsx(
                      classes.cell,
                      actionBtn ? classes.actionBtn : null
                    )}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div>{column.render('Header')}</div>
                      <div>
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <KeyboardArrowDownIcon />
                          ) : (
                            <KeyboardArrowUpIcon />
                          )
                        ) : (
                          <KeyboardArrowDownIcon
                            style={{ visibility: 'hidden' }}
                          />
                        )}
                      </div>
                    </div>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className={classes.tr}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()} className={classes.cell}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TableComponent;