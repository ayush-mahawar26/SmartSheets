import React from "react";
import { useNavigate } from "react-router-dom";
import smartsheets from "../assets/smartsheets.png";
import func from "../assets/function.png";
import "../components/Appbar.css";
import { useEffect, useState, useRef, useCallback } from "react";
import "handsontable/dist/handsontable.full.min.css";
import { registerAllModules } from "handsontable/registry";
import { HotTable } from "@handsontable/react";
import io from "socket.io-client";
import { HyperFormula } from 'hyperformula';
import { useParams } from 'react-router-dom';


const Test = () => {
  const navigate = useNavigate();


  const handleHome = () => {
    navigate("/");
  };

  const hyperformulaInstance = HyperFormula.buildEmpty({
    licenseKey: 'internal-use-in-handsontable',
  });

  const hotRef = useRef(null);

  const [Tab, setTab] = useState("Edit");
  const [FileName, setFileName] = useState("Untitled Spreadsheet");
  const [copiedData, setCopiedData] = useState([]);
  const [PrevSelection, setPrevSelection] = useState();
  const [Coordinate, setCoordinate] = useState("____");
  const [FuncText, setFuncText] = useState("");
  const [formulaBarData, setFormulaBarData] = useState({
    rowNum: null,
    colNum: null,
    value: "",
  });
  const [History, setHistory] = useState([]);
  const [Current, setCurrent] = useState(0);

  // ------------------------> Edit Functions <------------------------
  const handleUndo = () => {
    if (hotRef.current) {
      hotRef.current.hotInstance.undo();
    } else {
      console.error('Handsontable instance is not available');
    }
  };

  const handleRedo = () => {
    if (Current < History.length - 1) {
      let hist = [...History];
      setData(hist[Current + 1]);
      setCurrent(Current + 1);
    }
  };

  const sortSelectedData = () => {
    const { start, end } = PrevSelection.range;
    let startRow = start.row;
    let startCol = start.column;
    let endRow = end.row;
    let endCol = end.column;

    let temp = [];

    for (let i = startRow; i <= endRow; i++) {
      let row = [];
      for (let j = startCol; j <= endCol; j++) {
        row.push(data[i][j].value);
      }
      temp.push(row);
    }
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

    let newData = [...data];

    for (let i = startRow; i <= endRow; i++) {
      for (let j = startCol; j <= endCol; j++) {
        newData[i][j].value = temp[i - startRow][j - startCol];
      }
    }

    setData(newData);
  };

  const handleCopy = () => {
    const { start, end } = PrevSelection.range;
    let startRow = start.row;
    let startCol = start.column;
    let endRow = end.row;
    let endCol = end.column;

    let temp = [];

    let cellData = [...data];
    for (let i = startRow; i <= endRow; i++) {
      let row = [];
      for (let j = startCol; j <= endCol; j++) {
        row.push(cellData[i][j]);
      }
      temp.push(row);
    }

    setCopiedData(temp);
  };

  const handlePaste = () => {
    const { start } = PrevSelection.range;
    let startRow = start.row;
    let startCol = start.column;

    let newData = [...data];

    for (let i = 0; i < copiedData.length; i++) {
      for (let j = 0; j < copiedData[i].length; j++) {
        if (startRow + i < rows && startCol + j < columns) {
          newData[startRow + i][startCol + j] = copiedData[i][j];
        }
      }
    }

    setData(newData);
  };
  const { sheetId } = useParams();

  const handleDelete = () => {
    const { start, end } = PrevSelection.range;
    let startRow = start.row;
    let startCol = start.column;
    let endRow = end.row;
    let endCol = end.column;

    let temp = [];

    let cellData = [...data];
    for (let i = startRow; i <= endRow; i++) {
      for (let j = startCol; j <= endCol; j++) {
        cellData[i][j] = "";
      }
    }

    setCopiedData(temp);
  };

  //------------------------------------> File Functions <-----------------------------------

  const convertToCSV = (data) => {
    return data
      .map((row) => row.map((cell) => cell.value).join(","))
      .join("\n");
  };

  const downloadCSV = () => {
    const csvData = convertToCSV(data);
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "spreadsheet.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleRename = () => {
    const newName = prompt("Enter New File Name");
    if (newName) {
      setFileName(newName);
    }
  };

  const handleNewFile = () => {
    const id = uuidv4();
    navigate(`/sheet/${id}`);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const contents = e.target.result;
        const rows = contents.split("\n");
        let newData = rows.map((row) => row.split(","));
        newData = newData.map((row) => row.map((cell) => ({ value: cell })));
        setData(newData);
      };

      reader.readAsText(file);
    };
    input.click();
  };

  registerAllModules();

  const [Data, setData] = useState([]);
  const [socket, setSocket] = useState(null);
  // const sheetId = 4;

  const handleAfterChange = (changes) => {
    if (changes) {
      const newData = [...Data];
      changes.forEach(([row, col, oldValue, newValue]) => {
        if (newValue !== oldValue) {
          newData[row][col] = newValue;
        }
      });
      setData(newData);
      socket.emit("save-document", { sheetId, data: newData });
    }
  };
  useEffect(() => {
    let rows = 100;
    let columns = 50;
    let data = [];
    for (let i = 0; i < rows; i++) {
      let row = [];
      for (let j = 0; j < columns; j++) {
        row.push("");
      }
      data.push(row);
    }
    setData(data);
  }, []);


  useEffect(() => {
    const s = io("http://localhost:3000");
    setSocket(s);

    s.emit("joinSheet", { sheetId });

    s.on("load-document", (loadedData) => {
      setData(loadedData);
    });

    s.on("document-updated", ({ data: updatedData }) => {
      setData(updatedData);
    });

    return () => {
      s.disconnect();
    };
  }, [sheetId]);

  return (
    <div>
      {/* Navbar */}

      <div className="navbar mb-24 h-44">
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
          <button
            onClick={(e) => {
              setTab("File");
            }}
            className={`${
              Tab === "File" ? "font-bold text-blue-500" : ""
            } flex flex-col h-8 mr-8 mt-6 hover:text-blue-500`}
          >
            File
          </button>
          <button
            onClick={(e) => {
              setTab("Edit");
            }}
            className={`${
              Tab === "Edit" ? "font-bold text-blue-500" : ""
            } flex flex-col h-8 mr-8 mt-6 hover:text-blue-500`}
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              setTab("View");
            }}
            className={`${
              Tab === "View" ? "font-bold text-blue-500" : ""
            } flex flex-col h-8 mr-8 mt-6 hover:text-blue-500`}
          >
            View
          </button>
          <button
            onClick={(e) => {
              setTab("Insert");
            }}
            className={`${
              Tab === "Insert" ? "font-bold text-blue-500" : ""
            } flex flex-col h-8 mr-8 mt-6 hover:text-blue-500`}
          >
            Insert
          </button>
        </div>

        {/* search */}
        <div className="div4">
          <input
            className="focus:caret-transparent focus:outline-none rounded-full h-10 w-[35rem] bg-[#EAF1FF] text-[rgba(0,0,0,0.5)] mt-5 text-center placeholder-center"
            value={FileName}
          />
        </div>

        {/* tabs */}
        <div className="div5 flex gap-6">
          <button
            onClick={(e) => {
              setTab("Collaborate");
            }}
            className={`${
              Tab === "Collaborate" ? "font-bold text-blue-500" : ""
            } flex flex-col h-8 mr-8 mt-6 hover:text-blue-500`}
          >
            Collaborate
          </button>
          <button
            onClick={(e) => {
              setTab("Comments");
            }}
            className={`${
              Tab === "Comments" ? "font-bold text-blue-500" : ""
            } flex flex-col h-8 mr-8 mt-6 hover:text-blue-500`}
          >
            Comments
          </button>
          <button
            onClick={(e) => {
              setTab("Share");
            }}
            className={`${
              Tab === "Share" ? "font-bold text-blue-500" : ""
            } flex flex-col h-8 mr-8 mt-6 hover:text-blue-500`}
          >
            Share
          </button>
        </div>

        {/* main functions */}

        {Tab === "File" && (
          <div className="div6 flex h-14 gap-6">
            <button
              onClick={handleNewFile}
              className="hover:bg-blue-100 border p-4 rounded w-32 bg-[#EAF1FF]"
            >
              New File
            </button>
            <button
              onClick={downloadCSV}
              className="hover:bg-blue-100 border rounded p-4 bg-[#EAF1FF] w-32"
            >
              Download
            </button>
            <button
              onClick={handleImport}
              className="hover:bg-blue-100 border rounded p-4 bg-[#EAF1FF] w-32"
            >
              Import CSV
            </button>
            <button
              onClick={handleRename}
              className="hover:bg-blue-100 border rounded p-4 bg-[#EAF1FF] w-32"
            >
              Rename
            </button>
          </div>
        )}

        {Tab === "Edit" && (
          <div className="div6 flex h-14 gap-6">
            <button
              onClick={handleUndo}
              className="hover:bg-blue-100 border p-4 rounded w-32 bg-[#EAF1FF]"
            >
              Undo
            </button>
            <button
              onClick={handleRedo}
              className="hover:bg-blue-100 border p-4 rounded w-32 bg-[#EAF1FF]"
            >
              Redo
            </button>
            <button
              onClick={sortSelectedData}
              className="hover:bg-blue-100 border p-4 rounded w-32 bg-[#EAF1FF]"
            >
              Sort
            </button>
            <button
              onClick={handleCopy}
              className="hover:bg-blue-100 border rounded p-4 bg-[#EAF1FF] w-32"
            >
              Copy
            </button>
            <button
              onClickCapture={handlePaste}
              className="hover:bg-blue-100 border rounded p-4 bg-[#EAF1FF] w-32"
            >
              Paste
            </button>
            <button
              onClick={handleDelete}
              className="hover:bg-blue-100 border rounded p-4 bg-[#EAF1FF] w-32"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Formula Bar */}
      <div>
        .
        <div className="mt-36">
          <div className="formula fixed bg-[#EAF1FF] h-12 w-screen flex items-center text-[1rem] rounded">
            <input
              value={Coordinate}
              readOnly={true}
              className="focus:caret-transparent focus:outline-none ml-8 h-full w-16 bg-[#EAF1FF] shadow-[rgba(0,0,0,0.1)_1px_0px_0px_0px]"
            ></input>
            <div
              value={Coordinate}
              className="ml-9 flex justify-center items-center h-full w-screen rounded-l-full m"
            >
              <img src={func} alt="func" className="h-8 w-8" />
              <input
                className="focus:outline-none ml-6 h-full w-screen bg-[#EAF1FF]"
                placeholder="Enter formula here"
                value={FuncText}
              />
            </div>
          </div>
        </div>
      </div>
      <HotTable className="mt-48"
        settings={
          {
            ref: hotRef,
            contextMenu: true,
            afterChange: handleAfterChange,
            data: Data,
            rowHeaders: true,
            colHeaders: true,
            height: "auto",
            autoWrapRow: true,
            autoWrapCol: true,
            licenseKey: "non-commercial-and-evaluation",
            rowHeaderWidth: 50,
            manualColumnResize: true,
            manualRowResize: true,
            rowHeights: 30,
            colWidths: 100,
            copyPaste: true,
        }}
        formulas={
          {
            engine: hyperformulaInstance,
          }
        }
      />
    </div>
  );
};

export default Test;
