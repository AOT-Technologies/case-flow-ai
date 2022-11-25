import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { fetchCMISfile } from "../../apiManager/services/cmisService";
import "./download.scss";

const Download = (props) => {
  const [value, setValue] = useState("");

  return (
    <div className="download-file">
      <TextField
        id="outlined-basic"
        label="Document Id"
        variant="outlined"
        style={{
          width: "100%",
        }}
        value={value}
        onChange={(evt) => setValue(evt.target.value)}
        placeholder="Enter document Id"
      />

      <Button
        style={{
          width: "100%",
          height: "3.4375rem",
          backgroundColor: "#1B34FB",
        }}
        variant="contained"
        onClick={fetchCMISfile(value,props.selectedDMS)}
      >
        Download File
      </Button>
    </div>
  );
};

export default Download;
