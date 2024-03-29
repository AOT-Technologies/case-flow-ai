import React, { useEffect, useState } from "react";
import SingleCaseDetail from "./singleCaseDetails/singleCaseDetail";
import "./caseHistory.scss";
import FilterMuiComponent from "../FilterMuiComponent/FilterMuiComponent";
import {
  setoptionsForFilter,
  setFilteredCaseHistory,
  setCaseHistory,
} from "../../reducers/caseHistoryReducer";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../../interfaces/stateInterface";

const CaseHistory = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: State) => state.auth.userDetails);
  const [
    selectedCaseHistoryFilterOption,
    setselectedCaseHistoryFilterOption,
  ]: any = useState("");

  const selectedCaseHistory = useSelector(
    (state: any) => state.caseHistory.caseHistory
  );
  const selectedFilteredCaseHistory = useSelector(
    (state: any) => state.caseHistory.filteredCaseHistory
  );

  const optionsForFilter = useSelector(
    (state: any) => state.caseHistory.optionsForFilter
  );

  const Filteroptions = () => {
    let arrayOfCaseHistoryTypeValues: any[] = selectedCaseHistory
      .map((eachHistory) => eachHistory.caseHistoryType)
      .filter((value, index, self) => self.indexOf(value) === index)
      .map((eachValue, index) => {
        return { id: index + 1, text: eachValue };
      });
    arrayOfCaseHistoryTypeValues = [
      { id: 0, text: "All" },
      ...arrayOfCaseHistoryTypeValues,
    ];
    dispatch(setoptionsForFilter(arrayOfCaseHistoryTypeValues));
  };

  const onFilterChangehandler = (e: any) => {
    setselectedCaseHistoryFilterOption(e.target.value);
    if (e.target.value === "All")
      dispatch(setFilteredCaseHistory(selectedCaseHistory));
    else {
      dispatch(
        setFilteredCaseHistory(
          selectedCaseHistory.filter(
            (eachCaseHistory) =>
              eachCaseHistory.caseHistoryType ===
              optionsForFilter.filter(
                (eachOptions) => eachOptions.text === e.target.value
              )[0].text
          )
        )
      );
    }
  };

  useEffect(() => {
    Filteroptions();
  }, [selectedCaseHistory]);

  useEffect(() => {
    return () => {
      dispatch(setCaseHistory([]));
      dispatch(setFilteredCaseHistory([]));
    };
  }, []);

  return (
    <div className="case-history-container">
      <header className="case-history-header">
        <div className="case-history-header-name">Case History</div>
        <FilterMuiComponent
          label="Filter"
          selected={selectedCaseHistoryFilterOption}
          options={optionsForFilter}
          onChnagehandler={onFilterChangehandler}
        />
      </header>
      {selectedFilteredCaseHistory.map((singleCaseHistory, index) => {
        return (
          <SingleCaseDetail
            key={singleCaseHistory.id}
            caseHistoryData={singleCaseHistory}
            userInfo={userInfo}
            progress={
              index != selectedFilteredCaseHistory.length - 1 ? true : false
            }
          />
        );
      })}
    </div>
  );
};

export default CaseHistory;
