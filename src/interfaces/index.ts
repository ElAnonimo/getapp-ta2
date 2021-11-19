export interface TableDataProps {
  fullName: string;
  currPrice: number;
  openPrice: number;
}

export interface TableProps {
  data: TableDataProps[];
}
