import * as React from 'react';
import { DataGrid, GridApi, GridCellEditCommitParams, GridCellValue, GridColDef, GridValueGetterParams } from '@material-ui/data-grid';
import { GroupsHeader } from './GroupsHeader';
import axios from "axios";
import { FC, useState, useEffect } from "react";
import { isEmpty } from '@chakra-ui/utils';
import { Button, Flex } from "@chakra-ui/react";
import PersistentDrawerLeft from "components/Drawer2";


interface group {
  id: number;
  ime: string;
  mail: string;
}

const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'ID',
    width: 100,
    align: 'center'
  },
  {
    field: 'ime',
    headerName: 'Name',
    width: 150,
    align: 'center',
    editable: true
  },
  {
    field: 'mail',
    headerName: 'Mails',
    width: 750,
    align: 'left',
    editable: true
  },
  {
    field: "action",
    headerName: " ",
    
    sortable: false,
    renderCell: (params) => {
      const onClick = async (e) => {
        e.stopPropagation(); // don't select this row after clicking

        const api: GridApi = params.api;
        const thisRow: Record<string, GridCellValue> = {};

        api
          .getAllColumns()
          .filter((c) => c.field !== "__check__" && !!c)
          .forEach(
            (c) => (thisRow[c.field] = params.getValue(params.id, c.field))
          );

        window.location.reload();

        console.log(thisRow);
        const url = "http://localhost:9000/groups/" + thisRow.id;
        await axios.post(url, thisRow);

      };

      return <Button onClick={onClick}>Delete</Button>;
    }
  }
  
];


export default function DataTable() {
  var [group, setGroup] = useState<group>();
  let groups = Array<group>();
  var [rows, setRows] = useState<group[]>([]);

  //dohvat grupa
  const getUserData = () => {
    axios.get("http://localhost:9000/groups").then((response) => {
      console.log(response.data);
      for (group of response.data) {
        if (group){
          let id = group.id;
          let oldGroup = groups.find(g => g.id == id);
          if (oldGroup){
            console.log("grupa je unesena");

            let mail = oldGroup.mail.concat(", " + group.mail);
            group.mail = mail;

            setGroup(group);
            groups.pop();
          } else {
            setGroup(group);
          }
          groups.push(group);
        }
      }

      if (!isEmpty(groups)){
        setRows(groups);
      }

    });

  };

  // treba dohvatit
  useEffect(() => getUserData(), []);

  // edit data
  const handleCommit = async (e:GridCellEditCommitParams) => {
    const array = rows.map( r => {
      if (r.id === e.id)
        return {...r, [e.field]:e.value}
      else
        return {...r}
    })
    // postavi rows
    setRows(array);

    //posalji na groups/post
    console.log(array);
    await axios.post("http://localhost:9000/groups", array);

  }


  return (
    <div>
    <GroupsHeader />
      <div style={{ height: '80%', width: '90%', position: 'absolute', left: '5%', right: '5%', background: '#FFFFFF'}}>
        <div style={{ alignItems: 'center', margin: '30px'}}>
            <a href="/addGroup">
              <Button> Add new group</Button> 
            </a>
        </div>
        
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          onCellEditCommit={handleCommit}
        />
      </div>
    </div>
  );
}
