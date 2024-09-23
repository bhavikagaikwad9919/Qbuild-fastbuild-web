import React, { useRef, useEffect, useState } from "react";
import FusePageCarded from "@fuse/core/FusePageCarded";
import Typography from "@material-ui/core/Typography";
import { useDispatch, useSelector } from "react-redux";
import UserHeader from "./DataStructureHeader";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import ChipInput from "material-ui-chip-input";
import { getData, updateData, addData } from "./store/dataSlice";
import { Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

function DataStructure(props) {
  const classes = useStyles(props);
  const pageLayout = useRef(null);
  const dispatch = useDispatch();
  const details = useSelector(({ dataStructure }) => dataStructure.allData);
  const teamRole = useSelector(({ dataStructure }) => dataStructure.teamRoles);
  const [pageLoading, setPageLoading] = useState(false);
  const [teamRoles, setTeamRoles] = useState([]);
  const [plansType, setPlansType] = useState([]);
  const [taskTitle, setTaskTitle] = useState([]);
  const [agencyType, setAgencyType] = useState([]);
  const [laborRole, setLaborRole] = useState([]);
  const [equipmentType, setEquipmentType] = useState([]);
  const [gradeType, setGradeType] = useState([]);

  useEffect(() => {
    dispatch(getData());
  }, [dispatch]);

  useEffect(() => {
    if(details.length > 0){
      setTeamRoles(details[0].teamRoles);
      setPlansType(details[0].plansType);
      setTaskTitle(details[0].taskTitle);
      setAgencyType(details[0].agencyType);
      setLaborRole(details[0].laborRole);
      setEquipmentType(details[0].equipmentType);
      setGradeType(details[0].gradeType);
    }

  }, [details]);

  // Team Role

  function handleAddTeamRole(value) {
    setTeamRoles((teamRoles) => [...teamRoles, value]);   
  }

  function handleDeleteTeamRole(role, index) {
    setTeamRoles(teamRoles.filter((item) => item !== role));
  } 

  // Plans Type

  function handleAddPlansType(value) {
    setPlansType((plansType) => [...plansType, value]);   
  }

  function handleDeletePlansType(type, index) {
    setPlansType(plansType.filter((item) => item !== type));
  } 

  // Task Title

  function handleAddTaskTitle(value) {
    setTaskTitle((taskTitle) => [...taskTitle, value]);   
  }

  function handleDeleteTaskTitle(title, index) {
    setTaskTitle(taskTitle.filter((item) => item !== title));
  } 

  // Agency Type

  function handleAddAgencyType(value) {
    setAgencyType((agencyType) => [...agencyType, value]);   
  }

  function handleDeleteAgencyType(type, index) {
    setAgencyType(agencyType.filter((item) => item !== type));
  } 

  // Labor Role

  function handleAddLaborRole(value) {
    setLaborRole((laborRole) => [...laborRole, value]);   
  }

  function handleDeleteLaborRole(role, index) {
    setLaborRole(laborRole.filter((item) => item !== role));
  } 

  // Equipment Type

  function handleAddEquipmentType(value) {
    setEquipmentType((equipmentType) => [...equipmentType, value]);   
  }

  function handleDeleteEquipmentType(type, index) {
    setEquipmentType(equipmentType.filter((item) => item !== type));
  } 

  // Grade Type

  function handleAddGradeType(value) {
    setGradeType((gradeType) => [...gradeType, value]);   
  }

  function handleDeleteGradeType(type, index) {
    setGradeType(gradeType.filter((item) => item !== type));
  } 

  const updateContent = () =>{
    let values = { teamRoles, plansType, taskTitle, agencyType, laborRole, equipmentType, gradeType }
    if(details.length === 0)
    {
      setPageLoading(true); 
      dispatch(addData({ values })).then((response) => {
        dispatch(getData());
        setPageLoading(false); 
      });
    }else{
      setPageLoading(true); 
      let id = details[0]._id;
      dispatch(updateData({ id, values })).then((response) => {
        dispatch(getData());
        setPageLoading(false); 
      });
    }
  }

  
  return (
    <React.Fragment>
       <Backdrop className={classes.backdrop} open={pageLoading}>
          <CircularProgress color="inherit" />
       </Backdrop>
      <FusePageCarded
        classes={{
          toolbar: "p-0",
          header: "min-h-72 h-72 sm:h-136 sm:min-h-136",
        }}
        header={<UserHeader pageLayout={pageLayout} />}
        content={
          <div>
              <>
                <div className="p-16 sm:p-24">
                  <div className="flex flex-1 w-full mb-12">
                    <Typography className= "font-bold" variant="title">Team Roles:</Typography>
                  </div>
                  <div className="flex flex-1 w-full mb-12">
                    <ChipInput
                      id="TeamRole"
                      value={teamRoles}
                      className = "w-full"
                      onAdd={(role) => handleAddTeamRole(role)}
                      onDelete={(role, index) => handleDeleteTeamRole(role, index)}
                      variant="outlined"
                  />
                  </div>

                  <div className="flex flex-1 w-full mb-12">
                    <Typography className= "font-bold" variant="title">Plans Type:</Typography>
                  </div>
                  <div className="flex flex-1 w-full mb-12">
                    <ChipInput
                      id="PlansType"
                      value={plansType}
                      className = "w-full"
                      onAdd={(type) => handleAddPlansType(type)}
                      onDelete={(type, index) => handleDeletePlansType(type, index)}
                      variant="outlined"
                   />
                  </div>

                  <div className="flex flex-1 w-full mb-12">
                    <Typography className= "font-bold" variant="title">Task Title:</Typography>
                  </div>
                  <div className="flex flex-1 w-full mb-12">
                    <ChipInput
                      id="TaskTitle"
                      value={taskTitle}
                      className = "w-full"
                      onAdd={(title) => handleAddTaskTitle(title)}
                      onDelete={(title, index) => handleDeleteTaskTitle(title, index)}
                      variant="outlined"
                    />
                  </div>

                  <div className="flex flex-1 w-full mb-12">
                    <Typography className= "font-bold" variant="title">Agency Type:</Typography>
                  </div>
                  <div className="flex flex-1 w-full mb-12">
                    <ChipInput
                      id="agencyType"
                      value={agencyType}
                      className = "w-full"
                      onAdd={(title) => handleAddAgencyType(title)}
                      onDelete={(title, index) => handleDeleteAgencyType(title, index)}
                      variant="outlined"
                    />
                  </div>

                  <div className="flex flex-1 w-full mb-12">
                    <Typography className= "font-bold" variant="title">Labor Role:</Typography>
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

                  <div className="flex flex-1 w-full mb-12">
                    <Typography className= "font-bold" variant="title">Equipment Type:</Typography>
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

                 <div className="flex w-full h-full items-end justify-start mt-35 ml-20 mb-25">
                   <Button
                      style={{ backgroundColor: "orange" }}
                      variant="contained"
                      onClick={() => {updateContent()}}
                      className = "mb-20"
                   >
                      Update
                   </Button>
                </div>         
              </>
          </div>
        }
        sidebarInner
        ref={pageLayout}
        innerScroll
      />
    </React.Fragment>
  );
}

export default DataStructure;
