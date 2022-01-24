import { Button } from "@chakra-ui/react";
import { DataGrid, GridColDef } from "@material-ui/data-grid";
import axios from "axios";
import * as React from "react";
import { useEffect, useState } from "react";
import { getUser, useRedirect } from "./shared/Utils";
import { SurveysHeader } from "./SurveysHeader";

const columns: GridColDef[] = [
  //{ field: 'nameOfSurvay', headerName: 'nameOfSurvay', width: 90 },
  {
    field: "id",
    headerName: "ID",
    width: 100,
    align: "center",
  },
  {
    field: "ime",
    headerName: "Name",
    width: 200,
    align: "center",
  },
  {
    field: "ispunjena",
    headerName: "Filled Out",
    width: 150,
    align: "center",
  },
  {
    field: "deadline",
    headerName: "Deadline",
    width: 250,
    align: "center",
  },
  {
    field: "broj_pitanja",
    headerName: "Number of Questions",
    width: 250,
    align: "center",
  },
  {
    field: "br_anketa",
    headerName: "Number of surveys",
    width: 200,
    align: "center",
  },
  {
    field: "statistics",
    headerName: " ",
    width: 150,
    renderCell: (cellValues) => {
      const onClick = async () => {
        let id = cellValues.id;
        let path = `./statistics/` + id;
        window.open(path, "_self");
      };
      return <Button onClick={onClick}>View Statistics</Button>;
    },
  },
];

interface Anketa {
  id: number;
  ime: string;
  ispunjena: boolean;
  deadline: Date;
  broj_pitanja: number;
  br_anketa: number;
}

export default function DataTable() {
  const [redovi, setRedovi] = useState<Anketa[]>([]);

  const getUserData = () => {
    const user = getUser();

    axios
      .get(`http://localhost:9000/anketa/sve/${user.osoba.mail}}`)
      .then((response) => {
        console.log(response.data);
        // setRedovi(response.data);
      });
  };

  useRedirect();

  useEffect(() => getUserData(), []);

  return (
    <div>
      <SurveysHeader />
      <div
        style={{
          height: "80%",
          width: "90%",
          position: "absolute",
          left: "5%",
          right: "5%",
          background: "#FFFFFF",
        }}
      >
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
