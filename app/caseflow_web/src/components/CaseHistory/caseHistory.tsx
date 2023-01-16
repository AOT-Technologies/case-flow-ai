import React, {useEffect} from 'react'
import SingleCaseDetail from './singleCaseDetails/singleCaseDetail'
import "./caseHistory.scss"
import FilterMuiComponent from '../FilterMuiComponent/FilterMuiComponent';
import { setCaseHistory } from '../../reducers/caseHistoryReducer';
import {useDispatch,useSelector} from "react-redux";
import { getCaseHistory } from '../../services/CaseService';




const CaseHistory = ({caseId}) => {

  const dispatch = useDispatch();

  const selectedCase = useSelector((state:any) => state.cases.selectedCase);
  const selectedCaseHistory = useSelector((state:any) => state.caseHistory.caseHistory);









    const optionsForFilter = ["name","date","owner"]
    const onFilterChangehandler = (e:any) =>{
      console.log("chnaged")
    }

  return (
    <div className='case-history-container'>
      <header className='case-history-header'>
        <div className='case-history-header-name'>Case History</div>       
        <FilterMuiComponent label="Filter" options={optionsForFilter} onChnagehandler={onFilterChangehandler} />
      </header>
      {selectedCaseHistory.map(singleCaseHistory =>{
       return <SingleCaseDetail
        key={singleCaseHistory.id}
        caseHisoryData = {singleCaseHistory}


         />
      })}
    </div>
  )
}

export default CaseHistory
