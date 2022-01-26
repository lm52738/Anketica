import { Button } from "@chakra-ui/react";
import { DataGrid, GridColDef } from "@material-ui/data-grid";
import axios from "axios";
import * as React from "react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { getUser, useRedirect } from "./shared/Utils";
import { SurveysHeader } from "./SurveysHeader";
import { addDays } from "date-fns";
import { makeStyles } from "@material-ui/core";

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
  active: boolean;
}

export default function DataTable() {
  const [redovi, setRedovi] = useState<Anketa[]>([]);
  const { push } = useHistory();

  useRedirect();

  const getUserData = () => {
    const user = getUser();

    axios
      .get<AnketaDTO[]>(`http://localhost:9000/anketa/sve/${user.osoba.mail}`)
      .then((response) => {
        const ankete: Anketa[] = response.data.map((dto) => {
          const datum = new Date(dto.datum);
          const deadline = addDays(new Date(dto.datum), dto.trajanje);

          const today = new Date();

          const active = today >= datum && today <= deadline;

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
            active: active,
          };
        });
        setRedovi(ankete);
      });
  };

  useEffect(() => getUserData(), []);

  const classes = useStyles();

  return (
    <div className={classes.root}>
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
          pageSize={10}
          disableSelectionOnClick
          sortModel={[
            {
              field: "active",
              sort: "desc",
            },
            {
              field: "ispunjena",
              sort: "desc",
            },
            {
              field: "deadline",
              sort: "desc",
            },
          ]}
          getRowClassName={(params) => {
            return params.row.active ? `styledrows` : `inactiverows`;
          }}
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

const useStyles = makeStyles({
  root: {
    "& .styledrows": {
      backgroundColor: "#DBFFE4",
    },
    "& .inactiverows": {
      backgroundColor: "#E5E5E5",
    },
  },
});

const columns: GridColDef[] = [
  {
    field: "ime",
    headerName: "Name",
    minWidth: 200,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "opis",
    headerName: "Description",
    minWidth: 200,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "ispunjena",
    headerName: "Filled Out",
    minWidth: 150,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "datum",
    headerName: "Start date",
    minWidth: 250,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "deadline",
    headerName: "Deadline",
    minWidth: 250,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "active",
    headerName: "Active",
    minWidth: 150,
    align: "center",
    headerAlign: "center",
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
