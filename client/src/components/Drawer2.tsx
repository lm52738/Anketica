import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import GroupIcon from "@material-ui/icons/Group";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import HomeIcon from "@material-ui/icons/Home";
import MenuIcon from "@material-ui/icons/Menu";
import PersonIcon from "@material-ui/icons/Person";
import QueryBuilderIcon from "@material-ui/icons/QueryBuilder";
import clsx from "clsx";
import React from "react";
import { useHistory } from "react-router-dom";
import { getUser, useRedirect } from "./shared/Utils";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    appBar: {
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: "none",
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      display: "flex",
      alignItems: "center",
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: "flex-end",
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
  })
);

interface User {
  id: number;
  id_uloga: number;
  ime: string;
  prezime: string;
  mail: string;
  datum_rod: Date;
  rod: string;
  password: string;
}

interface UserId {
  ime: string;
  prezime: string;
  mail: string;
  id: number;
  id_uloga: number;
}

const adminPart = (type: boolean) => {
  if (type) {
    return (
      <>
        <ListItem button key={"New Survey"}>
          <ListItemIcon>
            <HelpOutlineIcon />
          </ListItemIcon>
          <Link href="/new-survey">
            <ListItemText primary={"New Survey"} />
          </Link>
        </ListItem>
        <ListItem button key={"Groups"}>
          <ListItemIcon>
            <GroupIcon />
          </ListItemIcon>
          <Link href="/groups">
            <ListItemText primary={"Groups"} />
          </Link>
        </ListItem>
        <ListItem button key={"Add Group"}>
          <ListItemIcon>
            <GroupAddIcon />
          </ListItemIcon>
          <Link href="/addGroup">
            <ListItemText primary={"Add Group"} />{" "}
          </Link>
        </ListItem>
      </>
    );
  } else return <></>;
};

export default function PersistentDrawerLeft() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [userType, setUserType] = React.useState(false);
  const [homePage, setHomePage] = React.useState(false);
  //const [user, setUser] = React.useState<User>();
  var [userId, setUserId] = React.useState<UserId>();
  var bla = false;
  const user = getUser();

  const { push } = useHistory();

  /*const getUserData = () => {
   axios.get<User>("http://localhost:9000/users").then((response) => {
     console.log(response.data);
     setUser(response.data);
     user?.id_uloga == 1 ? setUserType(false) : setUserType (true)
   });
 };*/
  // const getUserDataRole = () => {
  //   axios.get("http://localhost:9000/users/role").then((response) => {
  //     const allUsers = response.data;
  //     //console.log (allUsers)
  //     for (var i = 0; i < allUsers.length; i++) {
  //       if (allUsers[i].id == user.osoba.id) {
  //         if (allUsers[i].id_uloga == 1) {
  //           setUserType(true);
  //         }
  //       }
  //     }
  //     setUserId(response.data);
  //     return response.data;
  //   });
  // };

  useRedirect();

  // const users = getUserDataRole();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={handleDrawerOpen}
        edge="start"
        className={clsx(classes.menuButton, open && classes.hide)}
      >
        <MenuIcon />
      </IconButton>
      {/* <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {userType}
          </Typography>
        </Toolbar>
      </AppBar> */}
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button key={"Home"}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <Link href="/home">
              <ListItemText primary={"Home"} />{" "}
            </Link>
          </ListItem>
          <ListItem button key={"Profile"}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <Link href="/profile">
              <ListItemText primary={"Profile"} />
            </Link>
          </ListItem>
          <ListItem button key={"All Surveys"}>
            <ListItemIcon>
              <QueryBuilderIcon />
            </ListItemIcon>
            <Link href="/surveys">
              <ListItemText primary={"All Surveys"} />
            </Link>
          </ListItem>
          {/* <ListItem button key={'Statistic'}>
            <ListItemIcon><BarChartIcon/></ListItemIcon>
            <Link href="/statistic"><ListItemText primary={'Statistic'} /></Link>
         </ListItem> */}
          <ListItem button key={"Log Out"}>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <Link
              href="/"
              onClick={() => {
                localStorage.clear();
              }}
            >
              <ListItemText primary={"Log Out"} />
            </Link>
          </ListItem>
          {/* <ListItem button key={'Log Outi'}>
            <ListItemIcon><ExitToAppIcon/></ListItemIcon>
            <Link onClick={()=> setHomePage(!homePage)}><ListItemText primary={'Log Outi'} /></Link>
         </ListItem> */}
        </List>
        <Divider />
        {userType == true ? adminPart(true) : adminPart(false)}
      </Drawer>
      <main></main>
    </div>
  );
}
