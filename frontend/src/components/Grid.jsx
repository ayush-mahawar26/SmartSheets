import React from 'react'
import Spreadsheet from "react-spreadsheet";
import { useState, useEffect} from "react";
import "./Appbar.css";

const Grid = () => {

    const [PrevSelection, setPrevSelection] = useState();

    

    let rows = 100;
    let columns = 26;
    let cells = Array(rows).fill().map(() => Array(columns).fill().map(() => ({ value: "" })));
    const [data, setData] = useState(cells);

    const [FuncText, setFuncText] = useState("");
    const [formulaBarData, setFormulaBarData] = useState({ rowNum: null, colNum: null, value: "" });

    const handleCellClick = (cell) => {
        if(cell.range === undefined) return;
        setPrevSelection(cell);
        console.log(cell);
		console.log("start: ", cell.range.start.row, cell.range.start.column);
		console.log("end: ", cell.range.end.row, cell.range.end.column);
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

  const sortSelectedData = () => {
    const { start, end } = PrevSelection.range;
    let startRow = start.row;
    let startCol = start.column;
    let endRow = end.row;
    let endCol = end.column;
    // create a temp array to store the selected data

    console.log(startRow, startCol, endRow, endCol);

    let temp = [];

    for (let i = startRow; i <= endRow; i++) {
        let row = [];
        for (let j = startCol; j <= endCol; j++) {
            row.push(data[i][j].value);
        }
        temp.push(row);
    }
    console.log(temp);
    if(temp[0].length > 1 && temp.length==1) {
        temp[0].sort((a, b) => parseFloat(a) - parseFloat(b));
    }
    else if(temp.length > 1 && temp[0].length == 1){
        let temp1 = [];
        for(let i = 0; i < temp.length; i++){
            temp1.push(temp[i][0]);
        }
        temp1.sort();
        for(let i = 0; i < temp1.length; i++){
            temp[i][0] = temp1[i];
        }
    }
    else{
        let temp1 = [];
        for(let i=0; i<temp.length; i++){
            for(let j=0; j<temp[0].length; j++){
                temp1.push(temp[i][j]);
            }
        }
        temp1.sort((a, b) => parseFloat(a) - parseFloat(b));
        for(let i=0; i<temp.length; i++){
            for(let j=0; j<temp[0].length; j++){
                temp[i][j] = temp1[i*temp[0].length + j];
            }
        }
    }

    console.log(temp);
    
    //use the setData function to update the data at those specific cells
    let newData = [...data];

    for (let i = startRow; i <= endRow; i++) {
        for (let j = startCol; j <= endCol; j++) {
            newData[i][j].value = temp[i - startRow][j - startCol];
        }
    }

    setData(newData);
    console.log(data);
};

//whenever there is a change in data, call a use effect to display the updated data
    useEffect(() => {
        console.log("updated");
    }, [data]);

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
            <button onClick={sortSelectedData} className="ml-12 flex justify-center items-center h-full w-screen rounded-l-full m">
                fx
                <input
                onChange={handleChange}
                className="focus:outline-none ml-8 h-full w-screen bg-[#EAF1FF]"
                placeholder="   Enter formula here"
                value={FuncText}
                />
            </button>
            </div>
        </div>

        <Spreadsheet className='mt-12' data={data} onChange={handleDataChange} onSelect={(selected) => handleCellClick(selected)} />
    </div>
  )
}

export default Grid