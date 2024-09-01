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
import { v4 as uuid } from 'uuid';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Test = () => {
  const { sheetId } = useParams();
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:3000/user/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          setUserDetails(data);
        })
        .catch(error => {
          console.error('Error fetching user details:', error);
        });
    }
  }, []);

  console.log(userDetails);

  const handleHome = () => {
    navigate("/");
  };

  const handleCollaborate = () => {
    setTab("Collaborate")
    navigate("/collaborate");
  };


  const handleShare = async () => {
    const url = window.location.href;
    await navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
  };

  const hotRef = useRef(null);

  const [Tab, setTab] = useState("Edit");
  const [FileName, setFileName] = useState("Untitled Spreadsheet");
  const [PrevSelection, setPrevSelection] = useState({ range: { start: { row: 0, col: 0 }, end: { row: 0, col: 0 } } });
  const [Coordinate, setCoordinate] = useState("____");
  const [FuncText, setFuncText] = useState("");
  const [CopiedData, setCopiedData] = useState([]);

  // -------------------------------> Edit Functions <-------------------------------

  const handleUndo = () => {
    let hotInstance = hotRef.current.hotInstance;
    hotInstance.undo();
  }

  const sortSelectedData = () => {
    let hotInstance = hotRef.current.hotInstance;
    let selected = hotInstance.getSelected();
    let startRow = selected[0][0];
    let startCol = selected[0][1];
    let endRow = selected[0][2];
    let endCol = selected[0][3];
    console.log(startRow, startCol, endRow, endCol);

    let temp = [];
    for (let i = startRow; i <= endRow; i++) {
      let row = [];
      for (let j = startCol; j <= endCol; j++) {
        row.push(Data[i][j]);
      }
      temp.push(row);
    }

    let array = [];

    if (startRow == endRow) {
      temp[0].sort();
      array = temp[0];
    }
    else if (startCol == endCol) {
      let temp1 = [];
      for (let i = 0; i < temp.length; i++) {
        temp1.push(temp[i][0]);
      }
      temp1.sort();
      array = temp1;
    }

    console.log(temp);

    let idx_i = 0;
    let idx_j = 0;
    for (let i = startRow; i <= endRow; i++) {
      idx_j = startCol;
      for (let j = startCol; j <= endCol; j++) {
        hotInstance.setDataAtCell(i, j, array[idx_j]);
        idx_j++;
      }
      idx_i++;
    }
    toast.success('Data sorted');
  };

  const handleCopy = async () => {
    const hotInstance = hotRef.current.hotInstance;
    hotInstance.getPlugin('CopyPaste').copy(); // Trigger the copy action

    const text = await navigator.clipboard.readText();
    setCopiedData(text.split('\n').map(row => row.split('\t')));
    console.log(CopiedData);
    toast.success('Data copied to clipboard');
  };

  const handlePaste = () => {
    let hotInstance = hotRef.current.hotInstance;
    let selected = hotInstance.getSelected();
    let startRow = selected[0][0];
    let startCol = selected[0][1];
    let endRow = selected[0][2];
    let endCol = selected[0][3];

    console.log(startRow, startCol, endRow, endCol);
    console.log("copied data", CopiedData);

    let idx_i = startRow;
    let idx_j = startCol;

    console.log(CopiedData.length, CopiedData[0].length);

    for (let i = 0; i < CopiedData.length; i++) {
      idx_j = startCol;
      for (let j = 0; j < CopiedData[0].length; j++) {
        hotInstance.setDataAtCell(idx_i, idx_j, CopiedData[i][j]);
        idx_j++;
      }
      idx_i++;
    }
    toast.success('Data pasted');
  };



  const handleDelete = () => {
    let hotInstance = hotRef.current.hotInstance;
    let selected = hotInstance.getSelected();

    let startRow = selected[0][0];
    let startCol = selected[0][1];
    let endRow = selected[0][2];
    let endCol = selected[0][3];

    console.log(startRow, startCol, endRow, endCol);

    for (let i = startRow; i <= endRow; i++) {
      for (let j = startCol; j <= endCol; j++) {
        hotInstance.setDataAtCell(i, j, "");
      }
    }

    // hotInstance.render();
  };

  //------------------------------------> File Functions <-----------------------------------

  const convertToCSV = (data) => {
    return data
      .map((row) => {
        return row.map((cell) => {
          return cell;
        });
      }
      )
      .map((row) => row.join(","))
      .join("\n");
  };

  const downloadCSV = () => {
    const csvData = convertToCSV(Data);
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
      socket.emit("save-document", { sheetId, data: Data, userId: userDetails._id, FileName: newName });
    }
  };

  const handleNewFile = () => {
    const id = uuid();
    setFileName("Untitled Spreadsheet");
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
        const newData = [];
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i].split(",");
          newData.push(row);
        }
        setData(newData);
      };

      reader.readAsText(file);
    };
    input.click();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  }

  const handleInsertRowBelow = () => {
    let hotInstance = hotRef.current.hotInstance;
    hotInstance.alter('insert_row_below', hotInstance.getSelectedLast()[0]);
  }

  const handleInsertRowAbove = () => {
    let hotInstance = hotRef.current.hotInstance;
    hotInstance.alter('insert_row_above', hotInstance.getSelectedLast()[0]);
  }

  const handleRemoveRow = () => {
    let hotInstance = hotRef.current.hotInstance;
    hotInstance.alter('remove_row', hotInstance.getSelectedLast()[0]);
  }

  const handleInsertColumnBefore = () => {
    let hotInstance = hotRef.current.hotInstance;
    hotInstance.alter('insert_col_start', hotInstance.getSelectedLast()[1]);
  }

  const handleInsertColumnAfter = () => {
    let hotInstance = hotRef.current.hotInstance;
    hotInstance.alter('insert_col_end', hotInstance.getSelectedLast()[1]);
  }

  const handleDeleteCol = () => {
    let hotInstance = hotRef.current.hotInstance;
    hotInstance.alter('remove_col', hotInstance.getSelectedLast()[1]);
  }


  const [Data, setData] = useState([]);
  const [socket, setSocket] = useState(null);

  const handleAfterChange = (changes) => {
    if (changes && changes.length > 0) {
      const newData = [...Data];
      changes.forEach(([row, col, oldValue, newValue]) => {
        if (newValue !== oldValue) {
          newData[row][col] = newValue;
        }
      });
      setData(newData);
      //   socket.emit("save-document", { sheetId, data: newData });
      socket.emit("save-document", { sheetId, data: newData, userId: userDetails._id });
    }
  };

  const handleSelection = (r, c, r2, c2) => {
    const hotInstance = hotRef.current.hotInstance;
    const cellData = hotInstance.getDataAtCell(r, c);
    if (r == r2 && c == c2) {
      setCoordinate(`${String.fromCharCode(65 + c)}${r + 1}`);
    }
    else {
      setCoordinate(`${String.fromCharCode(65 + c)}${r + 1}:${String.fromCharCode(65 + c2)}${r2 + 1}`);
    }
    setFuncText(cellData);
    setPrevSelection({ range: { start: { row: r, col: c }, end: { row: r2, col: c2 } } });
  };

  // ------------------------------> UseEffect <------------------------------------------

  useEffect(() => {
    registerAllModules();
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
    if (userDetails && userDetails._id) {
      const s = io("http://localhost:3000");
      setSocket(s);

      s.emit("joinSheet", { sheetId, userId: userDetails._id, FileName });

      s.on("load-document", (loadedData) => {
        setData(loadedData);
      });

      s.on("document-updated", ({ data: updatedData }) => {
        setData(updatedData);
      });

      s.on("unauthorized", (message) => {
        alert(message);  // Handle unauthorized access (e.g., display an alert or redirect the user)
        navigate("/");  // Redirect the user to the home page or another appropriate page
      });

      s.on("error", (message) => {
        alert(message);  // Handle errors (e.g., display an alert)
      });

      return () => {
        s.disconnect();
      };
    }
  }, [userDetails, sheetId]);


  return (
    <div>
      {/* Navbar */}
      <ToastContainer />

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
          <button onClick={handleLogout} className="border rounded-full h-20 w-20 bg-[#EAF1FF] flex justify-center mt-10 hover:bg-blue-100">
            <div className="flex flex-col justify-center h-full text-l">
              Logout
            </div>
          </button>
        </div>

        {/* tabs */}
        <div className="div3 flex gap-6">
          <button
            onClick={(e) => {
              setTab("File");
            }}
            className={`${Tab === "File" ? "font-bold text-blue-500" : ""
              } flex flex-col h-8 mr-8 mt-6 hover:text-blue-500`}
          >
            File
          </button>
          <button
            onClick={(e) => {
              setTab("Edit");
            }}
            className={`${Tab === "Edit" ? "font-bold text-blue-500" : ""
              } flex flex-col h-8 mr-8 mt-6 hover:text-blue-500`}
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              setTab("View");
            }}
            className={`${Tab === "View" ? "font-bold text-blue-500" : ""
              } flex flex-col h-8 mr-8 mt-6 hover:text-blue-500`}
          >
            View
          </button>
          <button
            onClick={(e) => {
              setTab("Insert");
            }}
            className={`${Tab === "Insert" ? "font-bold text-blue-500" : ""
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
            onClickCapture={handleRename}
            readOnly={true}
          />
        </div>

        {/* tabs */}
        <div className="div5 flex gap-6">
          <button
            onClick={handleCollaborate}
            className={`${Tab === "Collaborate" ? "font-bold text-blue-500" : ""
              } flex flex-col h-8 mr-8 mt-6 hover:text-blue-500`}
          >
            Collaborate
          </button>
          <button
            onClick={(e) => {
              setTab("Comments");
            }}
            className={`${Tab === "Comments" ? "font-bold text-blue-500" : ""
              } flex flex-col h-8 mr-8 mt-6 hover:text-blue-500`}
          >
            Comments
          </button>
          <button
            onClick={handleShare}
            className={`${Tab === "Share" ? "font-bold text-blue-500" : ""
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

        {Tab === "Insert" && (
          <div className="div6 flex h-14 gap-6">
            <button
              onClick={handleInsertRowBelow}
              className="hover:bg-blue-100 border p-4 rounded w-48 bg-[#EAF1FF]"
            >
              Insert Row Below
            </button>
            <button
              onClick={handleInsertRowAbove}
              className="hover:bg-blue-100 border p-4 rounded w-48 bg-[#EAF1FF]"
            >
              Insert Row Above
            </button>
            <button
              onClick={handleRemoveRow}
              className="hover:bg-blue-100 border rounded p-4 bg-[#EAF1FF] w-48"
            >
              Delete Row
            </button>
            <button
              onClick={handleInsertColumnBefore}
              className="hover:bg-blue-100 border rounded p-4 bg-[#EAF1FF] w-58"
            >
              Insert Column Before
            </button>
            <button
              onClick={handleInsertColumnAfter}
              className="hover:bg-blue-100 border rounded p-4 bg-[#EAF1FF] w-48"
            >
              Insert Column After
            </button>
            <button
              onClick={handleDeleteCol}
              className="hover:bg-blue-100 border rounded p-4 bg-[#EAF1FF] w-48"
            >
              Delete Column
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
                onChange={(e) => {
                  setFuncText(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <HotTable className="mt-48"
        settings={
          {
            contextMenu: true,
            afterChange: handleAfterChange,
            afterSelectionEnd: handleSelection,
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
            undo: true,
            outsideClickDeselects: false,
          }}
        formulas={
          {
            engine: HyperFormula,
          }
        }
        ref={hotRef}
        selectionMode="multiple"
      />
    </div>
  );
};

export default Test;
