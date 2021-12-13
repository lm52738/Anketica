import * as React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@material-ui/data-grid';
import { background } from '@chakra-ui/styled-system';
import { GroupsHeader } from './GroupsHeader';


const columns: GridColDef[] = [
  //{ field: 'nameOfSurvay', headerName: 'nameOfSurvay', width: 90 },
  {
    field: 'name',
    headerName: 'Name',
    width: 150,
    align: 'left',
  },
  {
    field: 'created',
    headerName: 'Created',
    width: 150,
    align: 'right',
    headerAlign: 'right',
  },
  
];

const rows = [
  {id: 1, name: 'Grupa 1', created: '21.11.2021.' },
  {id: 2, name: 'Grupa 2', created: '22.05.2021.' },
  {id: 3, name: 'Grupa 3', created: '10.10.2021.' },
  {id: 4, name: 'Grupa 4', created: '02.12.2021.' },
  {id: 5, name: 'Grupa 5', created: '15.01.2021.' },
];

export default function DataTable() {
  return (
     <div>
     <GroupsHeader />
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
