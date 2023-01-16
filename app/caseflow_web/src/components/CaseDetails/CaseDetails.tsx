import React,{useEffect,useState} from "react";
import FilterMuiComponent from "../FilterMuiComponent/FilterMuiComponent";
import CaseDetailData from "./CaseDetailData/CaseDetailData";
import CaseDetailReference from "./CaseDetailReference/CaseDetailReference";
import "./CaseDetails.scss";
import Search from "../Search";
import CaseHistory from "../CaseHistory/caseHistory";
import { getCaseDetails } from "../../services/CaseService";
import { useLocation } from 'react-router-dom'
import RelatedCaseDocuments from "../RelatedCaseDocuments";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
// import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CustomizedDialog from '../Dialog'
import Upload from '../Upload'
import EditIcon from '@mui/icons-material/Edit';
import { setSelectedCase } from "../../reducers/newCaseReducer";
import {useDispatch} from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCaseHistory } from '../../reducers/caseHistoryReducer';
import { getCaseHistory } from '../../services/CaseService';


const CaseDetails = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const caseDetail = {
    status: "OPEN",
    date: "2022-11-01",
    owner: "Chris Robinson",
    tasks: ["Send for approval 1", "Send for approval 2"],
    docketNum: "1234",
    courtRef: "2022-11-01",
  }
  const optionsForAction = [{id : 0, code :'1' ,text: "Select Action"},
  {id : 1, code :'1' ,text: "Start Workflow"},
  {id : 2, code :2 ,text: "Wake"},
  {id : 3, code :3 ,text: "Complete"},
  {id : 4, code :4 ,text: "Merge"},
  {id : 5, code :5 ,text: "Archive"},
  {id : 6, code :6 ,text: "Upload Document"},
  {id : 7, code :7 ,text: "Delete"},
];
  async function fetchCaseDetails() {
    var matches = location.pathname.match(/(\d+)/);
    if(matches && matches[0]){
      let output = await getCaseDetails(matches[0]);
      dispatch(setSelectedCase({...output,isEdit:false}));
      setselectedCaseDetails(output)
      await fetchCaseHistory(matches[0])
    }
  }
    async function fetchCaseHistory(id) {    
    const caseHistoryData = await getCaseHistory(id);
    console.log(caseHistoryData,"caseHistoryData")
    const output = caseHistoryData.casehistory.map((element,index) => {
      return {  
        id :index,
        date:element.datetime.split("T")[0],
        caseHistoryType:element.event.eventtype.text,
      };
    });

    dispatch(setCaseHistory(output))
  } 
  
const [selectedCase, setselectedCaseDetails]:any = useState({});
const [isOpenPopup,setOpenPopup] = useState(false);
  const [selected, setSelected] = useState(0);
  const handleClose = (
    event,
    reason
  ) => {
   setOpenPopup(false);
   setSelected(0)
  };

  const onActionChangehandler = (e: any) => {

    setSelected(e.target.value)
    switch(e.target.value){

      case 6 : {
        setOpenPopup(true);
      }
    }
  };
  const editCaseDetails=(selectedCase)=> {

    dispatch(setSelectedCase({...selectedCase,isEdit:true}));
    navigate("/private/cases/create");

    }

  useEffect(() => {
    fetchCaseDetails();
  }, []);

  return (
    <>
    <div className="details-container">
      <h1 className="title">CaseFlow</h1>
      <div className="search">
        <Search
          setSearchField={() => {}}
          dropDownArray={[]}
          setSearchColumn={() => {}}
        ></Search>
      </div>

      <section className="case-detail-container">
        <span className="case-detail-header">
          <div className="case-id-status">
            <p className="case-id">Case ID :{selectedCase.id}</p>
            <p className="case-status">{caseDetail.status}</p>
          <div className="case-edit" onClick={()=>{editCaseDetails(selectedCase)}}>  
          <span className="action-icon"> {<EditIcon />}</span>
              </div>
           
          </div>
          <FilterMuiComponent
            label="Action"
            options={optionsForAction}
            onChnagehandler={onActionChangehandler}
            selected ={selected}
          />
        </span>
        <CaseDetailData
          name={selectedCase.name}
          date={caseDetail.date}
          owner={caseDetail.status}
          caseDescription={selectedCase.desc}
          tasks={caseDetail.tasks}
        />
        {(selectedCase && selectedCase.id) ? <CaseDetailReference
          caseId={selectedCase.id}
        
        />: ""}
         <Accordion className="case-documents">
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          className="case-documents-head-section"
          sx={{marginBottom:0}}
        >
         <h2 className="caseDocuments-headtag">Case Documents</h2>
        </AccordionSummary>
        <AccordionDetails sx={{paddingLeft:0}}>
        <RelatedCaseDocuments id = {selectedCase.id} ></RelatedCaseDocuments>
        </AccordionDetails>
      </Accordion>
      
      </section>
      <section className="case-history-container">
        <CaseHistory  caseId = {selectedCase.id}></CaseHistory>
      </section>
    </div>
    <CustomizedDialog title="Upload File" isOpen={isOpenPopup} setIsOpen={setOpenPopup} handleClose={handleClose}><Upload onSuccess={handleClose} /></CustomizedDialog>
    </>
  );
};

export default CaseDetails;
