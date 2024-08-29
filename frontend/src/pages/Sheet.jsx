import React from "react";
import Grid from "../components/Grid";
import { useNavigate } from "react-router-dom";
import smartsheets from "../assets/smartsheets.png";
import "../components/Appbar.css";
import { useState, useEffect, useRef } from "react";
import Spreadsheet from "react-spreadsheet";
import func from "../assets/function.png";

const Sheet = () => {
  const navigate = useNavigate();

  const handleHome = () => {
    navigate("/");
  };

  const [PrevSelection, setPrevSelection] = useState();
  const [Coordinate, setCoordinate] = useState("-");
  const [FuncText, setFuncText] = useState("");
  const [formulaBarData, setFormulaBarData] = useState({
    rowNum: null,
    colNum: null,
    value: "",
  });

  let rows = 100;
  let columns = 26;
  let cells = Array(rows)
    .fill()
    .map(() =>
      Array(columns)
        .fill()
        .map(() => ({ value: "" }))
    );
  const [data, setData] = useState(cells);

  const handleCellClick = (cell) => {
    if (cell.range === undefined) {
      setCoordinate("-");
      return;
    }
    setPrevSelection(cell);

    let rowNum = cell.range.start.row;
    let colNum = cell.range.start.column;
    let value = data[rowNum][colNum].value;

    if (
      cell.range.start.row == cell.range.end.row &&
      cell.range.start.column == cell.range.end.column
    ) {
      setCoordinate(String.fromCharCode(65 + colNum) + (rowNum + 1));
    } else {
      setCoordinate(
        String.fromCharCode(65 + cell.range.start.column) +
          (cell.range.start.row + 1) +
          ":" +
          String.fromCharCode(65 + cell.range.end.column) +
          (cell.range.end.row + 1)
      );
    }

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
    if (temp[0].length > 1 && temp.length == 1) {
      temp[0].sort((a, b) => parseFloat(a) - parseFloat(b));
    } else if (temp.length > 1 && temp[0].length == 1) {
      let temp1 = [];
      for (let i = 0; i < temp.length; i++) {
        temp1.push(temp[i][0]);
      }
      temp1.sort();
      for (let i = 0; i < temp1.length; i++) {
        temp[i][0] = temp1[i];
      }
    } else {
      let temp1 = [];
      for (let i = 0; i < temp.length; i++) {
        for (let j = 0; j < temp[0].length; j++) {
          temp1.push(temp[i][j]);
        }
      }
      temp1.sort((a, b) => parseFloat(a) - parseFloat(b));
      for (let i = 0; i < temp.length; i++) {
        for (let j = 0; j < temp[0].length; j++) {
          temp[i][j] = temp1[i * temp[0].length + j];
        }
      }
    }

    console.log(temp);

    let newData = [...data];

    for (let i = startRow; i <= endRow; i++) {
      for (let j = startCol; j <= endCol; j++) {
        newData[i][j].value = temp[i - startRow][j - startCol];
      }
    }

    setData(newData);
    console.log(data);
  };

  const HandleUndo = () => {
    // press ctrl + z to undo
    const event = new KeyboardEvent("keydown", {
      key: "z",
      ctrlKey: true,
      metaKey: true,
    });
    window.dispatchEvent(event);
  };

  const HandleRedo = (second) => {
    third;
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
      <div className="navbar h-44">
        {/* logo */}
        <div className="div1">
          <img
            onClick={handleHome}
            src={smartsheets}
            alt="smartsheets"
            className="cursor-pointer h-16 w-32 mt-10 ml-8"
          />
        </div>

        {/* profile */}
        <div className="div2">
          <button className="rounded-full h-16 w-16 bg-[#EAF1FF] flex justify-center mt-10">
            <div className="flex flex-col justify-center h-full text-xl">
              👤
            </div>
          </button>
        </div>

        {/* tabs */}
        <div className="div3 flex gap-6">
          <button className="flex flex-col h-full mr-8 mt-6">File</button>
          <button className="flex flex-col h-full mr-8 mt-6">Edit</button>
          <button className="flex flex-col h-full mr-8 mt-6">View</button>
          <button className="flex flex-col h-full mr-8 mt-6">Insert</button>
        </div>

        {/* search */}
        <div className="div4">
          <input
            className="rounded-full h-10 w-[35rem] bg-[#EAF1FF] mt-5 placeholder-center"
            placeholder="   Search"
          />
        </div>

        {/* tabs */}
        <div className="div5 flex gap-6">
          <button className="flex flex-col h-full mr-6 mt-6">
            Collaborate
          </button>
          <button className="flex flex-col h-full mr-6 mt-6">Comments</button>
          <button className="flex flex-col h-full mt-6">Share</button>
        </div>

        {/* main functions */}
        <div className="div6 flex h-14 gap-6">
          <button
            onClick={sortSelectedData}
            className="border p-4 rounded w-24 bg-[#EAF1FF]"
          >
            Sort
          </button>
          <button
            onClick={HandleUndo}
            className="border rounded p-4 bg-[#EAF1FF] w-24"
          >
            Undo
          </button>
          <button
            onClick={HandleRedo}
            className="border rounded p-4 bg-[#EAF1FF] w-24"
          >
            Redo
          </button>
        </div>
      </div>

      <div>
        .
        <div className="mt-36">
          <div className="formula fixed bg-[#EAF1FF] h-12 w-screen flex items-center text-[1rem] rounded">
            <input
              value={Coordinate}
              className="focus:outline-none ml-8 h-full w-16 bg-[#EAF1FF] shadow-[rgba(0,0,0,0.1)_1px_0px_0px_0px]"
            ></input>
            <div
              value={Coordinate}
              className="ml-9 flex justify-center items-center h-full w-screen rounded-l-full m"
            >
              <img src={func} alt="func" className="h-8 w-8" />
              <input
                onChange={handleChange}
                className="focus:outline-none ml-6 h-full w-screen bg-[#EAF1FF]"
                placeholder="Enter formula here"
                value={FuncText}
              />
            </div>
          </div>
        </div>
        <Spreadsheet
          className="mt-12"
          data={data}
          onChange={handleDataChange}
          onSelect={(selected) => handleCellClick(selected)}
        />
      </div>
    </div>
  );
};

export default Sheet;
