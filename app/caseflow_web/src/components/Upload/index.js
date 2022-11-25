import React, { useEffect, useState } from "react";
import "./upload.scss";
import {
  uploadCMISfile,
  updateCMISdocument,
} from "../../apiManager/services/cmisService";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Typography from "@mui/material/Typography";
import FileViewer from 'react-file-viewer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useSelector,useDispatch} from "react-redux";
import { setDocumentList } from "../../reducers/documentsReducer";
import { getAllDocuments } from "../../services/DocumentManagementService";
const Upload = (props) => {
  const [response,setResponse] = useState("")
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileDescription, setFileDescription] = useState("");
  const [actionSelected, setActionSelected] = useState("upload");
  const [documentID, setDocumentID] = useState(1);
  const[previewURL,setPreviewURL] = useState()
  const [filetypeUploaded,setfileTypeUploaded] = useState(null) 
  // const documents = useSelector(state=>state.documents.getDocumentList);
  const dispatch = useDispatch();
  useEffect(() => {
    fetchDocumentDetails();
    
  }, []);

  
  async function fetchDocumentDetails() {
    let output = await getAllDocuments();
    output = output.map((element) => {
      return {
        ...element,
        creationdate: element.creationdate.split("T")[0],
        modificationdate: element.modificationdate.split("T")[0],
      };
    });
    dispatch(setDocumentList(output))
    // setDocumentDetails(output);
    // setFilteredDocumentDetails(output);
  }

  function handleUpload(event) {   
    const uploadedDoc = event.target.files[0];
    //setting URL for FileViewer   
    setfileTypeUploaded(uploadedDoc.type.split("/")[1] )   
    const objectURl = URL.createObjectURL(uploadedDoc)

    setPreviewURL(objectURl)   
    setFile(uploadedDoc); //set file into state
    setFileName(uploadedDoc.name); //set the filename after importing new file
    
  }
  function fileNameChange(event) {
    setFileName(event.target.value); //set the filename from text box if name is alterded
  }

  const onActionSelectChange = (event) => {
    setActionSelected(event.target.value);
  };
  const onSubmitHandler = async () => {
    if (actionSelected === "upload") {
      const response = await  uploadCMISfile(file, fileName, fileDescription,props.selectedDMS);
      console.log(response.data)
      if (response && response.data && response.data.status == "success")
        {fetchDocumentDetails();
          toast.success("Success")
          setFile("");
          setFileName("")
          setFileDescription("")
          setPreviewURL("")
      }
        else
        toast.error("Error")
      setResponse(response)      
      console.log(response);
    }

    if (actionSelected === "update") {
      updateCMISdocument(documentID, file, fileName, fileDescription,props.selectedDMS);
    }
  };

  const onDescriptionchange = (event) => {   
    event.target.value == null
      ? setFileDescription("My text document description...")
      : setFileDescription(event.target.value);
  };
  const onIDchange = (event) => {
    event.target.value == null
      ? setDocumentID(1)
      : setDocumentID(parseInt(event.target.value));
  };
  const onPreviewErrorhandler = (e) =>{
    console.log(e);
  }

  return (
    <>
    <div className="upload-grid">
      <div className="upload-left">
        <div className="upload-row">
          <input type="file" id="actual-btn" onChange={handleUpload} hidden />
          <Button            
            className="choose-file-btn-upload"
            variant="contained"
          >
            <label
              htmlFor="actual-btn"
              className="choose-file-btn-label-upload"              
            >
              {file === "" ? "Choose File" : "replace file"}
            </label>
          </Button>
          <TextField
            id="disabled-basic"
            sx={{
              "& .MuiInputLabel-root": { color: "#404040" },
              borderBottom: "1px solid #404040",              
            }}
            InputProps={{ disableUnderline: true }}
            label="File Name"
            variant="standard"
            className="file-name-text-field-upload"             
            value={fileName}
            onChange={fileNameChange}
            placeholder="File Name..."
          />
        </div>
        <div
        className="description-box-container"         
        >
          {file !== "" && (
            <div
            className="description-box-container"
            >
              <TextField
                id="outlined-multiline-static"
                label="Description"
                multiline
                rows={4}
                variant="standard"
                sx={{
                  "& .MuiInputLabel-root": { color: "#404040" },
                  borderBottom: "1px solid #404040",  
                  width: "100%",            
                }}    
                InputProps={{ disableUnderline: true }}           
                value={fileDescription}
                onChange={onDescriptionchange}
                placeholder="My text document description..."
              />
            </div>
          )}
        </div>
        <div className="upload-type-selection">
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Choose upload
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={actionSelected}
              onChange={onActionSelectChange}
            >
              <FormControlLabel
                value="upload"
                control={<Radio 
                   sx={{
                  '&, &.Mui-checked': {
                    color: '#404040',
                  },
                }} />}
                label="Upload"
              />
              <FormControlLabel
                value="update"
                control={<Radio 
                   sx={{
                  '&, &.Mui-checked': {
                    color: '#404040',
                  },
                }}/>}
                label="update"
              />
            </RadioGroup>
          </FormControl>
        </div>
        {actionSelected === "update" && (
          <div          
          className="description-box-container"
          >
            <TextField
              id="outlined-basic"
              className="document-update-id-text-field"
              label="Document Id"
              variant="standard"
              sx={{
                "& .MuiInputLabel-root": { color: "#404040" },
                borderBottom: "1px solid #404040",  
                width: "100%",            
              }}    
              InputProps={{ disableUnderline: true }}             
              onChange={onIDchange}
              placeholder="Document ID..."
            />
          </div>
        )}
         {/* {(previewURL &&filetypeUploaded!=="plain" ) && <div className="pgViewContainer" >
          <p className="preview-heading">Preview</p>
         <FileViewer 
          key={Math.random()}      
          fileType={filetypeUploaded}
          filePath={previewURL}
          onError={onPreviewErrorhandler}
        >
        </FileViewer>
         </div>}   */}

        <div className="upload-button">
          <Button 
            variant="outlined"
            onClick={onSubmitHandler}
          >
            Upload file
          </Button>
        </div>
      </div>

      <div className="upload-right">
        {/* <div className="display-upload-result"> */}
          {/* <Typography style = {{
            padding :"1rem 0rem 1rem 1rem"

          }}variant="h5" >Result : </Typography> */}

          {/* <div style = {{
                      padding :"1rem 0rem 1rem 1rem",
                      width:"100%",
                      height: "100%"


                    }}><pre>{JSON.stringify(response, null, 2) }</pre> </div> */}
     {(previewURL &&filetypeUploaded!=="plain" ) && <div className="display-upload-result" >        
         <FileViewer 
          key={Math.random()}      
          fileType={filetypeUploaded}
          filePath={previewURL}
          onError={onPreviewErrorhandler}
        >
        </FileViewer>
      </div>} 

        </div>
      {/* </div> */}
    </div> 
    <ToastContainer/>
    </>
  );
};

export default Upload;
