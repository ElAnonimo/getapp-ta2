import React, { useState, useEffect, useMemo } from "react";
import { AxiosResponse } from "axios";
import Select from "react-select";
import { TableDataProps } from "./interfaces";
import Table from "./components/Table";
import api from "./api";
import { styles } from "./utils/selectStyles";
import "./App.scss";

const App = () => {
  const [coinList, setCoinList] = useState<Object[]>([]);
  const [tableData, setTableData] = useState<TableDataProps[]>([]);
  const [coinSymbolList, setCoinSymbolList] = useState<String[]>([]);

  useEffect(() => {
    const getCoinList = async () => {
      try {
        const coins: AxiosResponse = await api.get("/all/coinlist");
        // guys it's 7318 coins CryptoCompare lists I had to cap it at 100
        // also they don't provide static types for the coins so I settled for [{}]
        const coinData = (Object.values(coins.data.Data) as [{}]).slice(0, 100);
        setCoinList(coinData);
      } catch(ex: unknown) {
        if (ex instanceof Error) {
          console.log("Error fetching coin list:", ex.message);
        }
      }
    };

    void getCoinList();
  }, []);

  const options = useMemo(() => coinList.map((item: any) => ({
    label: item.FullName,
    value: item.Symbol
  })), [coinList]);

  useEffect(() => {
    const fsyms = coinSymbolList.join();
    const tableStats: TableDataProps[] = [];

    const getTableData = async () => {
      try {
        // notice this one endpoint returns values in random order
        const stats: AxiosResponse = await api.get(`/pricemultifull?fsyms=${fsyms}&tsyms=USD`);

        for (const item in stats.data.RAW) {
          tableStats.unshift({
            fullName: options.find(opt => opt.value === item)?.label,
            currPrice: stats.data.RAW[item].USD.PRICE,
            openPrice: stats.data.RAW[item].USD.OPENDAY
          });
        }

        setTableData(tableStats);
      } catch(ex) {
        if (ex instanceof Error) {
          console.log("Error fetching coin price data:", ex.message);
        }
      }
    };

    void getTableData();
  }, [options, coinSymbolList]);

  const handleCoinSymbolChange = (coinSymbol: string) => {
    // coinSymbol is undefined on clear the selected coin
    if (coinSymbol && !coinSymbolList.includes(coinSymbol)) {
      if (coinSymbolList.length < 10) {
        setCoinSymbolList(list => [coinSymbol, ...list]);
      } else {
        coinSymbolList.unshift(coinSymbol);
        coinSymbolList.pop();
        setCoinSymbolList([...coinSymbolList]);
      }
    }
  };

  return (
    <div className="App">
      <div className="App-container">
        <Select
          isClearable
          options={options}
          styles={styles}
          placeholder="select coin"
          onChange={(item: any) => handleCoinSymbolChange(item?.value)}
        />
        <Table data={tableData} />
      </div>
    </div>
  );
};

export default App;
