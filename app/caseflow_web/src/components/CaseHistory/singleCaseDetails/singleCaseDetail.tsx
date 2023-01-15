import React, { useState } from 'react'
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import "./SingleCaseDetail.scss"



const SingleCaseDetail = ({caseHisoryData}) => {
    // const docDate =  {
    //     id:1,
    //     description:"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.",
    //     notes:"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy.",
    //     date:"2022-11-01 14:37",
    //     tasks:["Task 01","Task 02"],
    //     documents:"Document.pdf"
    // }     
    const[expand,setExpand] = useState(false)
    const expandDetailhandler = ( )=>{
        setExpand((prevState) =>{
            return !prevState
        })
    }
  return (
    <div className='case-grid-container'>
        <span className='case-grid-date'>{caseHisoryData.date}</span>
        <span className='case-grid-line'><span className="case-grid-line-ball"></span></span>
        <div className='case-gird-details'>
            <h3 onClick={expandDetailhandler} className="case-gird-details-header"><span>{caseHisoryData.caseHistoryType}</span>
           {expand ? <KeyboardArrowUpRoundedIcon/>:<KeyboardArrowDownRoundedIcon/>}
            </h3>
            {expand && <div>
                <p>{caseHisoryData.caseHistoryType}</p>
                {/* <h3>Notes</h3>
                <p>{notes}</p>
                <h3>Tasks</h3>
                {tasks.map((task:any)=><p>{task}</p>)}
                <h3>Document</h3>
                <p>{documents}</p> */}
            </div>

            }
        </div>      
    </div>
  )
}

export default SingleCaseDetail
