import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  TextField,
} from "@material-ui/core";
import Badge from "@material-ui/core/Badge";
import { withStyles } from "@material-ui/core/styles";
import {
  closeNewDialog,
  closeEditDialog,
  submitReport,
  approveReport,
  revertReport,
  clearStates,
  saveReport,
  downloadDailyReport,
  viewDailyReport,
  sendDailyReport,
  updateReportDate
} from "app/main/projects/store/projectsSlice";
import { selectMainTheme } from "app/store/fuse/settingsSlice";
import Chip from "@material-ui/core/Chip";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Material from "./Material";
import Equipment from "./Equipment";
import Labour from "./Labour";
import Ssalabour from "./Ssalabour";
import Ssaequipment from "./Ssaequipment";
import Hindrance from "./Hindrance";
import SiteVisitors from './SiteVisitors';
import Staff from './Staff';
import Notes from './Notes';
import Consumption from './Consumption';
import Ssaconsumption from './Ssaconsumption';
import WorkProgress from './WorkProgress';
import Attachment from "./Attachment";
import ViewReport from "./ViewReport";
import ViewSSaReport from "./viewSSaReport"
import DateFnsUtils from "@date-io/date-fns";
import moment from "moment/moment";
import { useDispatch, useSelector } from "react-redux";
import { Tab, Tabs } from "@material-ui/core";
import FusePageCarded from "@fuse/core/FusePageCarded";
import IconButton from "@material-ui/core/IconButton";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import CancelIcon from "@material-ui/icons/Cancel";
import Autocomplete from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  header: {
    minHeight: "100px",
    // maxHeight: "80px",
  },
  container: {
    position: "relative",
  },
  input: {
    color: "white",
  },
}));

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: -15,
    top: 13,
  },
}))(Badge);

function ReportDialog(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const mainTheme = useSelector(selectMainTheme);
  const projectDialog = useSelector(({ projects }) => projects.projectDialog);
  const details = useSelector(({ organizations }) => organizations.organization);
  const loading = useSelector(({ projects }) => projects.loading);
  const serverDate = useSelector(
    ({ projects }) => projects.detailReport.createdAt
  );
  const projectId = useSelector(({ projects }) => projects.details._id);
  const userId = useSelector(({ auth }) => auth.user.data.id)
  const detailReport = useSelector(({ projects }) => projects.detailReport);
  const material = useSelector(({ projects }) => projects.material);
  const labour = useSelector(({ projects }) => projects.labour);
  const sitevisitor = useSelector(({ projects }) => projects.sitevisitor);
  const staff = useSelector(({ projects }) => projects.staff);
  const notes = useSelector(({ projects }) => projects.notes);
  const consumption = useSelector(({ projects }) => projects.consumption);
  const workProgress = useSelector(({ projects }) => projects.workProgress);
  const hindrance = useSelector(({ projects }) => projects.hindrance);
  const equipment = useSelector(({ projects }) => projects.equipment);
  const attachment = useSelector(({ projects }) => projects.attachments);
  const [attachmentFiles, setFiles] = useState([]);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [materialCount, setMaterialCount] = useState(material.length);
  const [labourCount, setLabourCount] = useState(labour.length);
  const [hindranceCount, setHindranceCount] = useState(hindrance.length);
  const [sitevisitorCount, setSitevisitorCount] = useState(sitevisitor.length);
  const [staffCount, setStaffCount] = useState(staff.length);
  const [notesCount, setNotesCount] = useState(notes.length);
  const [consumptionCount, setConsumptionCount] = useState(consumption.length);
  const [workProgressCount, setWorkProgressCount] = useState(workProgress.length);
  const [equipmentCount, setEquipmentCount] = useState(equipment.length);
  const [attachmentCount, setAttachmentCount] = useState(attachment.length);
  const [open, setOpen] = useState(false);
  const team = useSelector(({ projects }) => projects.details.team);
  const user = useSelector(({ auth }) => auth.user);
  const [access, setAccess] = useState();
  const [viewOpen, setViewOpen] = useState();
  const [revert, setRevert] = useState(false);
  const [note, setNote] = useState('');
  const [dailyData, setDailyData] = useState([]);
  const [update, setUpdate] = useState(false);
  const projectName = useSelector(({ projects }) => projects.details.title);
  const [approve, setApprove]= useState(false);
  const [emails, setEmails] = React.useState([]);
  const [hide, setHide] = useState(false);

  const setCounter = useCallback((count) => {
    if (count.material) {
      setMaterialCount(count.material);
    }
    if (count.labour) {
      setLabourCount(count.labour);
    }
    if (count.hindrance) {
      setHindranceCount(count.hindrance);
    }
    if (count.equipment) {
      setEquipmentCount(count.equipment);
    }
    if (count.sitevisitor) {
      setSitevisitorCount(count.sitevisitor);
    }
    if (count.staff) {
      setStaffCount(count.staff);
    }
    if (count.attachment) {
      setAttachmentCount(count.attachment);
    }
    if (count.notes) {
      setNotesCount(count.notes);
    }
    if (count.workProgress) {
      setWorkProgressCount(count.workProgress);
    }
    if (count.consumption) {
      setConsumptionCount(count.consumption);
    }
  });
  const setattachments = (attachments) => {
    setFiles([...attachmentFiles, attachments]);
  };


  useEffect(() => {
    team.forEach((t)=>{
      if(t._id === user.data.id && t.role === "CIDCO Official"){
        setHide(true)
      }
   })
  }, [user.data.id, team]) 

  let existingAttachmentsData = [];
  let existingAttachments, orgType = '';
  if(details === undefined || details === null){
    orgType = '';
  }else{
    orgType = details.orgType === undefined || details.orgType === null ? '' : details.orgType
  }
  
  if (detailReport) {
    existingAttachments = JSON.parse(JSON.stringify(detailReport.attachments));
    existingAttachments.forEach((item) => {
      if (item._id) {
        let id = attachment.find((att) => att._id === item._id);
        if (id) {
          existingAttachmentsData.push(item);
        } else {
          item.delete = true;
          existingAttachmentsData.push(item);
        }
      }
    });
  }

  let materialData = [];
  let labourData = [];
  let hindranceData = [];
  let sitevisitorData = [];
  let staffData = [];
  let equipmentData = [];
  let attachmentData = [];
  let notesData = [];
  let consumptionData = [];
  let workProgressData = [];
  let attachmentFilesData = [];
  let today = new Date()
  let DateSelected = moment(selectedDate).format("DD/MM/YYYY");
  let reportDate = moment(selectedDate).add(1, 'day').format("DD/MM/YYYY");
  var currentDate = moment(today).format("DD/MM/YYYY");
 
  useEffect(() => {
    team.map((t)=>{
      if((t._id === user.data.id && (t.role === "owner" || t.role === 'Purchase Officer')) || user.role === 'admin')
      {
        setAccess(true)
      }else if(t._id === user.data.id && t.role !== "owner")
      {
        setAccess(t.tab_access.includes("Approve / Revert Daily Data"));
      }
   })
  }, [access]);

  const handleDateChange = (date) => {
    if(today<date)
    {
      dispatchWarningMessage(dispatch, "Selected Date should not be greater than Today."); 
    }
    setSelectedDate(date);

    if(projectDialog.Dialogtype === 'edit'){
      setUpdate(true)
    }
  };

  const [selectedTab, setSelectedTab] = useState("material");

  const handleTabChange = (event, value) => {
    setSelectedTab(value);
  };

  const handleChange = (prop) => (event) => {
    setNote(event.target.value);
  };

  const initDialog = useCallback(() => {
    /**
     * Dialog type: 'edit'
     */
    if (projectDialog.Dialogtype === "edit" && projectDialog.data) {
      // setForm({ ...projectDialog.data });
      setSelectedDate(serverDate);
      //setDateOpen(false);
    }
  }, [projectDialog.data, projectDialog.Dialogtype, serverDate]);

  useEffect(() => {
    if (projectDialog.props.open) {
      initDialog();
    }
  }, [projectDialog.props.open, initDialog]);


  function closeComposeDialog() {
    projectDialog.Dialogtype === "edit"
      ? dispatch(closeEditDialog())
      : dispatch(closeNewDialog());
    dispatch(clearStates());
    setFiles([]);
    setSelectedDate(new Date());
    setUpdate(false);
  }

  function handleClose(){
    setViewOpen(false)
  }

  function process(date){
    var parts = date.split("/");
    return new Date(parts[2], parts[1] - 1, parts[0]);
  }
  
  function handleSubmit() {
    if(process(DateSelected) <= process(currentDate))
    {
      materialData = JSON.parse(JSON.stringify(material));
      materialData.forEach((item) => {
        if (detailReport.inventory) {
          let id = detailReport.inventory.find(
            (element) => element._id === item._id
          );
          if (!id) {
            delete item._id;
          }
        } else {
          delete item._id;
        }
      });
  
      labourData = JSON.parse(JSON.stringify(labour));
      labourData.forEach((item) => {
        delete item._id;
      });

      hindranceData = JSON.parse(JSON.stringify(hindrance));
      hindranceData.forEach((item) => {
        delete item._id;
      });
  
      equipmentData = JSON.parse(JSON.stringify(equipment));
      equipmentData.forEach((item) => {
        delete item._id;
      });

      sitevisitorData = JSON.parse(JSON.stringify(sitevisitor));
      sitevisitorData.forEach((item) => {
        delete item._id;
      });

      staffData = JSON.parse(JSON.stringify(staff));
      staffData.forEach((item) => {
        delete item._id;
      });

      notesData = JSON.parse(JSON.stringify(notes));
      notesData.forEach((item) => {
        delete item._id;
      });

      consumptionData = JSON.parse(JSON.stringify(consumption));
      consumptionData.forEach((item) => {
        delete item._id;
      });

      workProgressData = JSON.parse(JSON.stringify(workProgress));
      workProgressData.forEach((item) => {
        delete item._id;
      });

      attachmentData = JSON.stringify(existingAttachmentsData);
  
      let bodyFormData = new FormData();
      if (projectDialog.Dialogtype === "edit") {
        bodyFormData.set("_id", projectDialog.data._id);
      }
  
      bodyFormData.set("wing", "");
      bodyFormData.set("building", "");
      bodyFormData.set("floor", "");
      bodyFormData.set("flat", "");
      bodyFormData.set("inventory", JSON.stringify(materialData));
      bodyFormData.set("labour", JSON.stringify(labourData));
      bodyFormData.set("hindrance", JSON.stringify(hindranceData));
      bodyFormData.set("sitevisitor", JSON.stringify(sitevisitorData));
      bodyFormData.set("staff", JSON.stringify(staffData));
      bodyFormData.set("notes", JSON.stringify(notesData));
      bodyFormData.set("consumption", JSON.stringify(consumptionData));
      bodyFormData.set("workProgress", JSON.stringify(workProgressData));
      bodyFormData.set("equipment", JSON.stringify(equipmentData));
      bodyFormData.set("existingAttachments", attachmentData);
      if (attachmentFiles.length) {
        attachmentFiles.forEach((file) => {
          if (attachment.find((item) => item.name === file.name)) {
            bodyFormData.append("attachments", file);
          }
        });
      }
  
      bodyFormData.set("date", reportDate);

      dispatch(saveReport({ projectId, formData: bodyFormData })).then(
        (response) => {
          closeComposeDialog();
        }
      );
    }else{
      dispatchWarningMessage(dispatch, "Selected Date should not be greater than Today.");
    }
  }

  function callRevert()
  {
    if(note === '')
    {
      dispatchWarningMessage(dispatch, "Please write a note."); 
    }else{
      dispatch(revertReport({
        projectId,
        reportId: projectDialog.data._id,
        note
      })).then((response) => {
        setRevert(false);
        closeComposeDialog();
      })
    }
  }

  function updateTransactionDate(){
    let data = {
      updateDate : reportDate,
      currentDate : detailReport.createdAt,
      reportId : projectDialog.data._id
    }

    dispatch(updateReportDate({ projectId, data })).then(
      (response) => {
        closeComposeDialog();
      }
    );
  }

  function sendReport(){
    setApprove(false);
    setEmails([])
    dispatch(
      sendDailyReport({
        projectId,
        projectName,
        date: projectDialog.data.createdAt,
        reportId: projectDialog.data._id,
        userId,
        orgType,
        emails
      })
    ).then((response) => {
      closeComposeDialog()
    })     
  }

  const disableButton = () => {
    return (
      emails.length > 0
    );
  }

  return (
    <>
      <Dialog
        classes={{
          paper: "m-24 flex-auto",
        }}
        {...projectDialog.props}
        fullWidth
        //maxWidth="true"
      >
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <FusePageCarded
          classes={{
            contentWrapper: "p-0",
            // header: classes.header,
          }}
          header={
            <>
              <div className="flex flex-1 items-start justify-between mx-6">
                <div>
                  <ThemeProvider theme={mainTheme}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <DatePicker
                        margin="normal"
                        id="date-picker-dialog"
                        format="dd/MM/yyyy"
                        maxDate={today}
                        value={selectedDate}
                        onChange={handleDateChange}
                        InputProps={{
                          className: classes.input,
                          disableUnderline: true,
                        }}
                      />
                    </MuiPickersUtilsProvider>
                  </ThemeProvider>
                </div>
                <div className="mt-10">
                  <Typography variant="h6">Daily Data</Typography>
                </div>
                {projectDialog.Dialogtype === "edit" ? (
                  <>
                    <div>
                      {projectDialog.data !== null ?
                      (projectDialog.data.status === "New" || projectDialog.data.status === 1 || projectDialog.data.status === 4 || projectDialog.data.status === 'Reverted') && hide === false ? (
                        <Button
                          size="small"
                          className="bg-yellow-400 text-black my-10 mr-10"
                          onClick={() =>
                            dispatch(
                              submitReport({
                                projectId,
                                reportId: projectDialog.data._id,
                              })
                            ).then((response) => {
                              closeComposeDialog();
                            })
                          }
                        >
                          Submit
                        </Button>
                      ) :
                        (projectDialog.data.status === "Submitted" || projectDialog.data.status === 2) && access === true && hide === false ? (
                          <>
                            <Button
                              size="small"
                              className="text-black my-6 mx-4"
                              style={{ backgroundColor: "Red" }}
                               onClick={() =>
                                setRevert(true)
                              }
                            >
                             Revert
                            </Button>
                            <Button
                             size="small"
                             className="text-black my-6 mx-4"
                             style={{ backgroundColor: "	#32CD32" }}
                             onClick={() =>
                               dispatch(approveReport({
                                projectId,
                                reportId: projectDialog.data._id,
                               })).then((response) => {
                                if(orgType !== 'SSA'){
                                  //setApprove(true)
                                  closeComposeDialog()
                                }else{
                                  closeComposeDialog()
                                }
                               })
                              }
                            >
                              Approve
                            </Button>
                          </>
                      ) :
                        projectDialog.data.status === "Approved" || projectDialog.data.status === 3 ? (
                        <Chip
                          className="my-10 mx-10"
                          style={{ backgroundColor: "green" }}
                          label="Approved"
                        />
                      ) : null :null}
                        <Button
                          size="small"
                          className="text-black my-6 mx-4"
                          style={{ backgroundColor: "orange" }}
                          onClick={() =>
                            dispatch(
                              viewDailyReport({
                                projectId,
                                projectName,
                                date: projectDialog.data.createdAt,
                                reportId: projectDialog.data._id,
                                userId
                              })
                            ).then((response) => {
                              //closeComposeDialog();
                              setViewOpen(true);
                              setDailyData(response.payload)
                            })}
                        >
                          View
                        </Button>
                        
                        
                      </div>
                      <IconButton
                          onClick={() => {
                            dispatch(
                              downloadDailyReport({
                                projectId,
                                projectName,
                                date: projectDialog.data.createdAt,
                                reportId: projectDialog.data._id,
                                userId,
                                orgType
                              })
                            );
                          }}
                          color="secondary"
                          size="small"
                          aria-label="download"
                          component="span"
                          className="mt-10"
                        >
                          <CloudDownloadIcon />
                      </IconButton>
                    </>
                  ) : null}
                  <IconButton onClick={() => closeComposeDialog()}>
                    <CancelIcon style={{ color: "red" }} />
                  </IconButton>
                </div>
              </>
            }
          contentToolbar={
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab
                value="material"
                label={
                  <StyledBadge badgeContent={material.length} color="secondary">
                    Material
                  </StyledBadge>
                }
              />
               <Tab
                value="equipment"
                label={
                  <StyledBadge badgeContent={equipment.length} color="secondary">
                    Equipment
                  </StyledBadge>
                }
              />
              <Tab
                value="labour"
                label={
                  <StyledBadge badgeContent={labour.length} color="secondary">
                    Labor
                  </StyledBadge>
                }
              />
              {orgType !== 'SSA' ?
                <Tab
                value="hindrance"
                label={
                  <StyledBadge badgeContent={hindrance.length} color="secondary">
                    Hindrance
                  </StyledBadge>
                }
              />:null}
              {orgType === 'SSA' ?
              <Tab
                value="consumption"
                label={
                  <StyledBadge
                    badgeContent={consumption.length}
                    color="secondary"
                  >
                    Concrete
                  </StyledBadge>
                }
              />
              :null}
              {orgType !== 'SSA' ?
              <Tab
                value="sitevisitor"
                label={
                  <StyledBadge badgeContent={sitevisitor.length} color="secondary">
                    Site Visitors
                  </StyledBadge>
                }
              />
              :null}
              {orgType !== 'SSA' ?
              <Tab
                value="staff"
                label={
                 <StyledBadge badgeContent={staff.length} color="secondary">
                    Staff
                 </StyledBadge>
                }
              />
              :null}
              {orgType !== 'SSA' ?
              <Tab
                value="attachment"
                label={
                  <StyledBadge
                    badgeContent={attachment.length}
                    color="secondary"
                  >
                    Attachments
                  </StyledBadge>
                }
              />
              :null}
              
              
              {orgType === 'SSA' ?
              <Tab
                value="notes"
                label={
                  <StyledBadge
                    badgeContent={notes.length}
                    color="secondary"
                  >
                    Work Progress
                  </StyledBadge>
                }
              />:
              <Tab
                value="notes"
                label={
                  <StyledBadge
                    badgeContent={notes.length}
                    color="secondary"
                  >
                    Notes
                  </StyledBadge>
                }
              />}
              {orgType !== 'SSA' ?
              <Tab
                value="workProgress"
                label={
                  <StyledBadge
                    badgeContent={workProgress.length}
                    color="secondary"
                  >
                    Work Activity
                  </StyledBadge>
                }
              />
              :null}
            </Tabs>
          }
          content={
            <React.Fragment>
              <div>
                {selectedTab === "material" && (
                  <Material date={reportDate} data={projectDialog} onClose={closeComposeDialog} onCountChange={setCounter} />
                )}
                {selectedTab === "equipment" && orgType !== 'SSA' && (
                  <Equipment date={reportDate} data={projectDialog} onClose={closeComposeDialog} onCountChange={setCounter} />
                )}
                {selectedTab === "equipment" && orgType === 'SSA' && (
                  <Ssaequipment date={reportDate} data={projectDialog} onClose={closeComposeDialog} onCountChange={setCounter} />
                )}
                {selectedTab === "labour" && orgType !== 'SSA' && (
                  <Labour date={reportDate} data={projectDialog} onClose={closeComposeDialog} onCountChange={setCounter} />
                )}
                {selectedTab === "labour" && orgType === 'SSA' && (
                  <Ssalabour date={reportDate} data={projectDialog} onClose={closeComposeDialog} onCountChange={setCounter} />
                )}
                {selectedTab === "hindrance" && (
                  <Hindrance date={reportDate} data={projectDialog} onClose={closeComposeDialog} onCountChange={setCounter} />
                )}
                 {selectedTab === "sitevisitor" && (
                  <SiteVisitors date={reportDate} data={projectDialog} onClose={closeComposeDialog} onCountChange={setCounter} />
                )}
                {selectedTab === "staff" && (
                  <Staff date={reportDate} data={projectDialog} onClose={closeComposeDialog} onCountChange={setCounter} />
                )}  
                {selectedTab === "attachment" && (
                  <Attachment date={reportDate} data={projectDialog} onClose={closeComposeDialog}
                    onCountChange={setCounter}
                    onSelectFiles={setattachments}
                  />
                )}
                {selectedTab === "notes" && (
                  <Notes date={reportDate} data={projectDialog} onClose={closeComposeDialog} onCountChange={setCounter} />
                )}
                 {selectedTab === "consumption" && orgType === 'SSA' && (
                  <Ssaconsumption date={reportDate} data={projectDialog} onClose={closeComposeDialog} onCountChange={setCounter} />
                )}
                {selectedTab === "workProgress" && (
                  <WorkProgress date={reportDate} data={projectDialog} onClose={closeComposeDialog} onCountChange={setCounter} />
                )}
              </div>

              {update === true ?
                <Button
                 className="justify-between pl-16 m-16"
                 variant="contained"
                 color="primary"
                 onClick={()=> updateTransactionDate()}
                 type="submit"
                >
                 Update
                </Button>
              :null}

                {/* <Button
                 className="justify-between pl-16 m-16"
                 variant="contained"
                 color="primary"
                 onClick={handleSubmit}
                 type="submit"
                >
                 Save
                </Button> */}
              
              {(selectedTab === "labour" || selectedTab === "equipment") && orgType === 'SSA' ? 
                null
              :
              <Button
                className="justify-between pl-16 m-16"
                variant="contained"
                color="primary" 
                type="submit"
                onClick={() => {
                  closeComposeDialog();
                }}
              >
                Close
              </Button>
            }
            </React.Fragment>
          }
          innerScroll
        />
      </Dialog>
      {open ? (
        <Dialog open={open}>
          <DialogTitle>Close Daily Data</DialogTitle>
          <DialogContent>
            Are you sure want to close dialog ?
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                closeComposeDialog();
                setOpen(false);
              }}
            >
              Yes
            </Button>
            <Button variant="contained" onClick={() => setOpen(false)}>
              No
            </Button>
          </DialogActions>
        </Dialog>
      ) : null}

      {revert ? (
         <Dialog open={revert}>
         <DialogTitle>Revert Daily Data</DialogTitle>
         <DialogContent>
             <TextField
             className="mt-8"
             variant="outlined"
             id="note"
             label="Note"
             rows="4"
             multiline
             value={note}
             onChange={handleChange("note")}
             InputLabelProps={{
               shrink: true,
             }}
           />
         </DialogContent>
         <DialogActions>
           <Button
             variant="contained"
             color="primary"
             onClick={() => {callRevert()
               setRevert(false)}
             }
           >
             Ok
           </Button>
           <Button variant="contained"
             onClick={() =>
                setRevert(false)
             }
            >
             Cancel
           </Button>
         </DialogActions>
         </Dialog>         
      ) : null}

        {/* for approval */}
      {approve? (
        <Dialog open={approve}>
          <DialogTitle>Send Daily Data Report</DialogTitle>
          <DialogContent>
            <Autocomplete
              multiple
              id="tags-filled"
              options={team.map((option) => option.email)}
              defaultValue={[]}
              freeSolo
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                ))
              }
              onChange={(event, newValue) => {
                setEmails(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Emails"
                  placeholder="Emails"
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              disabled={!disableButton()}
              onClick={() => {
                sendReport()   
              }}
            >
              Send
            </Button>
            <Button variant="contained"
              onClick={() =>{
                setApprove(false);
                closeComposeDialog();
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>         
      ) : null}

      {viewOpen ?
       (orgType === 'SSA' ?
          <ViewSSaReport open={viewOpen} data={dailyData} close={handleClose} />
        :
        <ViewReport open={viewOpen} data={dailyData} from="dialog" close={handleClose} /> 
          
       ) 
      :null}

    </>
  );
}

export default React.memo(ReportDialog);
