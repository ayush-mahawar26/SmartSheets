import React from 'react'
import Spreadsheet from "react-spreadsheet";
import { useState, useEffect} from "react";
import "./Appbar.css";

const Grid = () => {

    let rows = 100;
    let columns = 26;
    let cells = Array(rows).fill().map(() => Array(columns).fill().map(() => ({ value: "" })));
    const [data, setData] = useState(cells);

    const [FuncText, setFuncText] = useState("");
    const [formulaBarData, setFormulaBarData] = useState({ rowNum: null, colNum: null, value: "" });


    const handleCellClick = (cell) => {
        if(cell.range === undefined) return;
        // console.log(cell);
		console.log("start: ", cell.range.start.row, cell.range.start.column);
		console.log(data[cell.range.start.row][cell.range.start.column]);

        let rowNum = cell.range.start.row;
        let colNum = cell.range.start.column;
        let value = data[rowNum][colNum].value;

        setFuncText(data[cell.range.start.row][cell.range.start.column].value);
        setFormulaBarData({ rowNum, colNum, value });
    };

    const handleDataChange = (newData) => {
        setData(newData);
    };

    const handleChange = (e) => { 
        setFuncText(e.target.value);
    setFormulaBarData({ ...formulaBarData, value: e.target.value });
  };


     useEffect(() => {
        const { rowNum, colNum, value } = formulaBarData;
        if (rowNum !== null && colNum !== null) {
          const updatedData = [...data];
          updatedData[rowNum][colNum] = { value };
          setData(updatedData);
        }
      }, [formulaBarData]);

      useEffect(() => {
        const { rowNum, colNum } = formulaBarData;
        if (rowNum !== null && colNum !== null) {
          const value = data[rowNum][colNum].value;
          setFuncText(value);
        }
      }, [data]);

  return (
    <div>

        .
        <div className="mt-36">
            <div className="formula fixed bg-[#EAF1FF] h-12 w-screen flex items-center text-[1rem] rounded">
            <div className="ml-12 flex justify-center items-center h-full w-screen rounded-l-full m">
                fx
                <input
                onChange={handleChange}
                className="focus:outline-none ml-8 h-full w-screen bg-[#EAF1FF]"
                placeholder="   Enter formula here"
                value={FuncText}
                />
            </div>
            </div>
        </div>

        <Spreadsheet className='mt-12' data={data} onChange={handleDataChange} onSelect={(selected) => handleCellClick(selected)} />
    </div>
  )
}

export default Grid