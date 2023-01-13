import React, { useEffect, useState } from "react";
import Search from "../Search";
import "./cases.scss"
import CaseList from "../CaseList";
import {useSelector,useDispatch} from "react-redux";
import { State, store } from "../../interfaces/stateInterface";
import { searchCases } from "../../services/CaseService";
import { setTotalCaseCount } from "../../reducers/newCaseReducer";

const caseListProps = {
  title : "Cases",
  count : 5,
  isShowSort :false,
  pagination:true
}
const Cases = (
  // { children }
  ) => {
  const [filteredCaseDetails, setFilteredCaseDetails] = useState([]);
  const [searchField, setSearchField] = useState("");
  const [searchColumn, setSearchColumn] = useState("name");
  const [dropDownArray, setdropDownArray] = useState(['Name', "Description"]);

  const dispatch = useDispatch()
  const selectedPage = useSelector((state:State)=>state.cases.pageSelected)

  const filterDocumentDetails = async () => {    
    let searchResult = await searchCases(searchField,searchColumn,selectedPage)    
   let searchResultCases = searchResult.Cases.map((element) => {
      return {...element,status:"Open"};
    });
    
    if(searchResultCases)
    setFilteredCaseDetails(searchResultCases)
    dispatch(setTotalCaseCount(searchResult.totalCount))
  };



  useEffect(() => {
    filterDocumentDetails();
  }, [searchField,searchColumn,selectedPage]);


  return (
    <section className="dashboard">
      <h1 className="title">CaseFlow</h1>
      <div className="search">
      <Search
            setSearchField={setSearchField}
            dropDownArray={dropDownArray}
            setSearchColumn={setSearchColumn}
          ></Search>
      </div>     
        <div className="recent-cases"><CaseList  config={caseListProps}    allRecentCases = {filteredCaseDetails}  ></CaseList></div>
        {/* <div className="my-task"><MyTask></MyTask></div> */} 
    </section>
  );
};

export default Cases;
