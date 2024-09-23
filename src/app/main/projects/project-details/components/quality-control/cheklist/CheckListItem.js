import AppBar from "@material-ui/core/AppBar";
import FuseUtils from "@fuse/utils";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import clsx from "clsx";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import React, { useState,useRef, useEffect } from "react";
import CancelIcon from "@material-ui/icons/Cancel";
import _ from "@lodash";
import { withStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import {
Dialog,
 DialogContent,
 DialogTitle,
} from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChatBubbleIcon from "@material-ui/icons/ChatBubble";
import IconButton from "@material-ui/core/IconButton";
import moment from "moment";
import Badge from "@material-ui/core/Badge";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { red, grey, blue } from "@material-ui/core/colors";
import {
  detailsChecklist,
  detailItem,
  addComment,
  markCheclistItem,
  deleteChecklists,
  deleteComment,
  detailChecklist,
  downloadChecklist,
  updateChecklistDetails,
  loadingFalse,
  loadingTrue,
  exportItemDocument,
  routes,
} from "app/main/projects/store/projectsSlice";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Checkbox from "@material-ui/core/Checkbox";
import { Chip } from "@material-ui/core";
import Geocode from "react-geocode";
import constants from "app/main/config/constants";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import DialogActions from "@material-ui/core/DialogActions";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import FuseLoading from "@fuse/core/FuseLoading";
import axios from "axios";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { showMessage } from "app/store/fuse/messageSlice";
import Icon from "@material-ui/core/Icon";
import { Link } from "react-router-dom";
import history from "@history";
import DeleteIcon from "@material-ui/icons/Delete";
import { getOrganization, listMember  } from "app/main/organization/store/organizationSlice";
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  dialogPaper: {
    minHeight: "80vh",
    maxHeight: "80vh",
  },
  list: {
    width: "100%",
    position: "relative",
    overflow: "auto",
    maxHeight: "200px",
    marginTop: "32px",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  productListImageDelete: {
    color: grey[400],
    "&:hover": {
      color: red[400],
    },
    // color: red[400],
  },
}));

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
    backgroundColor: "#A9A9A9",
    color: "black",
  },
}))(Badge);

const ITEM_HEIGHT = 48;

let initialState = {
  Date: new Date(),
  drawingNo: "",
  location: "",
  activity:"",
  concrete_grade:"",
  startTime:"",
  finishTime: "",
  remarks: "",
  approvedBy:"",
  contractor_name:"",
  pmc_name:"",
  client_name:""
};

function CheckListItem(props) {
  const dispatch = useDispatch();
  const classes = useStyles(props);
  const projectId = useSelector(({ projects }) => projects.details._id);
  const loading = useSelector(({ projects }) => projects.loading);
  const checklistDetails = useSelector(
    ({ projects }) => projects.checklist.detailChecklist
  );
  const vendors = useSelector(({ projects }) => projects.vendors);
  const auth = useSelector(({ auth }) => auth.user.data);
  const [open, setOpen] = useState(props.open);
  const [detailDialog, setDetailDialog] = useState(false);
  const [checklist, setChecklist] = useState("");
  const [detailChecklistItem, setDetailChecklistItem] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const projectName = useSelector(({ projects }) => projects.details.title);
  const projectDetails = useSelector(({ projects }) => projects.details);
  const [details, setDetails] = useState(initialState);
  const [date, setDate] = React.useState(new Date());
  const [itemOpen, setItemOpen] = useState(false);
  const inputFile = useRef(null);
  const [checklistId, setChecklistId] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemId, setItemId] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [commentId, setCommentId] = useState("");
  const team = useSelector(({ projects }) => projects.details.team);
  const modules = useSelector(({ projects }) => projects.details.module);
  const user = useSelector(({ auth }) => auth.user);
  const [access, setAccess] = useState();

  useEffect(() => {
    team.forEach((t)=>{
      if((t._id === user.data.id && t.role === "owner") || user.role === 'admin')
      {
        setAccess(true)
      }else if(t._id === user.data.id && t.role !== "owner")
      {
        const member = t.tab_access.filter((i)=> i === "Agency" || i === 'Sub-Contractors');
        console.log(member)
        if(member[0] === "Agency" || member[0] === "Sub-Contractors")
        {
          setAccess(true)
        }
      }
    })
  }, [access, user.data.id, user.role, team]);

  let newMarked = [], members = [];

  team.forEach((tm)=>{
    members.push(tm.name);
  })

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

    const dialogClose = () => {
      dispatch(
        detailChecklist({ projectId, checklistId: props.todo._id })
      ).then((response) => {
      
      });
      setDetailDialog(false)
    }

    useEffect(() => {
      if (checklistDetails) {
       let data={};
       data.title = checklistDetails.details.title;
       data.Date= checklistDetails.details.checkedDate;
       data.drawingNo= checklistDetails.details.drawingNo;
       data.location= checklistDetails.details.location;
       data.activity= checklistDetails.details.activity;
       data.concrete_grade= checklistDetails.details.concrete_grade;
       data.startTime= checklistDetails.details.startTime;
       data.finishTime= checklistDetails.details.finishTime;
       data.remarks= checklistDetails.details.remarks;
       data.approvedBy= checklistDetails.details.approvedBy;
       data.contractor_name= checklistDetails.details.contractor_name;
       data.pmc_name= checklistDetails.details.pmc_name;
       data.client_name= checklistDetails.details.client_name;
       setDetails(data);
      }
      setOpen(props.open);
      setChecklist(props.todo);
    }, [checklistDetails]);

    let vendorsName = [];
    if (!vendors) {
      return <FuseLoading />;
    }
  
    vendors.vendorsList.forEach((item) => {
      if(item.agencyType === 'Sub-Contractor' || item.agencyType === 'Contractor'){
        vendorsName.push({
          id: item._id,
          name: item.name,
        });
      }
    });

  const handleChange = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((_id) => _id !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

    const handleSubmit = async () => {
     let values = {
      itemId: detailChecklistItem._id,
      commentTime: new Date(),
      comment: newComment,
     };

     Geocode.setApiKey(constants.MAP_KEY);
     Geocode.setLanguage("en");
     let address = "";
     await navigator.geolocation.getCurrentPosition(
      (position) => {
        Geocode.fromLatLng(
          position.coords.latitude,
          position.coords.longitude
        ).then(
          (response) => {
            values.address = response.results[0].formatted_address;
            dispatch(
              addComment({
                projectId,
                checklistId: checklist._id,
                values,
                // itemId: detailChecklistItem._id,
              })
            ).then((response) => {
              setNewComment("");
            });
          },
          (error) => {
            values.address = "error";
            dispatch(
              addComment({
                projectId,
                checklistId: checklist._id,
                values,
                // itemId: detailChecklistItem._id,
              })
            ).then((response) => {
              setNewComment("");
            });
          }
        );
      },
      (error) => {
        values.address = "denied";
        dispatch(
          addComment({
            projectId,
            checklistId: checklist._id,
            values,
            // itemId: detailChecklistItem._id,
          })
        ).then((response) => {
          setNewComment("");
        });
       
      },
      {
        timeout: 1000,
        maximumAge: 10000,
        enableHighAccuracy: true,
      }
     );
    };

    const handleDetailsChange = (prop) => (event) => {
      setDetails({ ...details, [prop]: event.target.value });
    };

    
    const changeRoleOptionBaseOnValue = (value) => {
      setDetails({ ...details, 'approvedBy': value });
    }

    const handleDateChange = (date) => {
      setDate(date);
      setDetails({ ...details, Date: date });
    };

    const updateDetails = () =>{
      dispatch(
        updateChecklistDetails({
          projectId,
          checklistId: props.todo._id,
          details,
        })).then((response)=>{
           //setDetails(initialState);
           //setOpen(false);
        })
    }

    const itemDetail = (element, ev) =>{
      if(ev.target.checked === true){
       changeStatus('check',element)
      }else if(ev.target.checked === false){
        changeStatus('uncheck',element)
      }
    }

    const changeStatus = async (value, element) =>{
      let values = {
        markedTime: new Date(),
       };
  
       Geocode.setApiKey(constants.MAP_KEY);
       Geocode.setLanguage("en");

       await navigator.geolocation.getCurrentPosition(
        (position) => {
          Geocode.fromLatLng(
            position.coords.latitude,
            position.coords.longitude
          ).then(
            (response) => {
              values.address = response.results[0].formatted_address;
              ItemStatus(value,values, element);
            },
            (error) => {
              values.address = "error";
              ItemStatus(value,values, element)
            }
          );
        },
        (error) => {
          values.address = "denied";
          ItemStatus(value,values, element)
        },
        {
          timeout: 1000,
          maximumAge: 10000,
          enableHighAccuracy: true,
        }
       );

     
    }

    function ItemStatus(value,values,element)
    {
      updateDetails();
      let filterUser = element.markedBy.filter((el)=>el.name === auth.displayName);

      if(filterUser.length > 0){
        element.markedBy.forEach((el)=>{
          if(el.name === filterUser[0].name)
          {
            newMarked.push({
              "name" : el.name,
              "status" : value === 'check' ? 'Complete' : 'InComplete',
              "markedTime":values.markedTime,
              "location":values.address
            })
          }else{
            newMarked.push({
              "name" : el.name,
              "status" : el.status
            })
          } 
       })
      }else{
        newMarked.push({
          "name" : auth.displayName,
          "status" : value === 'check' ? 'Complete' : 'InComplete',
          "markedTime":values.markedTime,
          "location":values.address
        })
        element.markedBy.forEach((el)=>{
            newMarked.push({
              "name" : el.name,
              "status" : el.status
            })
        })
      }

      dispatch(
        markCheclistItem({
          projectId,
          checklistId: checklistDetails.details._id,
          itemId: element._id,
          value: value,
          markedBy: newMarked,
        })
      ).then((response) => {
          setItemOpen(false)
          newMarked=[];
          if(detailDialog === false){
            dispatch(
              detailChecklist({
                projectId,
                checklistId: props.todo._id,
              })
            );
          } 
        }
      )   
    }

    function markItem(element)
    {
      newMarked.push({
        "name" : auth.displayName,
        "status" : 'Complete',
        "markedTime" : new Date(),
      })

      dispatch(
        markCheclistItem({
          projectId,
          checklistId: checklistDetails.details._id,
          itemId: element._id,
          value: 'check',
          markedBy: newMarked,
        })).then((response) => {
            newMarked=[];
            if(detailDialog === false){
              dispatch(
                detailChecklist({
                  projectId,
                  checklistId: props.todo._id,
                }));
            } 
            // history.push({
            //   pathname: "/dashboard",
            // });  
        })
    }

    function handleUploadChange(e) {
          const choosedFile = Array.from(e.target.files);
          dispatch(loadingTrue());
          const payload = new FormData();
          payload.set("checklistId",checklistId)
          payload.set("itemName",itemName)
          payload.set("itemId",itemId)
          choosedFile.forEach((file) => {
            payload.append("file", file);
          });
         
          const options = {
            headers: { "Content-Type": "multipart/form-data" },
          };
          axios
            .post(
              `${constants.BASE_URL}/projects/${projectId}/checklist/files/upload`,
              payload,
              options
            )
            .then((response) => {
              if (response.data.code === 200) {
                dispatch(
                  detailChecklist({
                    projectId,
                    checklistId: props.todo._id,
                  }));
                dispatch(loadingFalse());
                dispatch(
                  showMessage({
                    message: "Document Added Successfully",
                    variant: "success",
                  })
                ); 
                // history.push({
                //   pathname: "/dashboard",
                // });
              } else {
                dispatch(loadingFalse());
                dispatch(
                  showMessage({
                    message: response.data.message,
                    variant: "error",
                  })
                );
              }
            });
    }

   function downloadDocument(documents,itemId,itemName) {
    let checklistTitle = props.todo.title;
    dispatch(
      exportItemDocument({
        projectId,
        itemId,
        itemName,
        documents,
        projectName,
        checklistTitle
      })) 
    }

    function redirectToAgency(){
      if(modules.length === 0 || modules.includes("Agency")){
        if(access === true){
          dialogClose();
          sessionStorage.setItem("link", 'link');
          dispatch(routes("Vendors"));
        }else{
          dispatchWarningMessage(dispatch, "You don't have access to add aa Supplier from Agency.")
        }
      }else{
        dispatchWarningMessage(dispatch, "Please include Agency module from Settings to Add Suppliers.")
      }
    }

   return (
    <>
      {/* <ListItem
        id={FuseUtils.generateGUID()}
        className={clsx("border-solid border-b-1 py-16 px-0 sm:px-8")}
        onClick={(ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          setChecklist(props.todo);
          dispatch(
            detailChecklist({ projectId, checklistId: props.todo._id })
          ).then((response) => {
            setOpen(true);
          });
          // dispatch(detailsChecklist(props.todo));

          // dispatch(openEditDialog(props.todo));
        }}
        dense
        button
      >
        {props.features !== "off" ? (
        <Checkbox
          tabIndex={-1}
          disableRipple
          checked={props.ids.includes(props.todo._id)}
          onClick={(ev) => {
            ev.stopPropagation();
            props.onIdSelect(props.todo._id);
          }}
        />):null}
        <div className="flex flex-1 flex-col relative overflow-hidden px-8">
          <Typography
            variant="subtitle1"
            className="todo-title truncate"
            // onClick={() => setChecklist(props.todo)}
          >
            {props.todo.title}
          </Typography>

          <Typography color="textSecondary" className="todo-notes truncate">
            {props.todo.description === undefined
              ? null
              : _.truncate(
                  props.todo.description.replace(/<(?:.|\n)*?>/gm, ""),
                  {
                    length: 180,
                  }
                )}
          </Typography>
        </div>
        <ListItemSecondaryAction>
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="long-menu"
            anchorEl={anchorEl}
            keepMounted
            open={openMenu}
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: ITEM_HEIGHT * 4.5,
                width: "20ch",
              },
            }}
          >
            <MenuItem
              key="download"
              onClick={() =>
                dispatch(
                  downloadChecklist({
                    projectId,
                    projectName,
                    checklistId: props.todo._id,
                    checklistTitle: props.todo.title,
                  })
                )
              }
            >
              Download Report
            </MenuItem>
          </Menu>
        </ListItemSecondaryAction>
      </ListItem> */}

      {/* {open ? ( */}
        <>
          <Dialog
            open={open}
            fullWidth
            maxWidth="sm"
            onClose={() => setOpen(false)}
          >
            <Backdrop className={classes.backdrop} open={loading}>
              <CircularProgress color="inherit" />
            </Backdrop>
            <AppBar position="static">
              <DialogTitle id="alert-dialog-title" className="p-4 ml-8">
                <div className="flex flex-row items-center justify-between">
                  {'Checklist'}
                  <div>
                  <IconButton
                    color="secondary"
                    size="medium"
                    aria-label="download"
                    component="span"
                    onClick={() =>
                      dispatch(
                        downloadChecklist({
                          projectId,
                          projectName,
                          checklistId: props.todo._id,
                          checklistTitle: props.todo.title,
                        })
                      )
                    }
                  >
                    <CloudDownloadIcon />
                  </IconButton>
                  <IconButton 
                   color="secondary"
                   aria-label="close"
                   component="span"
                   size="small"
                   style={{paddingLeft:"25px" }}
                   onClick={() => setOpen(false)}
                  >
                    <CancelIcon style={{ color: "red"}}/>
                  </IconButton>
                  </div>
                </div>
              </DialogTitle>
            </AppBar>
            <DialogContent className="p-0">
            {checklistDetails.details.templateType === 'Normal'?
            <>
              <div className='flex flex-1 flex-col gap-12 w-auto mt-16 ml-10 mr-10 mb-16'>
                <TextField 
                  type="text" 
                  name="name" 
                  variant='outlined'
                  value={details.title}
                  label="Title"
                  onChange={handleDetailsChange('title')}
                />
              </div>
              
              <div class="grid grid-cols-2 divide-x divide-gray-400">
                <TextField
                  variant="outlined"
                  className="w-1 mr-10 ml-10 my-16"
                  label="Project"
                  defaultValue={projectName}
                  InputProps={{readOnly:true}}
                />
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DatePicker
                    label="Date"
                    className="w-1 ml-10 mr-10 my-16"
                    format="dd/MM/yyyy"
                    value={details.Date}
                    onChange={handleDateChange}
                    inputVariant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </MuiPickersUtilsProvider>  
              </div>

              <div class="grid grid-cols-2 divide-x divide-gray-400">
                <TextField
                  className="w-1 mr-10 ml-10 my-10"
                  label='Drawing No.'
                  variant='outlined'
                  value={details.drawingNo}
                  onChange={handleDetailsChange('drawingNo')}
                />
                <TextField
                  className="w-1 ml-10 my-10 mr-10"
                  label='Location'
                  variant='outlined'
                    value={details.location}
                    onChange={handleDetailsChange('location')}
                />
              </div>

              <div class="grid grid-cols-2 divide-x divide-gray-400">
                <TextField
                  className="w-1 mr-10 ml-10 my-10 "
                  label='Activity'
                  variant='outlined'
                  value={details.activity}
                  onChange={handleDetailsChange('activity')}
                />
                <TextField
                  className="w-1 ml-10 my-10 mr-10"
                  label='Concrete Grade'
                  variant='outlined'
                    value={details.concrete_grade}
                    onChange={handleDetailsChange('concrete_grade')}
                />
              </div>

              <div class="grid grid-cols-2 divide-x divide-gray-400">
               <TextField  
                 className="w-1 mr-10 ml-10 my-10"
                 label='Start Time'
                 variant='outlined'
                 value={details.startTime}
                 onChange={handleDetailsChange('startTime')}
               />
               <TextField               
                className="w-1 ml-10 my-10 mr-10"
                label='Finish Time'
                variant='outlined'
                value={details.finishTime}
                onChange={handleDetailsChange('finishTime')}
               />
             </div>
            

              {/* {checklistDetails.details.groupData[0].map((item) => ( */}
              {checklistDetails.checklistGroup.map((item) => (
                <Accordion>
                  <AccordionSummary
                   // expandIcon={<ExpandMoreIcon />}
                  //  aria-controls="panel1a-content"
                  //  id="panel1a-header"
                  >
                    <div className="flex w-full items-center justify-between mt-16">
                      <Typography className={classes.heading}>
                        {item.category}
                      </Typography>
                      {/* <Chip
                        label={item.details.length}
                        color="secondary"
                        size="small"
                      /> */}
                      <List className="p-0 w-full">
                      {item.details.map((element) => (
                        <>
                        <ListItem
                          key={element._id}
                          button
                          onClick={() => {
                            setDetailDialog(true);
                            setDetailChecklistItem(element);
                            dispatch(
                              detailItem({
                                projectId,
                                checklistId: checklistDetails.details._id,
                                itemId: element._id,
                              })
                            );
                          }}
                        >
                          <Checkbox
                            edge="start"
                            checked={element.status === 3}
                            tabIndex={-1}
                            disableRipple
                            onClick={(ev) => {
                              ev.stopPropagation();
                              itemDetail(element, ev)
                            }}
                          />
                          <ListItemText primary={element.title} />

                          <ListItemIcon>
                            <IconButton
                              edge="end"
                              disabled={true}
                              // className='mx-18'
                            >
                              <StyledBadge
                                badgeContent={element.comments.length}
                                showZero
                              >
                                <ChatBubbleIcon />
                              </StyledBadge>
                            </IconButton>
                          </ListItemIcon>
                        </ListItem>
                        
                        {element.comments.map((com) => (
                         <ListItem key={com._id} button >
                           <ListItemText primary={com.comment} />
                         </ListItem>
                        ))}
                        </>
                      ))}
                      </List>     
                    </div>  
                  </AccordionSummary>
                </Accordion>
              ))}

             <div className='flex flex-1 flex-col gap-12 w-auto mt-16 ml-10 mr-10 mb-16'>
              <TextField
               label='Remark'
               multiline
               rows={4}
               variant='outlined'
               value={details.remarks}
               onChange={handleDetailsChange('remarks')}
              />
             </div>

              <div class="grid grid-cols-2 divide-x divide-gray-400">
                {/* <TextField
                  className="w-1 ml-10 my-10 mr-10"
                  label='Approved By'
                  variant='outlined'
                  value={details.approvedBy}
                  onChange={handleDetailsChange('approvedBy')}
                /> */}

                <Autocomplete
                  id="approvedBy"
                  freeSolo
                  className="w-1 ml-10 my-10 mr-10"
                  options={members}
                  value={details.approvedBy}
                  onInputChange={(event, value) => {
                   changeRoleOptionBaseOnValue(value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Approved By"
                      onChange={handleDetailsChange('approvedBy')}
                      variant="outlined"
                    />
                  )}
                />
       
                <FormControl  className="w-1 ml-10 my-10 mr-10" variant="outlined">
                  <InputLabel id="demo-simple-select-outlined-label">
                   Contractor Name
                  </InputLabel>
                  <Select
                    fullWidth
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={details.contractor_name}
                    label="Contractor's Name"
                    onChange={handleDetailsChange('contractor_name')}
                  >
                   {vendorsName.map((vname) => (
                    <MenuItem
                      key={vname.id}
                      value={vname.name}
                    >
                      <Typography>{vname.name}</Typography>
                    </MenuItem>
                   ))}
                    <Link
                      className="cursor-pointer ml-10 mt-10"
                      onClick={() => { 
                        redirectToAgency();
                      }}
                    >
                     Click here to Add New Contractor
                    </Link>
                  </Select>
                </FormControl>
              </div>

              <div class="grid grid-cols-2 divide-x divide-gray-400">
               <TextField
                 className="w-1 ml-10 my-10 mr-10"
                 label='PMC Name'
                 variant='outlined'
                   value={details.pmc_name}
                   onChange={handleDetailsChange('pmc_name')}
               />
               <TextField
                 className="w-1 ml-10 my-10 mr-10"
                 label='Client Name'
                 variant='outlined'
                 value={details.client_name}
                 onChange={handleDetailsChange('client_name')}
               />
              </div>
             
              <div className="pl-8 pb-8">
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  updateDetails()
                }}
              >
                Update
              </Button>
              </div>
            </>
           :
           checklistDetails.checklistGroup.map((item) => (
                <Accordion>
                  <AccordionSummary
                   // expandIcon={<ExpandMoreIcon />}
                  //  aria-controls="panel1a-content"
                  //  id="panel1a-header"
                  >
                    <div className="flex w-full items-center justify-between mt-16">
                      <Typography className={classes.heading}>
                        {item.category}
                      </Typography>
                      {/* <Chip
                        label={item.details.length}
                        color="secondary"
                        size="small"
                      /> */}
                       <List className="p-0">
                      {item.details.map((element) => (
                        <ListItem
                          key={element._id}  
                        >
                          {element.categoryFormat === 'Document' ?
                             element.document.length === 0 ?
                              <>
                               <Checkbox
                                 edge="start"
                                 checked={element.status === 3}
                                 tabIndex={-1}
                                 disableRipple
                                />
                                <Button
                                 variant="contained"
                                 color="primary"
                                 onClick={() => {
                                  inputFile.current.click()
                                  setChecklistId(checklistDetails.details._id)
                                  setItemName(element.title)
                                  setItemId(element._id)
                                 }}
                                >
                                <input
                                  multiple
                                  ref={inputFile}
                                  className="hidden"
                                  id="button-file"
                                  type="file"
                                  onChange={(event) => {
                                    handleUploadChange(event);
                                  }}
                                />  
                                 Upload Document
                                </Button>
                              </>
                            :
                              <>
                                <Checkbox
                                 edge="start"
                                 checked={element.status === 3}
                                 tabIndex={-1}
                                 disableRipple
                                />
                                {element.status === 3 ?
                                  <ListItemText primary={"Completed"} /> 
                                 :
                                  <>
                                    <ListItemText primary={"Document Uploaded"} /> 
                                    <IconButton
                                     color="primary"
                                     size="large"
                                     aria-label="download"
                                     component="span"
                                     className="mb-7"
                                     onClick={() => {
                                       inputFile.current.click()
                                       setChecklistId(checklistDetails.details._id)
                                       setItemName(element.title)
                                       setItemId(element._id)
                                     }}
                                    >
                                      <AddCircleRoundedIcon/>
                                      <input
                                        multiple
                                        ref={inputFile}
                                        className="hidden"
                                        id="button-file"
                                        type="file"
                                        onChange={(event) => {
                                          handleUploadChange(event);
                                        }}
                                       />
                                    </IconButton>
                                  </>
                                }   
                              </> 
                            : <Checkbox
                               edge="start"
                               checked={element.status === 3}
                               tabIndex={-1}
                               disableRipple
                               onClick={(ev) => {
                                ev.stopPropagation();
                                markItem(element)
                               }}
                              />}
                          <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() => {
                            setDetailDialog(true);
                            setDetailChecklistItem(element);
                            dispatch(
                              detailItem({
                                projectId,
                                checklistId: checklistDetails.details._id,
                                itemId: element._id,
                              }));
                            }}
                              // className='mx-18'
                            >
                              <StyledBadge
                                badgeContent={element.comments.length}
                                showZero
                              >
                                <ChatBubbleIcon />
                              </StyledBadge>
                            </IconButton>
                          </ListItemSecondaryAction>

                          {/* <ListItemIcon>
                            <IconButton
                              edge="end"
                              disabled={true}
                              // className='mx-18'
                            >
                              <StyledBadge
                                badgeContent={element.comments.length}
                                showZero
                              >
                                <ChatBubbleIcon />
                              </StyledBadge>
                            </IconButton>
                          </ListItemIcon> */}
                        </ListItem>
                      ))}
                      
                    {item.details.map((element) =>  (
                     element.comments.map((com) => (
                      <ListItem
                        key={com._id}
                        button
                      >
                        <ListItemText
                          primary={com.comment}
                          // secondary={element.description}
                        />
                      </ListItem>
                      ))
                     ))}                    
                    </List>     
                    </div>  
                  </AccordionSummary>
                  {/* <AccordionDetails className="p-0">
                   
                  </AccordionDetails> */}
                </Accordion>
              ))
           }


            </DialogContent>
          </Dialog>
          <Dialog
            open={deleteOpen}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Delete Comment"}</DialogTitle>
            <DialogActions>
              <Button
                onClick={() => setDeleteOpen(false)}
                color="primary"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setDeleteOpen(false);
                  dispatch(deleteComment({ projectId, checklistId:checklist._id,itemId:detailChecklistItem._id,commentId })).then(
                    (response) => {
                    });
                }}
                color="primary"
                autoFocus
              >
                Ok
              </Button>
            </DialogActions>
          </Dialog>
          {detailDialog && checklistDetails.details.templateType === 'Normal' ? (
            <Dialog
              className={clsx({ paper: classes.dialogPaper }, "py-0")}
              fullWidth
              maxWidth="md"
              open={detailDialog}
              scroll="body"
            >
              <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="inherit" />
              </Backdrop>
              <AppBar position="static" color="primary">
                <div className="flex items-center justify-between">
                  <DialogTitle>Checklist Item</DialogTitle>
                  <IconButton onClick={() => dialogClose()}>
                    <CancelIcon style={{ color: "red" }} />
                  </IconButton>
                </div>
              </AppBar>
              <DialogContent dividers={"body"}>
                <div className="flex items-center justify-between">
                  <Typography variant="h6">
                    {checklistDetails.detailItem.title}
                  </Typography>
                  <Button
                      onClick={() => setItemOpen(true)}
                      variant="outlined"
                      size="small"
                      style={{ color: "green" }}
                      startIcon={<DoneIcon />}
                  >
                    Mark
                  </Button>
                  {/* {checklistDetails.detailItem.status === 3 ? (
                    <Button
                      onClick={() =>
                        dispatch(
                          markCheclistItem({
                            projectId,
                            checklistId: checklist._id,
                            itemId: detailChecklistItem._id,
                            value: "uncheck",
                            markedBy: auth.displayName,
                          })
                        )
                      }
                      variant="outlined"
                      size="small"
                      style={{ backgroundColor: "green" }}
                      startIcon={<DoneIcon />}
                    >
                      Mark as InComplete
                    </Button>
                  ) : (
                    <Button
                      onClick={() =>
                        dispatch(
                          markCheclistItem({
                            projectId,
                            checklistId: checklist._id,
                            itemId: detailChecklistItem._id,
                            value: "check",
                            markedBy: auth.displayName,
                          })
                        )
                      }
                      variant="outlined"
                      size="small"
                      style={{ color: "green" }}
                      startIcon={<DoneIcon />}
                    >
                      Mark as Complete
                    </Button>
                  )} */}
                </div>
                <div className="flex flex-row items-center gap-8">
                  <Typography>Category:</Typography>
                  <Typography variant="subtitle1">
                    {checklistDetails.detailItem.category}
                  </Typography>
                </div>
                <div className="box-border mt-8 h-200 w-full border-gray-400 bg-gray-200 overflow-auto">
                  {checklistDetails.detailItem.comments.length ? (
                    <List className="mt-8 h-160 w-full">
                      {checklistDetails.detailItem.comments.map((comment) => (
                        <>
                          <ListItem key={comment._id} className="pt-0 w-full">
                            <ListItemAvatar>
                              <Avatar
                                alt={comment.commentBy.name}
                                src={comment.commentBy.profilePicture}
                              />
                            </ListItemAvatar>
                            <ListItemText
                              primary={comment.comment}
                              secondary={
                                <div className="flex flex-row gap-12">
                                  <div>{comment.commentBy.name}</div>
                                  <div>{moment(comment.commentDate).format("DD/MM/YYYY hh:mm A")}</div>
                                  <div>{comment.location === undefined || comment.location === "denied" || comment.location === "error" ? "" : comment.location}</div>
                                </div>
                              }
                            />
                            <ListItemIcon className="mr-10">
                             <IconButton
                               onClick={() => {
                                setDeleteOpen(true);
                                setCommentId(comment._id)
                               }}
                               className={classes.productListImageDelete}
                             >
                               <DeleteIcon />
                             </IconButton>
                            </ListItemIcon>
                          </ListItem>
                          <Divider variant="inset" component="li" />
                        </>
                      ))}
                    </List>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Typography variant="h6">No Comments</Typography>
                    </div>
                  )}
                </div>

                <div className="flex flex-row w-full mt-10 gap-12">
                  <Avatar alt={auth.displayName} src={auth.photoURL}></Avatar>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={newComment}
                    onChange={(event) => setNewComment(event.target.value)}
                  />
                </div>
                <div className="flex flex-row justify-end gap-12 mt-12">
                  <Button
                    disabled={!newComment.length > 0}
                    onClick={handleSubmit}
                    color="primary"
                  >
                    add comment
                  </Button>
                  <Button
                    onClick={() => {
                      setNewComment("");
                    }}
                    color="default"
                  >
                    clear
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ) : detailDialog && checklistDetails.details.templateType !== 'Normal' ?
          (
            <Dialog
              className={clsx({ paper: classes.dialogPaper }, "py-0")}
              fullWidth
              maxWidth="md"
              open={detailDialog}
              scroll="body"
            >
              <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="inherit" />
              </Backdrop>
              <AppBar position="static" color="primary">
                <div className="flex items-center justify-between">
                  <DialogTitle>Checklist Item</DialogTitle>
                  <IconButton onClick={() => dialogClose()}>
                    <CancelIcon style={{ color: "red" }} />
                  </IconButton>
                </div>
              </AppBar>
              <DialogContent dividers={"body"}>
                <div className="flex items-center justify-between">
                  <Typography variant="h6">
                    {checklistDetails.detailItem.title}
                  </Typography>
                  {checklistDetails.detailItem.document !== undefined ? 
                   checklistDetails.detailItem.document.length === 0 ?
                    checklistDetails.detailItem.categoryFormat === 'Document' ?
                    <Button
                    variant="outlined"
                    size="small"
                    style={{ color: "green" }}
                    onClick={() => {
                      inputFile.current.click()
                      setChecklistId(checklistDetails.details._id)
                      setItemName(checklistDetails.detailItem.title)
                      setItemId(checklistDetails.detailItem._id)
                     }}
                   >
                    <input
                      multiple
                      ref={inputFile}
                      className="hidden"
                      id="button-file"
                      type="file"
                      onChange={(event) => {
                        handleUploadChange(event);
                      }}
                    />
                    Upload Document
                    </Button>
                    :checklistDetails.detailItem.status !== 3 ?
                    <Button
                     onClick={() => markItem(checklistDetails.detailItem)}
                     variant="outlined"
                     size="small"
                     style={{ color: "green" }}
                     startIcon={<DoneIcon />}
                    >
                      Mark As Complete
                    </Button>:null
                  :checklistDetails.detailItem.status !== 3 ?
                   <Button
                    variant="outlined"
                    size="small"
                    style={{ color: "green" }}   
                    onClick={() => markItem(checklistDetails.detailItem)} 
                   >
                     Mark As Complete
                   </Button> :null
                   :
                   null}
                
                  {/* {checklistDetails.detailItem.status === 3 ? (
                    <Button
                      onClick={() =>
                        dispatch(
                          markCheclistItem({
                            projectId,
                            checklistId: checklist._id,
                            itemId: detailChecklistItem._id,
                            value: "uncheck",
                            markedBy: auth.displayName,
                          })
                        )
                      }
                      variant="outlined"
                      size="small"
                      style={{ backgroundColor: "green" }}
                      startIcon={<DoneIcon />}
                    >
                      Mark as InComplete
                    </Button>
                  ) : (
                    <Button
                      onClick={() =>
                        dispatch(
                          markCheclistItem({
                            projectId,
                            checklistId: checklist._id,
                            itemId: detailChecklistItem._id,
                            value: "check",
                            markedBy: auth.displayName,
                          })
                        )
                      }
                      variant="outlined"
                      size="small"
                      style={{ color: "green" }}
                      startIcon={<DoneIcon />}
                    >
                      Mark as Complete
                    </Button>
                  )} */}
                </div>
                {/* <div className="flex flex-row items-center gap-8">
                  <Typography>Category:</Typography>
                  <Typography variant="subtitle1">
                    {checklistDetails.detailItem.category}
                  </Typography>
                </div> */}
                <div className="box-border mt-8 h-200 w-full border-gray-400 bg-gray-200 overflow-auto">
                  {checklistDetails.detailItem.comments.length ? (
                    <List className="mt-8 h-160 w-full">
                      {checklistDetails.detailItem.comments.map((comment) => (
                        <>
                          <ListItem key={comment._id} className="pt-0 w-full">
                            <ListItemAvatar>
                              <Avatar
                                alt={comment.commentBy.name}
                                src={comment.commentBy.profilePicture}
                              />
                            </ListItemAvatar>
                            <ListItemText
                              primary={comment.comment}
                              secondary={
                                <div className="flex flex-row gap-12">
                                  <div>{comment.commentBy.name}</div>
                                  <div>{moment(comment.commentDate).format("DD/MM/YYYY hh:mm A")}</div>
                                  <div>{comment.location === undefined || comment.location === "denied" || comment.location === "error" ? "" : comment.location}</div>
                                </div>
                              }
                            />
                            <ListItemIcon className="mr-10">
                             <IconButton
                                onClick={() => {
                                  setDeleteOpen(true);
                                  setCommentId(comment._id)
                                 }}
                               className={classes.productListImageDelete}
                             >
                               <DeleteIcon />
                             </IconButton>
                            </ListItemIcon>
                          </ListItem>
                          <Divider variant="inset" component="li" />
                        </>
                      ))}
                    </List>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Typography variant="h6">No Comments</Typography>
                    </div>
                  )}
                </div>

                <div className="flex flex-row w-full mt-10 gap-12">
                  <Avatar alt={auth.displayName} src={auth.photoURL}></Avatar>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={newComment}
                    onChange={(event) => setNewComment(event.target.value)}
                  />
                </div>
                <div className="flex flex-row justify-end gap-12 mt-12">
                  <Button
                    disabled={!newComment.length > 0}
                    onClick={handleSubmit}
                    color="primary"
                  >
                    add comment
                  </Button>
                  <Button
                    onClick={() => {
                      setNewComment("");
                    }}
                    color="default"
                  >
                    clear
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ):
          null}

   <Dialog
     className={clsx({ paper: classes.dialogPaper }, "py-0")}
     open={itemOpen}>
      <Backdrop className={classes.backdrop} open={loading}>
           <CircularProgress color="inherit" />
       </Backdrop>
     <AppBar position="static" color="primary">
       <div className="flex items-center justify-between">
          <DialogTitle>Select Status of Item </DialogTitle>
          <IconButton onClick={() =>setItemOpen(false)}>
            <CancelIcon style={{ color: "red" }} />
          </IconButton>
        </div>
      </AppBar>
      <DialogActions>
        <Button
             onClick={() => {
               changeStatus('check');
            }}
         color="primary"
        >
          complete
        </Button>
        <Button
             onClick={() => {
              changeStatus('uncheck');
             }}
         color="primary"
        >
          InComplete
        </Button>
      </DialogActions>
    </Dialog>
        </>
      {/* ) : null} */}
    </>
  );
}

export default CheckListItem;
