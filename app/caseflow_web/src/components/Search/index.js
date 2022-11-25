import React from "react";
import {
  FormControl,
  Input,
  InputAdornment,
  Box,
  Divider,
  Select,
  MenuItem,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import "./Search.scss"
const Search = ({ setSearchField, dropDownArray, setSearchColumn }) => {
  return (
    <>
      <FormControl fullWidth sx={{ m: 1 }} variant="standard">
        <Input
          id="standard-adornment-amount"
          placeholder="Search"
          onChange={(e) => {
            setSearchField(e.target.value);
          }}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
          endAdornment={
            <div>
              <Box
              className="search-container-box"
                sx={{                  
                  bgcolor: "background.paper",
                  color: "text.secondary",
                  "& hr": {
                    mx: 0.5,
                  },
                }}
              >
                <Divider orientation="vertical" variant="middle" flexItem />
                <FormControl variant="standard" sx={{ m: 1, minWidth: 70 }}>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    label="Age"
                    disableUnderline
                    defaultValue={dropDownArray ? dropDownArray[0] : "All"}
                    IconComponent={KeyboardArrowDownIcon}
                    onChange={(e) => {
                      setSearchColumn(e.target.value);
                    }}
                  >
                    {dropDownArray ? (
                      dropDownArray.map((dropDownValue) => (
                        <MenuItem key={dropDownValue} value={dropDownValue}>
                          {dropDownValue}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value="All">All</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Box>
            </div>
          }
        />
      </FormControl>
    </>
  );
};

export default Search;
