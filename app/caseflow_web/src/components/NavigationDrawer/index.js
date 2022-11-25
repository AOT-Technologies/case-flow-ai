import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
// import MuiAppBar from "@mui/material/AppBar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import CasesOutlinedIcon from "@mui/icons-material/CasesOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import { Button } from "@mui/material";
import UserService from "../../services/UserService";
import LogoutIcon from '@mui/icons-material/Logout';
import { useSelector } from "react-redux";
import "./navigation.scss"

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  // justifyContent: "flex-cen",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

// const AppBar = styled(MuiAppBar, {
//   shouldForwardProp: (prop) => prop !== "open",
// })(({ theme, open }) => ({
//   zIndex: theme.zIndex.drawer + 1,
//   transition: theme.transitions.create(["width", "margin"], {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   ...(open && {
//     marginLeft: drawerWidth,
//     width: `calc(100% - ${drawerWidth}px)`,
//     transition: theme.transitions.create(["width", "margin"], {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//   }),
// }));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function MiniDrawer({ children }) {
 
  const [open, setOpen] = React.useState(false); 

  const userInfo = useSelector(state=>state.auth.userDetails)

  const routes = [
    {
      key: 1,
      text: "Home",
      path: "/private/",
    },
    { key: 2, text: "Tasks", path: "/private/tasks" },
    { key: 3, text: "Cases", path: "/private/cases" },
    { key: 4, text: "Documents", path: "/private/documents" },
    { key: 5, text: "LOB", path: "/private/lob" },
  ];
  const { pathname } = useLocation();
  console.log(pathname);
  const handleDrawerToggle = () => {
    setOpen(!open);
  };
  const getLogo = (index) => {
    switch (index) {
      case 0:
        return <HomeOutlinedIcon />;
      case 1:
        return <AssignmentOutlinedIcon />;
      case 2:
        return <CasesOutlinedIcon />;
      case 3:
        return <ArticleOutlinedIcon />;
      case 4:
        return <BusinessOutlinedIcon />;
      default:
        return <HomeOutlinedIcon />;
    }
  };

  const logoutCaseFlowHandler = ( ) =>{
    UserService.userLogout()
  }

  return (     
    <Box >
      <CssBaseline />
      <Drawer variant="permanent" open={open} className="navaigation-drawer-container">
        <DrawerHeader className="navaigation-drawer-header">
          <div className="naviagtion-header">
            <AccountCircleIcon className={`naviagtion-header-account-icon  ${open?"open-icon":"closed-icon"}` }            
            />
            <span>
            <h3  className={`naviagtion-header-userName  ${open?"open-userName":"closed-userName"}` }>
            {userInfo.userName}
            </h3>
            <label className={`naviagtion-header-role  ${open?"open-role":"closed-role"}` }>Administrator </label>
            </span> 
          </div>   
        </DrawerHeader>            
        {open && <button className="logout-btn-caseflow" onClick={logoutCaseFlowHandler}>Logout <LogoutIcon className="logout-btn" /></button>}
       {open && <Button variant="contained"
          className="btn-navigation-style"
       component={Link} to="/private/cases/create">Start New Cases</Button>}        
        <List>
          {routes.map((route, index) => (
            <Link
              to={route.path}
              key={index}
              className="navigation-link"              
            >
              <ListItem
                key={index}
                selected={route.path === pathname}
                className="navigation-link-item"
                disablePadding               
              >
                <ListItemButton
                className={`navigation-link-item-btn ${open?"navigation-link-item-btn-open":"navigation-link-item-btn-closed"}`}                 
                >
                  <ListItemIcon                  
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {getLogo(index)}
                  </ListItemIcon>
                  <ListItemText
                    primary={route.text}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>
      </Drawer>
      <div className="Chevron-parent-container">
          {open ? (
              <ChevronLeftIcon
              className="navi-drawer-left-icon"  
              style={{   
                fontSize: "30px",                 
              }}           
                onClick={handleDrawerToggle}
              />
              ) : (
                <ChevronRightIcon
                className="navi-drawer-right-icon" 
                style={{   
                  fontSize: "30px",                 
                }}
                onClick={handleDrawerToggle}
                />
                )}
    </div>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </Box>   
    
  );
}
