import React, { useMemo } from "react";
import { TableDataProps, TableProps } from "../interfaces";
import { useTable, useSortBy, CellValue, Column } from "react-table";
import "./table.scss";

type CellReturn = number | string;

const Table = ({ data }: TableProps) => {
  const columns: Column<TableDataProps>[] = useMemo(() => [
    {
      Header: "Coin Name",
      accessor: "fullName",
    },
    {
      Header: "Current Price (USD)",
      accessor: "currPrice",
      Cell: ({ row: { original } }: CellValue): CellReturn => {
        if (original.currPrice) {
          return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(original.currPrice);
        } else {
          return "no data";
        }
      }
    },
    {
      Header: "Opening Price (USD)",
      accessor: "openPrice",
      Cell: ({ row: { original } }: CellValue): CellReturn => {
        if (original.openPrice) {
          return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(original.openPrice);
        } else {
          return "no data";
        }
      }
    },
    {
      Header: "Price Increase",
      accessor: (row: TableDataProps) => {
        const diff = row.currPrice - row.openPrice;
        if (!isNaN(diff)) {
          return diff;
        }
      },
      Cell: ({ row: { original } }: CellValue): CellReturn => {
        const diff = original.currPrice - original.openPrice;
        if (diff === 0) {
          return 0;
        } else if (diff) {
          return `${(diff / original.openPrice * 100).toFixed(3)}% ($${diff.toFixed(2)})`;
        } else {
          return "no data";
        }
      }
    }
  ], []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(
    {
      columns,
      data
    },
    useSortBy
  );

  return (
    <div className="table-stats">
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""
                    }
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(
            (row, _i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    )
                  })}
                </tr>
              )
            }
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
