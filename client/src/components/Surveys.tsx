import { Button } from "@chakra-ui/react";
import { DataGrid, GridColDef } from "@material-ui/data-grid";
import axios from "axios";
import * as React from "react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { getUser, useRedirect } from "./shared/Utils";
import { SurveysHeader } from "./SurveysHeader";
import { addDays } from "date-fns";

const columns: GridColDef[] = [
  {
    field: "ime",
    headerName: "Name",
    width: 200,
    align: "center",
  },
  {
    field: "opis",
    headerName: "Description",
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
    field: "datum",
    headerName: "Start date",
    width: 250,
    align: "center",
  },
  {
    field: "deadline",
    headerName: "Deadline",
    width: 250,
    align: "center",
  },
  {
    field: "statistics",
    headerName: "Statistics",
    width: 150,
    renderCell: (cellValues) => {
      const onClick = async () => {};
      return <Button onClick={onClick}>View Statistics</Button>;
    },
  },
];

interface AnketaDTO {
  // id je id_vlastita
  id: number;
  id_ankete: number;
  id_slanje_ankete: number;
  datum: string;
  ime: string;
  ispunjena: boolean;
  mail: string;
  opis: string;
  trajanje: number;
}

interface Anketa {
  id: number;
  id_ankete: number;
  id_slanje_ankete: number;
  ime: string;
  ispunjena: boolean;
  mail: string;
  opis: string;
  datum: string;
  deadline: string;
}

export default function DataTable() {
  const [redovi, setRedovi] = useState<Anketa[]>([]);
  const { push } = useHistory();

  const getUserData = () => {
    const user = getUser();

    axios
      .get<AnketaDTO[]>(`http://localhost:9000/anketa/sve/${user.osoba.mail}`)
      .then((response) => {
        const ankete: Anketa[] = response.data.map((dto) => {
          const datum = new Date(dto.datum);
          const deadline = addDays(new Date(dto.datum), dto.trajanje);

          var dateOptions = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          };

          return {
            id: dto.id,
            id_ankete: dto.id_ankete,
            id_slanje_ankete: dto.id_slanje_ankete,
            datum: datum.toLocaleDateString("en-US", dateOptions),
            ime: dto.ime,
            ispunjena: dto.ispunjena,
            mail: dto.mail,
            opis: dto.opis,
            deadline: deadline.toLocaleDateString("en-US", dateOptions),
          };
        });
        setRedovi(ankete);
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
          disableSelectionOnClick
          onCellClick={(params) => {
            const idVlastita = params.id;
            const idAnkete = params.row.id_ankete;
            if (params.field === "statistics") {
              push(`statistics/${idAnkete}`);
            } else {
              push(`survey/${idVlastita}`);
            }
          }}
        />
      </div>
    </div>
  );
}
