import * as React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@material-ui/data-grid';
import {SurveysHeader} from "./SurveysHeader";
import { background } from '@chakra-ui/styled-system';
import axios from "axios";
import { useEffect, useState } from "react";


const columns: GridColDef[] = [
  //{ field: 'nameOfSurvay', headerName: 'nameOfSurvay', width: 90 },
  {
    field: 'name',
    headerName: 'Name',
    width: 250,
    align: 'left',
  },
  {
    field: 'filledOut',
    headerName: 'Filled Out',
    width: 150,
    align: 'center',
    headerAlign: 'center',
  },
  /*{
    field: 'deadline',
    headerName: 'Deadline',
    width: 150,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: 'numberOfQuestions',
    headerName: 'Number of Questions',
    width: 150,
    align: 'center',
    headerAlign: 'right',
  },
  {
    field: 'filledout_All',
    headerName: 'Filled out / Allja',
    width: 150,
    align: 'center',
    headerAlign: 'right',
  },*/
  
];

interface Data {
  name: string
  filledOut: boolean;
  deadline: Date;
  numberOfQuestions: number;
  filledout_All: number;
}

/*async function getData(){
  try{
    axios.get('http://localhost:9000/surveys')
          .then(res => {
    const data = res.data;
    console.log(data);
    return (data);
  })}
  catch (err) {
    console.log(err);
  }
}*/
const rows =  [
  {id: 1, name: 'Kako se osiječaš?', filledOut: '22.07.2021.' },
  {id: 2, name: 'Kako se osiječaš?', filledOut: '22.07.2021.' },
  {id: 3, name: 'Kako se osiječaš?', filledOut: '22.07.2021.' },
  {id: 4, name: 'Kako se osiječaš?', filledOut: '22.07.2021.' },
  {id: 5, name: 'Kako se osiječaš?', filledOut: '22.07.2021.' },
];


export default function DataTable() {
  //const [rows, setRows] = useState<Data[]>([]);
  const [red, setRed] = useState([]);
  const [redovi, setRedovi] = useState([]);
  /*const getUserData = () => {
    axios.get("http://localhost:9000/surveys").then((response) => {
    console.log(response.data);
    setRows(response.data);
    });
  };*/
  //console.log (getUserData)
  //useEffect(() =>  getUserData, []);
  //console.log (rows)

  useEffect(() =>  {
    fetch("http://localhost:9000/surveys")
    .then ((data) => data.json())
    .then ((data)=> setRed (data))
});
useEffect(() =>  {
  fetch("http://localhost:9000/surveys/bla")
  .then ((data) => data.json())
  .then ((data)=> setRedovi (data))
});
console.log (red)
  return (
     <div>
     <SurveysHeader />
    <div style={{ height: '80%', width: '90%', position: 'absolute', left: '5%', right: '5%', background: '#FFFFFF'}}>
      <DataGrid
        rows={redovi}
        columns={columns}
        pageSize={5}
        //checkboxSelection
        //disableSelectionOnClick
      />
    </div>
    </div>
  );
}


