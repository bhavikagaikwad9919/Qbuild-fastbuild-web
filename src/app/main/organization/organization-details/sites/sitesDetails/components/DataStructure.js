import React, { useRef, useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import ChipInput from "material-ui-chip-input";
import { Button } from "@material-ui/core";
import { updateDataStructure } from "../../store/sitesSlice";
import Backdrop from "@material-ui/core/Backdrop";
import FuseUtils from "@fuse/utils";
import CircularProgress from "@material-ui/core/CircularProgress";
import {  dispatchWarningMessage } from "app/utils/MessageDispatcher";

import { red, grey } from "@material-ui/core/colors";

import Buildings from "./Buildings"

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  delete: {
    color: grey[400],
    "&:hover": {
      color: red[400],
    },
  },
  appBar: {
    position: 'relative',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 3,
    color: '#fff',
  },
}));

function DataStructure(props) {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const details = useSelector(({ sites }) => sites.details);
  const labourRole = useSelector(({ sites }) => sites.dataStructure.laborRole);
  const eqType = useSelector(({ sites }) => sites.dataStructure.equipmentType);
  const buildings = useSelector(({ sites }) => sites.dataStructure.buildings);
  const grade = useSelector(({ sites }) => sites.dataStructure.gradeType);
  const [pageLoading, setPageLoading] = useState(false);
  const [laborRole, setLaborRole] = useState([]);
  const [equipmentType, setEquipmentType] = useState([]);
  const [gradeType, setGradeType] = useState([]);
  const [hide, setHide] = useState();
  const members = useSelector( ({ organizations }) => organizations.members);
  const user = useSelector(({ auth }) => auth.user);
  
  useEffect(() => {
    if(labourRole !== undefined){
      setLaborRole(labourRole);
    }
    if(eqType !== undefined){
      setEquipmentType(eqType);
    }
    if(grade !== undefined){
      setGradeType(grade);
    }

    let member = members.filter((t)=> t._id === user.data.id && t.designation === "CIDCO Official");

    if(member.length > 0){
      setHide(true)
    }else{
      setHide(false)
    }
  }, [labourRole, eqType, grade, members]);
  // Labor Role

  function handleAddLaborRole(value) {
    setLaborRole((laborRole) => [...laborRole, value.toLocaleUpperCase()]);   
  }

  function handleDeleteLaborRole(role, index) {
    setLaborRole(laborRole.filter((item) => item !== role));
  } 

  // Equipment Type

  function handleAddEquipmentType(value) {
    setEquipmentType((equipmentType) => [...equipmentType, value.toLocaleUpperCase()]);   
  }

  function handleDeleteEquipmentType(type, index) {
    setEquipmentType(equipmentType.filter((item) => item !== type));
  }

  // Grade TypelaborRole

  function handleAddGradeType(value) {
    setGradeType((gradeType) => [...gradeType, value]);   
  }
  
  function handleDeleteGradeType(type, index) {
    setGradeType(gradeType.filter((item) => item !== type));
  } 

 // Update Content

  const updateContent = () =>{
    let values = { laborRole, equipmentType, gradeType, buildings};

    setPageLoading(true);
    dispatch(
      updateDataStructure({ 
        organizationId: props.organizationId,
        siteId: details._id,
        values
      })
    ).then((response) => {
      setPageLoading(false); 
    });
  }

  return (
    <React.Fragment>
      <div>
        <Backdrop className={classes.backdrop} open={pageLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
            
        <div className="p-10 sm:p-10">
          <div className="flex flex-1 w-full mb-12">
            <Typography className= "font-bold" variant="subtitle1">Labor Role:</Typography>
          </div>
                  
          <div className="flex flex-1 w-full mb-12">
            <ChipInput
              id="laborRole"
              value={laborRole}
              className = "w-full"
              onAdd={(title) => handleAddLaborRole(title)}
              onDelete={(title, index) => handleDeleteLaborRole(title, index)}
              variant="outlined"
            />
          </div>
        </div>  

        <div className="p-10 sm:p-10">
          <div className="flex flex-1 w-full mb-12">
            <Typography className= "font-bold" variant="subtitle1">Equipment Type:</Typography>
          </div>
                  
          <div className="flex flex-1 w-full mb-12">
            <ChipInput
              id="equipmentType"
              value={equipmentType}
              className = "w-full"
              onAdd={(title) => handleAddEquipmentType(title)}
              onDelete={(title, index) => handleDeleteEquipmentType(title, index)}
              variant="outlined"
            />
          </div>
        </div>

        <div className="p-10 sm:p-10">
         <div className="flex flex-1 w-full mb-12">
            <Typography className= "font-bold" variant="title">Grade Type:</Typography>
         </div>
         <div className="flex flex-1 w-full mb-12">
            <ChipInput
              id="gradeType"
              value={gradeType}
              className = "w-full"
              onAdd={(title) => handleAddGradeType(title)}
              onDelete={(title, index) => handleDeleteGradeType(title, index)}
              variant="outlined"
            />
         </div>  
        </div>

        {/* for building status */}
        <Backdrop className={classes.backdrop} open={pageLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <div className="p-16 sm:p-24" >
          <Buildings organizationId={props.organizationId} /> 
        </div>
     
        <div className="flex w-full h-full items-end justify-start mt-35 ml-20 mb-25">
          {hide === false ? 
            <Button
              style={{ backgroundColor: "orange" }}
              variant="contained"
              onClick={() => {updateContent()}}
              className = "mb-20"
            >
              Update
            </Button>
          :null}
        </div>
      </div>
    </React.Fragment>
  );
}

export default DataStructure;
