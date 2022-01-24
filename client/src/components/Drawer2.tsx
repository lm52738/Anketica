import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import BarChartIcon from '@material-ui/icons/BarChart';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Link from '@material-ui/core/Link';
import axios from "axios";
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import TextField from '@material-ui/core/TextField';
import ProfilePage from "pages/ProfilePage";
import SurveysPage from "./Surveys";
import Button from '@material-ui/core/Button';






const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
  }),
);

interface User {
   id: number;
   id_uloga : number;
   ime: string;
   prezime: string;
   mail: string;
   datum_rod: Date;
   rod: string;
   password: string;
 }

const adminPart = (type : boolean) => {
   if (type){
   return (
      <ListItem button key={'New Survey'}>
            <ListItemIcon><HelpOutlineIcon/></ListItemIcon>
            <ListItemText primary={'New Survey'} />
      </ListItem>
   )
   }else return (<></>)
}


export default function PersistentDrawerLeft() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [userType, setUserType] = React.useState(false);
  const [homePage, setHomePage] = React.useState(false);
  var [user, setUser] = React.useState<User>();
  const bla = true;

  const getUserData = () => {
   axios.get<User>("http://localhost:9000/profile").then((response) => {
     console.log(response.data);
     setUser(response.data);
     user?.id_uloga == 1 ? setUserType(false) : setUserType (true)
   });
 };
   

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
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
        <ListItem button key={'Home'}>
            <ListItemIcon><HomeIcon/></ListItemIcon>
            <ListItemText primary={'Home'} />
         </ListItem>
         <ListItem button key={'Profile'}>
            <ListItemIcon><PersonIcon/></ListItemIcon>
            <ListItemText primary={'Profile'} />
         </ListItem>
         <ListItem button key={'All Surveys'}>
            <ListItemIcon><QueryBuilderIcon/></ListItemIcon>
            <ListItemText primary={'All Surveys'} />
         </ListItem>
         <ListItem button key={'Statistic'}>
            <ListItemIcon><BarChartIcon/></ListItemIcon>
            <ListItemText primary={'Statistic'} />
         </ListItem>
         <ListItem button key={'Log Out'}>
            <ListItemIcon><ExitToAppIcon/></ListItemIcon>
            <ListItemText primary={'Log Out'} />
         </ListItem>
         {/* <ListItem button key={'Log Outi'}>
            <ListItemIcon><ExitToAppIcon/></ListItemIcon>
            <Link onClick={()=> setHomePage(!homePage)}><ListItemText primary={'Log Outi'} /></Link>
         </ListItem> */}
        </List>
        <Divider />
          {bla == true ? adminPart (true) : adminPart (false)} 
      </Drawer>
      <main >
      </main>
      
      
    </div>
  );
}
