import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getInformation,
  addInformation,
} from "app/main/projects/store/projectsSlice";
import { makeStyles } from "@material-ui/core/styles";
import { red, grey, blue } from "@material-ui/core/colors";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Typography,
  Button,
  Backdrop,
  CircularProgress,
  Grid,Icon, List, ListItem, ListItemText, DialogActions
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import RepairHistoryDialog from "./RepairHistoryDialog";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  productGridImageView: {
    position: "absolute",
    color: grey[400],
    "&:hover": {
      color: blue[400],
    },
  },
  productGridImageDelete: {
    position: "absolute",
    color: grey[400],
    "&:hover": {
      color: red[400],
    }
  },
}));

let fileState = {
  name: "",
  file: "",
  url: "",
  size: ""
}

const AdditionalInformation = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const projectId = useSelector(({ projects }) => projects.details._id);
  const project = useSelector(({ projects }) => projects);
  const loading = useSelector(({ projects }) => projects.loading);
  const information = useSelector(({ projects }) => projects.additionalInformation);
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState({
    ward: information.ward,
    constructionYear: information.constructionYear,
    no_of_storey:information.no_of_storey,
    use:information.use,
    date_of_inspection:information.date_of_inspection,
    validity_period:information.validity_period
  });
  const [constructionMode, setconstructionMode] = useState(information.constructionMode);
  const [conditionsOf, setconditionsOf] = useState(information.conditionsOf);
  const [breifDescription, setbreifDescription] = useState(information.breifDescription);
  const [repairHistory, setHistory] = useState(information.repairHistory);
  const [conclusions, setConclusions] = useState(information.conclusions);
  const [livableRepairs, setlivableRepairs] = useState({observations:"",key_reason:""});
  const [structuralRepairs, setstructuralRepairs] = useState({observations:"",key_reason:""});
  const [courseofRepairs, setcourseofRepairs] = useState({observations:"",key_reason:""});
  const [natureofRepairs, setnatureofRepairs] = useState({observations:"",key_reason:""});
  const [propping, setpropping] = useState({observations:"",key_reason:""});
  const [safetyMeasures, setsafetyMeasures] = useState({observations:"",key_reason:""});
  const [enhancement, setenhancement] = useState({observations:"",key_reason:""});
  const [repairCost, setrepairCost] = useState({observations:"",key_reason:""});
  const [reconstructionCost, setreconstructionCost] = useState({observations:"",key_reason:""});
  const [remarks, setremarks] = useState({observations:"",key_reason:""});
  const [criticalCondition, setcriticalCondition] = useState({observations:"",key_reason:""});
  const [image, setImage] = useState(fileState);
  const [deleteImage, setDeleteImage] = useState(fileState)
  const [viewOpen, setViewOpen] = useState(false);
  const inputFile = useRef(null);
  const onButtonClick = () => {
    inputFile.current.click();
  };

  useEffect(() => {
    dispatch(getInformation(projectId));
  }, []);

  useEffect(() => {
    if (information.conditionsOf) {
      setconditionsOf(information.conditionsOf);
    }
    if (information.constructionMode) {
      setconstructionMode(information.constructionMode);
    }
    if (information.repairHistory) {
      setHistory(information.repairHistory);
    }
    if (information.breifDescription) {
      setbreifDescription(information.breifDescription);
    }
  
    if (information.conclusions) {
     
      // setConclusions({
      //   livableRepairs:livableRepairs,
      //   structuralRepairs:structuralRepairs,
      //   course_of_repairs:courseofRepairs,
      //   nature_of_repairs:natureofRepairs,
      //   propping:propping,
      //   safety_measures:safetyMeasures,
      //   enhancement:enhancement,
      //   repairCost:repairCost,
      //   reconstructionCost:reconstructionCost,
      //   remarks:remarks,
      //   critical_condition:criticalCondition
      // });
      if (information.conclusions.livableRepairs.length>0){
        setlivableRepairs(information.conclusions.livableRepairs[0]);
      }
      if (information.conclusions.structuralRepairs.length>0){
      setstructuralRepairs(information.conclusions.structuralRepairs[0]);
      }
      if (information.conclusions.course_of_repairs.length>0){
      setcourseofRepairs(information.conclusions.course_of_repairs[0]);
      }
      if (information.conclusions.nature_of_repairs.length>0){
      setnatureofRepairs(information.conclusions.nature_of_repairs[0]);
      }
      if (information.conclusions.propping.length>0){
      setpropping(information.conclusions.propping[0]);
      }
      if (information.conclusions.safety_measures.length>0){
      setsafetyMeasures(information.conclusions.safety_measures[0]);
      }
      if (information.conclusions.enhancement.length>0){
      setenhancement(information.conclusions.enhancement[0]);
      }
      if (information.conclusions.repairCost.length>0){
      setrepairCost(information.conclusions.repairCost[0]);
      }
      if (information.conclusions.reconstructionCost.length>0){
      setreconstructionCost(information.conclusions.reconstructionCost[0]);
      }
      if (information.conclusions.remarks.length>0){
      setremarks(information.conclusions.remarks[0]);
      }
      if (information.conclusions.critical_condition.length>0){
      setcriticalCondition(information.conclusions.critical_condition[0]);
      }
      if(information.image.url === undefined){
        setImage(fileState)
      }else{
        setImage(information.image)
      }
    }

    setDetails({
      ward: information.ward == undefined ? '' : information.ward,
      constructionYear: information.constructionYear == undefined ? '' : information.constructionYear,
      no_of_storey: information.no_of_storey == undefined ? '' : information.no_of_storey,
      use: information.use == undefined ? '' : information.use,
      date_of_inspection: information.date_of_inspection == undefined ? '' : information.date_of_inspection,
      validity_period: information.validity_period == undefined ? '' : information.validity_period
    });
    // if (information.ward) {
    //   console.log("here", information.ward);
    //   setDetails({ ...details, ward: information.ward });
    // }
    // if (information.constructionYear) {
    //   setDetails({
    //     ...details,
    //     constructionYear: information.constructionYear,
    //   });
    // }
  }, [information]);

  const handleChange = (prop, event, i) => {
    let newHistory = JSON.parse(JSON.stringify(repairHistory));
    newHistory[i][prop] = event.target.value;

    setHistory(newHistory);
  };

  const handleUploadChange = (event) => {
    const reader = new FileReader();
    const acceptedFiles = Array.from(event.target.files);
    reader.readAsBinaryString(acceptedFiles[0]);
    reader.onload = () => {
      setImage({
        ...image,
        file: acceptedFiles[0],
        name: acceptedFiles[0].name,
        url: `data:${acceptedFiles[0].type};base64,${btoa(reader.result)}`,
      });
    };
    reader.onerror = () => {
      console.log("error on load image");
    };
  };

  const deletePhoto = (data) =>{
    if(data.file === undefined){
      setDeleteImage(data)
    }
    setImage(fileState)
  }

  const handleSubmit = () => {
    let form = new FormData();
    form.set("ward", details.ward);
    form.set("constructionYear", details.constructionYear)
    form.set("no_of_storey", details.no_of_storey)
    form.set("use", details.use)
    form.set("date_of_inspection", details.date_of_inspection)
    form.set("validity_period", details.validity_period)
    form.set("constructionMode", JSON.stringify(constructionMode))
    form.set("conditionsOf", JSON.stringify(conditionsOf))
    if(repairHistory === ''){
      form.set("repairHistory", repairHistory)
    }else{
      form.set("repairHistory", JSON.stringify(repairHistory))
    }
    form.set("breifDescription", JSON.stringify(breifDescription))
    form.set("conclusions",JSON.stringify({
        livableRepairs:livableRepairs,
        structuralRepairs:structuralRepairs,
        course_of_repairs:courseofRepairs,
        nature_of_repairs:natureofRepairs,
        propping:propping,
        safety_measures:safetyMeasures,
        enhancement:enhancement,
        repairCost:repairCost,
        reconstructionCost:reconstructionCost,
        remarks:remarks,
        critical_condition:criticalCondition
    }))

    if(deleteImage.url !== '' && deleteImage.url !== undefined){
      form.set('DeleteFile', JSON.stringify(deleteImage));
    }

    if(image.file !== '' && image.file !== undefined){
      form.append("image", image.file);
    }else{
      form.set('image',JSON.stringify(image));
    }

    dispatch(addInformation({ projectId, form }));
  };

  const saveRepairHistory = (value) => {
    setHistory([...repairHistory, value]);
  };

  return (
    <>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="flex flex-1 flex-col gap-10 p-20">
        <div className="flex gap-10">
          <TextField
            className="w-1/2"
            variant="outlined"
            label="CTS NO. /Ward"
            value={details.ward}
            onChange={(event) =>
              setDetails({ ...details, ward: event.target.value })
            }
          />
          <TextField
            className="w-1/2"
            variant="outlined"
            label="No of Storey"
            value={details.no_of_storey}
            onChange={(event) =>
              setDetails({ ...details, no_of_storey: event.target.value })
            }
          />
        </div>
        <div>
        <div className="flex gap-10 mt-10">
          <TextField
            className="w-1/2"
            variant="outlined"
            label="Year of Construction"
            value={details.constructionYear}
            onChange={(event) =>
              setDetails({ ...details, constructionYear: event.target.value })
            }
          />
          <TextField
            className="w-1/2"
            variant="outlined"
            label="Use" 
            value={details.use}
            onChange={(event) =>
              setDetails({ ...details, use: event.target.value })
            }
          />
        </div>
        <div className="flex gap-10 mt-10 mb-10">
          <TextField
            className="w-1/2"
            variant="outlined"
            label="Date of Inspection"
            value={details.date_of_inspection}
            onChange={(event) =>
              setDetails({ ...details, date_of_inspection: event.target.value })
            }
          />
          <TextField
            className="w-1/2"
            variant="outlined"
            label="Validity Period of Report" 
            value={details.validity_period}
            onChange={(event) =>
              setDetails({ ...details, validity_period: event.target.value })
            }
          />
        </div>
        
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography color="textSecondary">Construction Mode</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className="flex flex-col w-full gap-10">
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Foundation"
                  value={constructionMode.foundation}
                  onChange={(event) =>
                    setconstructionMode({
                      ...constructionMode,
                      foundation: event.target.value,
                    })
                  }
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Floors"
                  value={constructionMode.floors}
                  onChange={(event) =>
                    setconstructionMode({
                      ...constructionMode,
                      floors: event.target.value,
                    })
                  }
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Walls"
                  value={constructionMode.walls}
                  onChange={(event) =>
                    setconstructionMode({
                      ...constructionMode,
                      walls: event.target.value,
                    })
                  }
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Beams"
                  value={constructionMode.beams}
                  onChange={(event) =>
                    setconstructionMode({
                      ...constructionMode,
                      beams: event.target.value,
                    })
                  }
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Columns"
                  value={constructionMode.columns}
                  onChange={(event) =>
                    setconstructionMode({
                      ...constructionMode,
                      columns: event.target.value,
                    })
                  }
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Roof"
                  value={constructionMode.roof}
                  onChange={(event) =>
                    setconstructionMode({
                      ...constructionMode,
                      roof: event.target.value,
                    })
                  }
                />
              </div>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography color="textSecondary">Repair History</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className="flex flex-col w-full">
                {repairHistory
                  ? repairHistory.map((history, i) => (
                      <Accordion className="p-0" key={history._id}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Typography color="textSecondary">
                            {history.year}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails className="p-0">
                          <div className="flex flex-col w-full gap-10">
                            <TextField
                              fullWidth
                              variant="outlined"
                              label="Year"
                              value={history.year}
                              onChange={(event) =>
                                handleChange("year", event, i)
                              }
                            />
                            <TextField
                              fullWidth
                              variant="outlined"
                              label="Notes"
                              value={history.notes}
                              onChange={(event) =>
                                handleChange("notes", event, i)
                              }
                            />
                            <TextField
                              fullWidth
                              variant="outlined"
                              label="Slab Recasting"
                              value={history.slabRecasting}
                              onChange={(event) =>
                                handleChange("slabRecasting", event, i)
                              }
                            />
                            <TextField
                              fullWidth
                              variant="outlined"
                              label="Column Jacketing"
                              value={history.columnJacketing}
                              onChange={(event) =>
                                handleChange("columnJacketing", event, i)
                              }
                            />
                            <TextField
                              fullWidth
                              variant="outlined"
                              label="Structural Repairs"
                              value={history.structuralRepairs}
                              onChange={(event) =>
                                handleChange("structuralRepairs", event, i)
                              }
                            />
                            <TextField
                              fullWidth
                              variant="outlined"
                              label="Tenantable Repairs"
                              value={history.tenantableRepairs}
                              onChange={(event) =>
                                handleChange("tenantableRepairs", event, i)
                              }
                            />
                            <TextField
                              fullWidth
                              variant="outlined"
                              label="Roof Waterproofing"
                              value={history.roofWaterproofing}
                              onChange={(event) =>
                                handleChange("roofWaterproofing", event, i)
                              }
                            />
                            <TextField
                              fullWidth
                              variant="outlined"
                              label="Plumbing"
                              value={history.plumbing}
                              onChange={(event) =>
                                handleChange("plumbing", event, i)
                              }
                            />
                            <TextField
                              fullWidth
                              variant="outlined"
                              label="Additional Alterations"
                              value={history.additionalAlterations}
                              onChange={(event) =>
                                handleChange("additionalAlterations", event, i)
                              }
                            />
                          </div>
                        </AccordionDetails>
                      </Accordion>
                    ))
                  : null}
                <div className="mt-10">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpen(true)}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
   
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography color="textSecondary">Conditions</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className="flex flex-col w-full gap-10">
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Internal Plaster"
                  value={conditionsOf.internalPlaster}
                  onChange={(event) =>
                    setconditionsOf({
                      ...conditionsOf,
                      internalPlaster: event.target.value,
                    })
                  }
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  label="External Plaster"
                  value={conditionsOf.externalPlaster}
                  onChange={(event) =>
                    setconditionsOf({
                      ...conditionsOf,
                      externalPlaster: event.target.value,
                    })
                  }
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Plumbing"
                  value={conditionsOf.plumbing}
                  onChange={(event) =>
                    setconditionsOf({
                      ...conditionsOf,
                      plumbing: event.target.value,
                    })
                  }
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Drainlines/ Chambers"
                  value={conditionsOf.drainLinesChambers}
                  onChange={(event) =>
                    setconditionsOf({
                      ...conditionsOf,
                      drainLinesChambers: event.target.value,
                    })
                  }
                />
              </div>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography color="textSecondary">Brief Description of repairs to be Done</Typography>
            </AccordionSummary>
            <AccordionDetails>
            <div className="flex flex-1 flex-col w-full gap-10">
            <div className="flex gap-10">
              <TextField
                className="w-1/2"
                variant="outlined"
                label="Water Proofing"
                value={breifDescription.waterproofing}
                onChange={(event) =>
                  setbreifDescription({ ...breifDescription, waterproofing: event.target.value })
                }
              />
              <TextField
                className="w-1/2"
                variant="outlined"
                label="External Plaster"
                value={breifDescription.externalPlaster}
                onChange={(event) =>
                  setbreifDescription({ ...breifDescription, externalPlaster: event.target.value })
                }
              />
            </div>
            <div className="flex gap-10">
              <TextField
                className="w-1/2"
                variant="outlined"
                label="Structural Repairs"
                value={breifDescription.structuralRepairs}
                onChange={(event) =>
                  setbreifDescription({ ...breifDescription, structuralRepairs: event.target.value })
                }
              />
              <TextField
                className="w-1/2"
                variant="outlined"
                label="Slab Recasting"
                value={breifDescription.slabRecasting}
                onChange={(event) =>
                  setbreifDescription({ ...breifDescription, slabRecasting: event.target.value })
                }
              />
            </div>
            <div className="flex gap-10">
              <TextField
                className="w-1/2"
                variant="outlined"
                label="Column Jacketing"
                value={breifDescription.columnJacketing}
                onChange={(event) =>
                  setbreifDescription({ ...breifDescription, columnJacketing: event.target.value })
                }
              />
              <TextField
                className="w-1/2"
                variant="outlined"
                label="RCC Cover to be replaced"
                value={breifDescription.rccCover}
                onChange={(event) =>
                  setbreifDescription({ ...breifDescription, rccCover: event.target.value })
                }
              />
            </div>
            <div className="flex gap-10">
              <TextField
                className="w-1/2"
                variant="outlined"
                label="Beam recasting"
                value={breifDescription.beamRecasting}
                onChange={(event) =>
                  setbreifDescription({ ...breifDescription, beamRecasting: event.target.value })
                }
              />
              <TextField
                className="w-1/2"
                variant="outlined"
                label="Partial Evacuation during
                repairs needed"
                value={breifDescription.partialEvacuation}
                onChange={(event) =>
                  setbreifDescription({ ...breifDescription, partialEvacuation: event.target.value })
                }
              />
            </div>
            <div className="flex gap-10">
              <TextField
                className="w-1/2"
                variant="outlined"
                label="Propping"
                value={breifDescription.propping}
                onChange={(event) =>
                  setbreifDescription({ ...breifDescription, propping: event.target.value })
                }
              />
                <TextField
                className="w-1/2"
                variant="outlined"
                label="Critical Observation"
                value={breifDescription.criticalObservation}
                onChange={(event) =>
                  setbreifDescription({ ...breifDescription, criticalObservation: event.target.value })
                }
              />
            </div>
         </div>
         </AccordionDetails>
          </Accordion>
      
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography color="textSecondary">Conclusions of Consultants</Typography>
            </AccordionSummary>
            <AccordionDetails>
            <div className="flex flex-1 flex-col w-full gap-10">
            <Typography color="textSecondary">Whether structure is livable / whether it is to be evacuated / pulled down</Typography>
            <div className="flex gap-10">
              <TextField
                className="w-1/2"
                variant="outlined"
                label="Observation"
                value={livableRepairs.length===0?"":livableRepairs.observations}
                onChange={(event) =>
                  setlivableRepairs({ ...livableRepairs, observations: event.target.value })
                }
              />
              <TextField
                className="w-1/2"
                variant="outlined"
                label="Key Reason"
                value={livableRepairs.key_reason}
                onChange={(event) =>
                  setlivableRepairs({ ...livableRepairs, key_reason: event.target.value })
                }
              />
            </div>
            <Typography color="textSecondary">Whether structure requires tenantable repairs / Major structural repairs & its time frame</Typography>
            <div className="flex gap-10">
            <TextField
                className="w-1/2"
                variant="outlined"
                label="Observation"
                value={structuralRepairs.observations}
                onChange={(event) =>
                  setstructuralRepairs({ ...structuralRepairs, observations: event.target.value })
                }
              />
              <TextField
                className="w-1/2"
                variant="outlined"
                label="Key Reason"
                value={structuralRepairs.key_reason}
                onChange={(event) =>
                  setstructuralRepairs({ ...structuralRepairs, key_reason: event.target.value })
                }
              />
            </div>
            <Typography color="textSecondary">Whether structure can be allowed to occupy during course of repairs</Typography>
            <div className="flex gap-10">
              <TextField
                className="w-1/2"
                variant="outlined"
                label="Observation"
                value={courseofRepairs.observations}
                onChange={(event) =>
                  setcourseofRepairs({ ...courseofRepairs, observations: event.target.value })
                }
              />
              <TextField
                className="w-1/2"
                variant="outlined"
                label="Key Reason"
                value={courseofRepairs.key_reason}
                onChange={(event) =>
                  setcourseofRepairs({ ...courseofRepairs, key_reason: event.target.value })
                }
              />
            </div>
            <Typography color="textSecondary">Nature / Methodology of repairs</Typography>
            <div className="flex gap-10">
              <TextField
                className="w-1/2"
                variant="outlined"
                label="Observation"
                value={natureofRepairs.observations}
                onChange={(event) =>
                  setnatureofRepairs({ ...natureofRepairs, observations: event.target.value })
                }
              />
              <TextField
                className="w-1/2"
                variant="outlined"
                label="Key Reason"
                value={natureofRepairs.key_reason}
                onChange={(event) =>
                  setnatureofRepairs({ ...natureofRepairs, key_reason: event.target.value })
                }
              />
            </div>
           <Typography color="textSecondary">Whether structure requires immediate propping, if so, its propping plan / methodology given</Typography>
           <div className="flex gap-10">
              <TextField
                className="w-1/2"
                variant="outlined"
                label="Observation"
                value={propping.observations}
                onChange={(event) =>
                  setpropping({ ...propping, observations: event.target.value })
                }
              />
              <TextField
                className="w-1/2"
                variant="outlined"
                label="Key Reason"
                value={propping.key_reason}
                onChange={(event) =>
                  setpropping({ ...propping, key_reason: event.target.value })
                }
              />
            </div>
            <Typography color="textSecondary">Whether other immediate safety measures required-What is specific recommendation?</Typography>
           <div className="flex gap-10">
              <TextField
                className="w-1/2"
                variant="outlined"
                label="Observation"
                value={safetyMeasures.observations}
                onChange={(event) =>
                  setsafetyMeasures({ ...safetyMeasures, observations: event.target.value })
                }
              />
              <TextField
                className="w-1/2"
                variant="outlined"
                label="Key Reason"
                value={safetyMeasures.key_reason}
                onChange={(event) =>
                  setsafetyMeasures({ ...safetyMeasures, key_reason: event.target.value })
                }
              />
            </div>
            <Typography color="textSecondary">Enhancement in life of structure after repairs / frequency of repairs required in extended life period</Typography>
           <div className="flex gap-10">
              <TextField
                className="w-1/2"
                variant="outlined"
                label="Observation"
                value={enhancement.observations}
                onChange={(event) =>
                  setenhancement({ ...enhancement, observations: event.target.value })
                }
              />
              <TextField
                className="w-1/2"
                variant="outlined"
                label="Key Reason"
                value={enhancement.key_reason}
                onChange={(event) =>
                  setenhancement({ ...enhancement, key_reason: event.target.value })
                }
              />
            </div>   
            <Typography color="textSecondary">Projected repair cost / Sq.ft.</Typography>
           <div className="flex gap-10">
              <TextField
                className="w-1/2"
                variant="outlined"
                label="Observation"
                value={repairCost.observations}
                onChange={(event) =>
                  setrepairCost({ ...repairCost, observations: event.target.value })
                }
              />
              <TextField
                className="w-1/2"
                variant="outlined"
                label="Key Reason"
                value={repairCost.key_reason}
                onChange={(event) =>
                  setrepairCost({ ...repairCost, key_reason: event.target.value })
                }
              />
            </div>  
            <Typography color="textSecondary">Projected reconstruction cost / Sq.ft.</Typography>
           <div className="flex gap-10">
              <TextField
                className="w-1/2"
                variant="outlined"
                label="Observation"
                value={reconstructionCost.observations}
                onChange={(event) =>
                  setreconstructionCost({ ...reconstructionCost,observations: event.target.value })
                }
              />
              <TextField
                className="w-1/2"
                variant="outlined"
                label="Key Reason"
                value={reconstructionCost.key_reason}
                onChange={(event) =>
                  setreconstructionCost({ ...reconstructionCost, key_reason: event.target.value })
                }
              />
            </div>  
            <Typography color="textSecondary">Specific remarks, whether building needs to be vacated / demolished / repairable</Typography>
           <div className="flex gap-10">
              <TextField
                className="w-1/2"
                variant="outlined"
                label="Observation"
                value={remarks.observations}
                onChange={(event) =>
                  setremarks({ ...remarks, observations: event.target.value })
                }
              />
              <TextField
                className="w-1/2"
                variant="outlined"
                label="Key Reason"
                value={remarks.key_reason}
                onChange={(event) =>
                  setremarks({ ...remarks, key_reason: event.target.value })
                }
              />
            </div>
            <Typography color="textSecondary">Whether structure in extremely critical condition</Typography>
           <div className="flex gap-10">
              <TextField
                className="w-1/2"
                variant="outlined"
                label="Observation"
                value={criticalCondition.observations}
                onChange={(event) =>
                  setcriticalCondition({ ...criticalCondition, observations: event.target.value })
                }
              />
              <TextField
                className="w-1/2"
                variant="outlined"
                label="Key Reason"
                value={criticalCondition.key_reason}
                onChange={(event) =>
                  setcriticalCondition({ ...criticalCondition, key_reason: event.target.value })
                }
              />
            </div>
          
            </div>
         </AccordionDetails>
          </Accordion>

          <Accordion variant="outlined">
           <AccordionSummary
             expandIcon={<ExpandMoreIcon />}
             aria-controls="panel1a-content"
             id="panel1a-header"
           >
              <Typography color="textPrimary">Upload Building Image</Typography>
           </AccordionSummary> 
           <AccordionDetails>
             <div className="flex flex-col w-full">
               <List component="nav" aria-label="mailbox folders">
                 {image.url !== '' && image.url !== undefined?
                    <React.Fragment>
                      <Grid container alignItems="center" direction="row">
                       <Grid item xs={10}>
                         <ListItem button>
                           <ListItemText primary={image.name}/>
                         </ListItem>
                       </Grid>
                       <Grid item xs={1} className={"pb-20 cursor-pointer"}>
                         <Icon
                           onClick={() => setViewOpen(true)}
                           className={classes.productGridImageView}
                         >
                           visibility
                         </Icon>
                       </Grid>
                       <Grid item xs={1} className={"pb-20 cursor-pointer"}>
                         <Icon  
                           onClick={() => deletePhoto(image)}
                           className={classes.productGridImageDelete}
                         >
                           delete
                         </Icon>
                       </Grid>
                      </Grid>
                    </React.Fragment>
                  :null}    
               </List>
               <div className="mt-10">
                 <input
                   accept='image/*'
                   ref={inputFile} 
                   multiple={false}
                   className='hidden'
                   id='button-file'
                   type='file'
                   onChange={handleUploadChange}
                 />
                 {image.url !== '' || image.url !== undefined ?
                   <Button
                     variant="contained"
                     color="primary"
                     onClick={onButtonClick}
                   >
                     Upload
                   </Button>
                  :null}
               </div>
             </div>
           </AccordionDetails>
          </Accordion> 

        </div>
        <div className="mt-10">
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Save
          </Button>
        </div>
      </div>
     
     
      {open ? (
        <RepairHistoryDialog
          open={open}
          close={() => setOpen(false)}
          save={saveRepairHistory}
        />
      ) : null}

      <Dialog open={viewOpen}>
        <DialogTitle id="alert-dialog-title">{image.name}</DialogTitle>: 
        <DialogContent className="items-center justify-center">
         <div> <img alt="viewFile" src={image.url} /> </div> 
        </DialogContent>
        <DialogActions>
         <Button 
           onClick={() => setViewOpen(false)}
           variant="contained" 
           color="primary"
         >
           CLOSE
         </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdditionalInformation;
