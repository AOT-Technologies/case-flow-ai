import FilterMuiComponent from "../FilterMuiComponent/FilterMuiComponent";
import EditIcon from '@mui/icons-material/Edit';
import React,{ useState } from "react";
import "./PolicyHeader.scss";
import { useNavigate } from "react-router-dom";
import {useDispatch} from "react-redux";
import { setEditLob } from "../../reducers/lobReducer";
import { Typography } from "@mui/material";




const PolicyHeader = (props) => {
const dispatch = useDispatch();
console.log(props)

  const navigate = useNavigate();
const editCaseDetails = (id)=>{
  dispatch(setEditLob(true))

  navigate("/private/lob/"+ id+'/edit');
} 
    return (
        <div className="lob-detail-header">
          <div className="lob-id-status">
            <p className="lob-id">Policy No: {props.policy}</p>
            <Typography sx={{backgroundColor:'primary.main'}} className="lob-status">{props.status}</Typography>
            <div className="lob-edit" 
            onClick={()=>{editCaseDetails(props.lobId)}}
            >  
          <span className="action-icon"> {<EditIcon sx={{color:'primary.main'}}  />}</span>
              </div>
          </div>
    </div>
    )
};

export default PolicyHeader

