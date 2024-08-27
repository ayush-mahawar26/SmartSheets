import React from 'react'
import Spreadsheet from "react-spreadsheet";
import { useState } from "react";

const Grid = () => {

    let rows = 100;
    let columns = 26;
    let cells = Array(rows).fill().map(() => Array(columns).fill().map(() => ({ value: "" })));
    const [data, setData] = useState(cells);

    const handleCellClick = (cell) => {
        if(cell.range === undefined) return;
        console.log(cell);
		console.log("start: ", cell.range.start.row, cell.range.start.column);
		console.log(data[cell.range.start.row][cell.range.start.column]);

		// console.log("end: ", cell.range.end.row, cell.range.end.column);
		// console.log(data[cell.range.end.row][cell.range.end.column]);
		
    };

    const handleDataChange = (newData) => {
        setData(newData);
    };


  return (
    <div>

        .
        <div className="mt-36">
            <div className="fixed bg-[#EAF1FF] h-12 w-screen flex items-center text-[1rem] rounded">
            <div className="ml-12 flex justify-center items-center h-full w-screen rounded-l-full m">
                fx
                <input
                className="ml-8 h-full w-screen bg-[#EAF1FF]"
                placeholder="   Enter formula here"
                />
            </div>
            </div>
        </div>

        <Spreadsheet className='mt-12' data={data} onChange={handleDataChange} onSelect={(selected) => handleCellClick(selected)} />
    </div>
  )
}

export default Grid