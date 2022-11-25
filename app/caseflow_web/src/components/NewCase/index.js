import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { Controller, useForm } from "react-hook-form";
import Divider from "@mui/material/Divider";
import "./NewCase.scss"

const NewCase = () => {
  const { handleSubmit, reset, control,register } = useForm();
  const onSubmit = (data) => console.log(data);


  return (
    <div className="new-case-container">
      <Typography  className="new-case-heading" variant="h6">
        New Case
      </Typography>
      <Divider sx={{ borderBottomWidth: 3 }} className="new-case-divider" />
      <Grid container spacing={3} className="new-case-table-grid" >
        <Grid item xs={4}>
          <Typography  className="new-case-table-heading" variant="body2">
            Case Name :
          </Typography>
          </Grid>
          <Grid item xs={8}>
            <Controller
            name={"name"}
            control={control}
            render={({ field: { onChange, value } }) => (
            <TextField
              id="standard-basic"
              label="Case Name"
              variant="standard"                           
              value={value} 
              onChange={onChange}
              placeholder="File Name..."
              sx={{
                "& .MuiInputLabel-root": { color: "#404040" },
                borderBottom: "1px solid #404040",  
                width: "100%",            
              }}    
              InputProps={{ disableUnderline: true }}
            />
          )}
        />          
      </Grid>
      </Grid>
      <Grid container spacing={1} className="new-case-table-grid">
        <Grid item xs={4}>
          <Typography className="new-case-table-heading" variant="body2">
            Case Description :
          </Typography>
        </Grid>
        <Grid item xs={8}>
        <Controller
        name={"description"}
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextField
            id="standard-basic"
            label="Description"
            multiline
            rows={1}
            variant="standard"
            sx={{
              "& .MuiInputLabel-root": { color: "#404040" },
              borderBottom: "1px solid #404040",  
              width: "100%",            
            }}    
            InputProps={{ disableUnderline: true }} 
            placeholder="Enter the details of the Case"
            value={value} 
            onChange={onChange}
          />
        )}
      />          
        </Grid>
      </Grid>
      <Grid container spacing={1} className="new-case-table-grid">
        <Grid item xs={4}>
          <Typography className="new-case-table-heading" variant="body2">
            Attach Documents :
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <input type="file" id="actual-btn" {...register("file")} hidden />

          <Button
          className="btn-style-container"            
            variant="outlined"
          >
            <label
              htmlFor="actual-btn"
              className="btn-style-label"              
            >
              Choose File
            </label>
          </Button>
        </Grid>
      </Grid>
      <div className="new-case-action-center" >
          <Button
          className="new-case-action-btn"           
            variant="contained"
            onClick={handleSubmit(onSubmit)}
          >
            Submit
          </Button>
          <Button
          className="new-case-action-btn"           
            variant="contained"
            onClick={() => reset()} 
          >
           Reset
          </Button>
        </div>
    </div>
  );
};

export default NewCase;
