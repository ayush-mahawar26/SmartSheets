import React from 'react'
import { useEffect, useState} from 'react'
import 'handsontable/dist/handsontable.full.min.css';
import Handsontable from 'handsontable/base';
import { registerAllModules } from 'handsontable/registry';
import { HotTable } from '@handsontable/react';
import io from "socket.io-client";
import { useParams } from 'react-router-dom';

const Test = () => {

    registerAllModules();

    const [Data, setData] = useState([]);
    const [socket, setSocket] = useState(null);
    const { sheetId } = useParams();

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
        let columns = 40;
        let data = [];
        for (let i = 0; i < rows; i++) {
            let row = [];
            for (let j = 0; j < columns; j++) {
                row.push("");
            }
            data.push(row);
        }
        setData(data);
    }
    , []);

    useEffect(() => {
        const s = io('http://localhost:3000');
        setSocket(s);

        s.emit('joinSheet', { sheetId });

        s.on('load-document', (loadedData) => {
          setData(loadedData);
        });

        s.on('document-updated', ({ data: updatedData }) => {
          setData(updatedData);
        });

        return () => {
          s.disconnect();
        };
      }, [sheetId]);

  return (
    <div>
        <HotTable
            afterChange={handleAfterChange}
            data={Data}
            rowHeaders={true}
            colHeaders={true}
            height="auto"
            autoWrapRow={true}
            autoWrapCol={true}
            licenseKey="non-commercial-and-evaluation"
        />
    </div>
  )
}

export default Test