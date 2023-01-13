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
import { useSelector,useDispatch } from "react-redux";
import { State } from "../../interfaces/stateInterface";
import "./navigation.scss"
import { resetSelectedCase } from "../../reducers/newCaseReducer";


const drawerWidth = 240;

const openedMixin = (theme:any) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme:any) => ({
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
})(({ theme,variant,className, open }:{theme?:any,variant?:string, className?:any,open:any}) => ({
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

export default function MiniDrawer(
  // { children }
  ) {
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false); 

  const userInfo = useSelector((state:State)=>state.auth.userDetails)


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
  const selectedPathName = pathname.split("/").slice(0,3).join("/")  
  const handleDrawerToggle = () => {
    setOpen(!open);
  };
  const getLogo = (index:Number) => {
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
      <Drawer variant="permanent" open={open} className="navaigation-drawer-container" >
        <DrawerHeader style={{ display: "flaex" }}>
          <div className="naviagtion-header">
            <AccountCircleIcon
              sx={{ fontSize: open ? "50px" : "40px", left: "20px", right: "10px" }}
            />
            <span>
            <h3 style={{ fontSize: open ? "18px" : "0px", left: 0,textTransform:"capitalize" }}>
            {userInfo.userName}
            </h3>
            <label style={{ fontSize: open ? "18px" : "0px", left: 0 }}>Administrator </label>
            </span> 
          </div>   
        </DrawerHeader>            
        {open && <button className="logout-btn-caseflow" onClick={logoutCaseFlowHandler}>Logout <LogoutIcon style={{fontSize:"13px"}}/></button>}
       {open && <Button variant="contained"
          className="btn-navigation-style"
       style={{
          width:"206px",
          margin:".7rem auto 0",
          backgroundColor:"#404040",
          borderRadius:"8px",
          transition:"all 1s ease",  

        }} 
        onClick={()=>{dispatch(resetSelectedCase())}}
        component={Link} to="/private/cases/create">Start New Cases</Button>}
        
        <List>
          {routes.map((route, index) => (
            <Link
              to={route.path}
              key={index}
              style={{
                color: "black",
                textDecoration: "none",
                
              }}             
            >
              <ListItem
                key={index}
                selected={route.path === selectedPathName}
                disablePadding
                sx={{ display: "block" }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 55,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    borderRadius:"10%",
                margin:"0 1rem"
                  }}
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
                style={{  
                  fontSize: "30px",
                  position:"relative",
                  borderRadius:"50%",
                  border:"1px solid grey",
                  zIndex:"1000",  
                  marginTop:"3vh",
                 left:"93.5%",
                  backgroundColor:"#ffff"   ,
                  cursor:"pointer",
                }}
                onClick={handleDrawerToggle}
              />
              ) : (
                <ChevronRightIcon
                style={{   
                  fontSize: "30px",
                  position:"relative",
                  borderRadius:"50%",
                  border:"1px solid grey",
                  zIndex:"1000",  
                 marginTop:"3vh",
                 left:"75.5%",
                  backgroundColor:"#ffff"   ,
                  cursor:"pointer",
                }}
                onClick={handleDrawerToggle}
                />
                )}
    </div>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* {children} */}
      </Box>
    </Box>   
    
  );
}
