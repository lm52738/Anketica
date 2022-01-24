import * as React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@material-ui/data-grid';
import {SurveysHeader} from "./SurveysHeader";
import { background } from '@chakra-ui/styled-system';
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Link } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import ResponsiveDrawer from "./Drawer";
import PersistentDrawerLeft from "./Drawer2";


const columns: GridColDef[] = [
  //{ field: 'nameOfSurvay', headerName: 'nameOfSurvay', width: 90 },
  {
    field: 'id',
    headerName: 'ID',
    width: 100,
    align: 'center',
  },
  {
    field: 'ime',
    headerName: 'Name',
    width: 200,
    align: 'center',
  },
  {
    field: 'ispunjena',
    headerName: 'Filled Out',
    width: 150,
    align: 'center',
  },
  {
    field: 'deadline',
    headerName: 'Deadline',
    width: 250,
    align: 'center',
  },
  {
    field: 'id_slanje_ankete',
    headerName: 'Id of sent survey',
    width: 200,
    align: 'center',
  },
  {
    field: 'broj_pitanja',
    headerName: 'Number of Questions',
    width: 250,
    align: 'center',
  },
  {
    field: 'filledout_All',
    headerName: 'Filled out',
    width: 150,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: 'statistics',
    headerName: ' ',
    width: 150,
    renderCell: (cellValues) => {
      const onClick = async () => {
        let id = cellValues.id;
        let path = `./statistics/` + id;
        window.open(path,"_self");
      };
      return <Button onClick={onClick}>View Statistics</Button>;
    }
  },
];

interface Anketa {
  id: number;
  ime: string;
  ispunjena: boolean;
  deadline: Date;
  id_slanje_ankete: number;
  broj_pitanja: number;
  filledout_All: number;
}

export default function DataTable() {
  //const [rows, setRows] = useState<Data[]>([]);
  const [red, setRed] = useState([]);
  const [redovi, setRedovi] = useState<Anketa[]>([]);

  const getUserData = () => {
    axios.get("http://localhost:9000/surveys").then((response) => {
    console.log(response.data);
    setRedovi(response.data);
    });
  };

  useEffect(() => getUserData(), []);

  return (
     <div>
       <SurveysHeader />
     
    <div style={{ height: '80%', width: '90%', position: 'absolute', left: '5%', right: '5%', background: '#FFFFFF'}}>
      <DataGrid
        rows={redovi}
        columns={columns}
        pageSize={5}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>
    </div>
  );
}


