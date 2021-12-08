import * as React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@material-ui/data-grid';
import {SurveysHeader} from "./SurveysHeader";
import { background } from '@chakra-ui/styled-system';


const columns: GridColDef[] = [
  //{ field: 'nameOfSurvay', headerName: 'nameOfSurvay', width: 90 },
  {
    field: 'name',
    headerName: 'Name',
    width: 150,
    align: 'left',
  },
  {
    field: 'filledOut',
    headerName: 'Filled Out',
    width: 150,
    align: 'right',
    headerAlign: 'right',
  },
  
];

const rows = [
  {id: 1, name: 'Kako se osiječaš?', filledOut: '22.07.2021.' },
  {id: 2, name: 'Kako se osiječaš?', filledOut: '22.07.2021.' },
  {id: 3, name: 'Kako se osiječaš?', filledOut: '22.07.2021.' },
  {id: 4, name: 'Kako se osiječaš?', filledOut: '22.07.2021.' },
  {id: 5, name: 'Kako se osiječaš?', filledOut: '22.07.2021.' },
];

export default function DataTable() {
  return (
     <div>
     <SurveysHeader />
    <div style={{ height: '80%', width: '90%', position: 'absolute', left: '5%', right: '5%', background: '#FFFFFF'}}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        //checkboxSelection
        //disableSelectionOnClick
      />
    </div>
    </div>
  );
}
