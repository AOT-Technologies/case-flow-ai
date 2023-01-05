import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Divider from "@mui/material/Divider";
import RecentCasecard from "../RecentCaseCard";
import { SortCasesByField } from "../../helper/SortCases";
import "./caselist.scss"
import { caseListprops,  PropsConfig, RecentCase, SortValue } from "../../interfaces/componentInterface";
import { getCasesList } from "../../services/CaseService";
import { setCaseList } from "../../reducers/newCaseReducer";
import {useSelector,useDispatch} from "react-redux";
import { Case } from "../../interfaces/componentInterface";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Grid from "@mui/material/Grid";






// let  sortingkeysOfAllRecentCases:SortValue[] =[]
// for( let field in allRecentCases[0]){
//   // sortingkeysOfAllRecentCases = [...sortingkeysOfAllRecentCases,{value:field,sortOrder:true}]
//   sortingkeysOfAllRecentCases.push({value:field,sortOrder:true})
// }


const CaseList =React.memo( ({config,allRecentCases}:any) => {
 

  // const [sortValue,setSortValue] = useState({value:"",sortOrder:null})
  // const [recentCases,setRecentCases] = useState([...allRecentCases])
  // const [sortSelectValue,setSortSelectValues] = useState(sortingkeysOfAllRecentCases)
  const dispatch = useDispatch();

  // useEffect(()=>{ 
  //  const updatedSortedData = SortCasesByField(sortValue,recentCases)
  //  setRecentCases(updatedSortedData)
  // },[sortValue])

  // const onSortingValueChangeHandler = (e:any) =>{
  //   let tempSelectedValue = e.target.value;

  //   const updatedSortValueState =sortSelectValue.map(sortValue =>{
  //     if(sortValue.value === tempSelectedValue){
  //       let sortedDummyvalue = {value:tempSelectedValue,sortOrder:!sortValue.sortOrder}
  //       tempSelectedValue = sortedDummyvalue
  //        return sortedDummyvalue
  //       }else return sortValue
      
  //   }) 
  //   setSortSelectValues(updatedSortValueState) 
  //   setSortValue(tempSelectedValue)    
  // }


 // to fetch the case list and set the state of cases 
  useEffect(() => {
    fetchCaseDetails();
  }, []);
  
  async function fetchCaseDetails() {
    let output = await getCasesList();

    output = output.map((element) => {
      return {
        id :element.id,
        name:element.name,
        description:element.desc,
        status:'open'    //need to change in future
      };
    });
    dispatch(setCaseList(output))


  }
  
  return (
    <div style={{ padding: "2rem 3rem 0rem 8rem" }}>
      <span className="recent-case-header">
      <Typography
        sx={{ padding: "1rem 1rem 1rem 1rem" }}
        variant="h6"
      >
        {config.title}
      </Typography>     
      {/* { config.isShowSort ? <FormControl sx={{ m: 1, minWidth: 120, }}>
        <InputLabel id="demo-simple-select-label">Sorting</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Sorting"
            value={sortValue.value}
            onChange={onSortingValueChangeHandler}
          >
            {sortSelectValue.map((sortField,index) =>{
              return <MenuItem value={sortField.value} key={index} >{sortField.value} </MenuItem>
            })}
           
         </Select>
        </FormControl> : "" } */}
      </span>
      <Divider sx={{ borderBottomWidth: 3 }} />

      <List
        sx={{
          width: "100%",
          bgcolor: "background.paper",
        }}
        component="nav"
        aria-label="mailbox folders"

         >

        {allRecentCases.length!=0 ? allRecentCases.map((eachcases:Case) => (
          <RecentCasecard
            case = {eachcases}
            key={eachcases.id}            
          />
        )):
        <ListItem >
          <Grid container spacing={1}  >
          <Grid item xs={12} >
            <ListItemText
              primary={
                <Typography 
                variant="body2"
                style={{ "fontWeight": "700" ,"textAlign":"center","color":"rgba(0, 0, 0, 0.6)"}}>
                  No Recent Cases Found!
                </Typography>
              }             
            />
          </Grid>
          </Grid>
        </ListItem>
        }
      </List>
    </div>
  );
});

export default CaseList;