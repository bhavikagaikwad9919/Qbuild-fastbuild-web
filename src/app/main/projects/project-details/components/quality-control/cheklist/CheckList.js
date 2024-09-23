import React, { useState, useEffect  } from "react";
import Link from "@material-ui/core/Link";
import { makeStyles, withStyles, } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Fab from "@material-ui/core/Fab";
import clsx from "clsx";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import FuseAnimate from "@fuse/core/FuseAnimate";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import FuseAnimateGroup from "@fuse/core/FuseAnimateGroup";
import Icon from "@material-ui/core/Icon";
import Paper from "@material-ui/core/Paper";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import {
  addChecklist,
  deleteChecklists,
  routes,
  openNewDialog,
  closeNewDialog,
  downloadChecklist,
  viewChecklist,
  detailChecklist,
} from "app/main/projects/store/projectsSlice";
import { useDispatch, useSelector } from "react-redux";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import ChecklistItem from "./CheckListItem";
import ReactTable from "react-table-6";
import Checkbox from "@material-ui/core/Checkbox";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import IconButton from "@material-ui/core/IconButton";
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    //maxWidth: 360,
    maxHeight: "68vh",
    position: "relative",
    overflow: "auto",
    backgroundColor: theme.palette.background.paper,
  },
  root1: {
    display: "flex-container",
    maxHeight: "68vh",
    backgroundColor: theme.palette.background.paper,
    overflow: "auto",
  },
  deleteButton: {
    position: "fixed",
    right: 100,
    bottom: 5,
    zIndex: 99,
  },
  delete: {
    color: "red",
  },
  listItem: {
    borderBottom: "1px solid #ccc",
    paddingTop: "0px",
    paddingBottom: "0px",
  },
  listItemIcon: {
    minWidth: "30px",
  },
  addButton: {
    position: "fixed",
    right: 40,
    bottom: 5,
    zIndex: 99,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

let initialValues = {
  templateId: "",
  title: "",
  description: "",
};


const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const CheckList = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const loading = useSelector(({ projects }) => projects.loading);
  const projectId = useSelector(({ projects }) => projects.details._id);
  const checklist = useSelector(({ projects }) => projects.checklist.checklistArray);
  const templates = useSelector(({ projects }) => projects.template.templateArray);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [values, setValues] = useState(initialValues);
  const [show, setShow] = useState(false)
  const projectDialog = useSelector(({ projects }) => projects.projectDialog);
  const [newTemplates, setNewTemplates] = useState([]);
  const projectName = useSelector(({ projects }) => projects.details.title);
  const [details, setDetails] = useState('');
  const [check, setCheck] = useState([]);
  const [viewOpen, setViewOpen] = useState(false);

  useEffect(() => {
    if (templates) {
      let newTemplate = [];
      templates.forEach((temp) => {
        if(temp.templateType !== 'Monitoring')
        {
            newTemplate.push(temp)
        }
      });
      setNewTemplates(newTemplate);
    }
  }, [templates]);

  const disableButton = () => {
    return (
      values.templateId.length > 0 &&
      values.title.length > 0
    );
  };

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleChangeId = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((_id) => _id !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSubmit = () => {
    dispatch(addChecklist({ projectId, values })).then((response) => {
      closeComposeDialog();
      setValues(initialValues);
    });
  };

  const handleIdChange = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((_id) => _id !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    } 
  };

  const selectAllIds = () => {
    if (selectedIds.length === checklist.length) {
      setSelectedIds([]);
    } else {
      let ids = [];
      checklist.forEach((item) => {
        ids.push(item._id);
      });
      setSelectedIds(ids);
    }
  };

  function closeComposeDialog() {
     dispatch(closeNewDialog());
     setValues(initialValues);
  }

  function callChecklist(data){
    dispatch(
      detailChecklist({ projectId, checklistId: data._id })
    ).then((response) => {
      setShow(true);
      setDetails(data);
    });
  }

  function filterCaseInsensitive(filter, row) {
    const id = filter.pivotId || filter.id;
    return (
      row[id] !== undefined ?
        String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase())
      :
        false
    );
  }

  const viewList = (details) =>{
    let checklistId = details._id;
    dispatch(viewChecklist({ projectId,  checklistId })).then((response) => {
       setCheck(response.payload);
       setViewOpen(true);
    });
  }

  return (
    <>
      {!checklist.length ? (
        <div className="flex flex-1 w-full h-full">
          <Paper className="w-full rounded-8 shadow-1">
          {props.features !== "off" ? (
            <>
            <div className="flex items-center justify-between px-16">
              <div className="flex justify-Start mt-12 mb-12 mr-10">
                <Typography className="font-bold" color="primary" >
                  Checklists
                </Typography>
              </div>
              <div className="flex justify-end mt-12 mr-24 mb-12">
                <Typography className="font-bold cursor-pointer mr-10 mt-6" color="secondary" onClick={() => dispatch(routes("Templates"))}>
                  Go To Templates
                </Typography>
                <Button color="primary" onClick={() => dispatch(openNewDialog())} variant="contained" className="mb-8" style={{padding:'3px 16px'}} nowrap="true">Create Checklist</Button> 
              </div>
            </div>
            </>  
          ):null}
            <Typography style={{ textAlign: "center" }}>
              There are no Checklists
            </Typography>
          </Paper>
        </div>
      ) : (
        <div className={clsx(classes.root1)}>

          {props.features !== "off" ? (
            <div className="flex items-center justify-between px-16">
              <div className="flex justify-Start mt-12 mb-12 mr-10">
                <Typography className="font-bold" color="primary" >
                  Checklists
                </Typography>
              </div>
              <div className="flex justify-end mt-12 mr-24 mb-12">
                <Typography className="font-bold cursor-pointer mr-10 mt-6" color="secondary" onClick={() => dispatch(routes("Templates"))}>
                  Go To Templates
                </Typography>
                <Button color="primary" onClick={() => dispatch(openNewDialog())} variant="contained" className="mb-8" style={{padding:'3px 16px'}} nowrap="true">Create Checklist</Button> 
              </div>
            </div>
           ):null}
          {/* <Backdrop className={classes.backdrop} open={loading}>
            <CircularProgress color="inherit" />
          </Backdrop>
          <List className="p-0">
            <FuseAnimateGroup
              enter={{
                animation: "transition.slideUpBigIn",
              }}
              leave={{
                animation: "transition.slideUpBigOut",
              }}
            >
              {props.features !== "off" ? (
              checklist.map((todo) => (
                <ChecklistItem
                  todo={todo}
                  key={todo._id}
                  onIdSelect={handleIdChange}
                  ids={selectedIds}
                />
              ))):
              checklist.map((todo) => (
                <ChecklistItem
                  todo={todo}
                  key={todo._id}
                  onIdSelect={handleIdChange}
                  ids={selectedIds}
                  features="off"
                />
              ))}
            </FuseAnimateGroup>
          </List> */}
          <Backdrop className={classes.backdrop} open={loading}>
            <CircularProgress color="inherit" />
          </Backdrop>
          <FuseAnimate animation="transition.slideUpIn" delay={100}>
           <ReactTable
             className={classes.root}
             getTrProps={(state, rowInfo, column) => {
               return {
                 className: "items-center justify-center",
               };
              }}
              data={checklist}
              filterable
              defaultFilterMethod={(filter, row) => filterCaseInsensitive(filter, row) }
              columns={[
              {
               Header: () => (
               <Checkbox
                 onClick={(event) => {
                   event.stopPropagation();
                   selectAllIds();
                 }}
                 checked={
                    selectedIds.length === Object.keys(checklist).length &&
                    selectedIds.length > 0
                 }
                />
               ),
               accessor: "",
               Cell: (row) => {
                 return (
                   <Checkbox
                     onClick={(event) => {
                       event.stopPropagation();
                       handleChangeId(row.value._id);
                     }}
                     checked={selectedIds.includes(row.value._id)}
                   />
                  );
               },
                className: "justify-center",
                sortable: false,
                filterable: false,
                width: 55,
              },
              {
                Header: "Name",
                accessor: "title",
                style: { 'white-space': 'unset' },
                Cell: ({ row }) => (
                <a
                  className="cursor-pointer"
                  onClick={() => { callChecklist(row._original)}}
                >
                 {row._original.title}
                </a>
                ),
                Filter: ({ filter, onChange }) => {
                  return (
                    <div style={{ position: "relative" }}>
                      <input
                        onChange={(event) => onChange(event.target.value)}
                        value={filter ? filter.value : ""}
                        style={{
                          width: "100%",
                          backgroundColor: "#DCDCDC",
                          color: "#222222",
                        }}
                      />
                      <Icon
                        style={{
                          position: "absolute",
                          right: "10px",
                          lineHeight: "30px",
                        }}
                      >
                        search
                      </Icon>
                    </div>
                  );
                },
                className: "font-bold",
              },
              {
                Header: "Template Name", 
                accessor: "templateName",
                style: { 'white-space': 'unset' },
                Filter: ({ filter, onChange }) => {
                  return (
                    <div style={{ position: "relative" }}>
                      <input
                        onChange={(event) => onChange(event.target.value)}
                        value={filter ? filter.value : ""}
                        style={{
                          width: "100%",
                          backgroundColor: "#DCDCDC",
                          color: "#222222",
                        }}
                      />
                      <Icon
                        style={{
                          position: "absolute",
                          right: "10px",
                          lineHeight: "30px",
                        }}
                      >
                        search
                      </Icon>
                    </div>
                  );
                },
              },
              {
                Header: "Created Date",
                style: { 'white-space': 'unset' },
                accessor: "createdDate",
                className: "justify-center",
                Filter: ({ filter, onChange }) => {
                  return (
                    <div style={{ position: "relative" }}>
                      <input
                        onChange={(event) => onChange(event.target.value)}
                        value={filter ? filter.value : ""}
                        style={{
                          width: "100%",
                          backgroundColor: "#DCDCDC",
                          color: "#222222",
                        }}
                      />
                      <Icon
                        style={{
                          position: "absolute",
                          right: "10px",
                          lineHeight: "30px",
                        }}
                      >
                        search
                      </Icon>
                    </div>
                  );
                },
              },
              {
                Header: 'Download / View',
                style: { 'white-space': 'unset' },
                id:'download',
                accessor: "download",
                Cell: ({ row }) => (
                  <>
                    <a
                      className="cursor-pointer"
                      onClick={() => {
                        dispatch(
                          downloadChecklist({
                            projectId,
                            projectName,
                            checklistId: row._original._id,
                            checklistTitle: row._original.title,
                          })).then((response) => {
                          }
                        )
                      }}
                    >
                      Download
                    </a>
                    <span> / </span>
                    <a
                      className="cursor-pointer"
                      onClick={ () => {
                        viewList(row._original)
                     }}
                    >
                      View
                    </a>
                  </>
                ),
                Filter: ({ filter, onChange }) => {
                  return (
                    <div style={{ position: "relative" }}>
                      <input
                        onChange={(event) => onChange(event.target.value)}
                        value={filter ? filter.value : ""}
                        style={{
                          width: "100%",
                          backgroundColor: "#DCDCDC",
                          color: "#222222",
                        }}
                      />
                      <Icon
                        style={{
                          position: "absolute",
                          right: "10px",
                          lineHeight: "30px",
                        }}
                      >
                        search
                      </Icon>
                    </div>
                  );
                },
                className: 'font-bold',
              }
              ]}
              defaultPageSize={5}
              noDataText="No Checklist found"
            />
          </FuseAnimate>
        </div>
      )}
      {selectedIds.length && props.features !== "off" ? (
        <FuseAnimate animation="transition.expandIn" delay={300}>
          <Fab
            color="primary"
            aria-label="delete"
            className={classes.deleteButton}
            onClick={() => setDeleteOpen(true)}
          >
            <Icon className={classes.delete}>delete</Icon>
          </Fab>
        </FuseAnimate>
      ) : null}

     {props.features !== "off" ? (
      <FuseAnimate animation="transition.expandIn" delay={300}>
        <Fab
          color="primary"
          aria-label="add"
          className={classes.addButton}
          onClick={() =>
             dispatch(openNewDialog())
             //setAddOpen(true)
            }
        >
          <Icon>add</Icon>
        </Fab>
      </FuseAnimate>
     ):null}
   {props.features !== "off" ? (
      <>
       <Dialog open={projectDialog.props.open} {...projectDialog.props} fullWidth maxWidth="sm">
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <FuseAnimateGroup
          enter={{
            animation: "transition.slideUpBigIn",
          }}
          leave={{
            animation: "transition.slideUpBigOut",
          }}
        >
          <DialogTitle id="checklist-dialog-title">
            Create Checklist
          </DialogTitle>
          <DialogContent>
            <div className="flex flex-1 flex-col w-full gap-10">
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">
                  Select Template
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={values.templateId}
                  onChange={handleChange("templateId")}
                  name="templateId"
                  label="Template"
                >
                  {newTemplates.map((temp) => (
                    <MenuItem key={temp._id} value={temp._id}>
                      {temp.title}
                    </MenuItem>
                  ))}
                  <Link
                    className="ml-12 cursor-pointer"
                    onClick={() => dispatch(routes("Templates"))}
                  >
                    Click here to add Templates
                  </Link>
                </Select>
              </FormControl>
              <TextField
                value={values.title}
                onChange={handleChange("title")}
                id="outlined-basic"
                label="Title"
                variant="outlined"
              />
              <TextField
                value={values.description}
                onChange={handleChange("description")}
                id="outlined-multiline-static"
                label="Description"
                multiline
                rows={3}
                variant="outlined"
              />
              <div className="flex flex-1 flex-row gap-10 my-12">
                <Button
                  disabled={!disableButton()}
                  onClick={handleSubmit}
                  variant="contained"
                  color="primary"
                >
                  Save
                </Button>
                <Button onClick={() => closeComposeDialog()} variant="contained">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </FuseAnimateGroup>
      </Dialog>
      <Dialog open={deleteOpen}>
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <DialogTitle id="alert-dialog-slide-title">
          Delete Selected Checklists ?
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={() => {
              setDeleteOpen(false);
            }}
            color="primary"
          >
            No
          </Button>
          <Button
            onClick={() => {
              dispatch(
                deleteChecklists({ projectId, values: selectedIds })
              ).then((response) => {
                setSelectedIds([]);
                setDeleteOpen(false);
              });
            }}
            color="primary"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      </>
   ):null}

   {show ?
      <ChecklistItem 
        todo={details}
        key={details._id}
        onIdSelect={handleIdChange}
        ids={selectedIds}
        open={true} 
      /> 
    :null}

    <Dialog
    fullWidth maxWidth="md"
    open = {viewOpen}
  >
    <DialogTitle id="alert-dialog-title">{check.title}<br></br>
      Checklist No./{check.projectName}/{check.index}
    </DialogTitle>
    <DialogContent className="items-center justify-center">
      {check.type === 'Normal'?
      <div class="grid grid-cols-2 divide-x divide-gray-400">
        <TableContainer component={Paper}>
         <Table  aria-label="simple table">
           <TableBody>
             <>
                <TableRow key={1}>
                 <TableCell component="th" className="font-bold" style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
                   PROJECT - {check.projectName !== undefined && check.projectName !== null  ? check.projectName : null}
                 </TableCell>
                </TableRow>
                <TableRow key={2}>
                  <TableCell component="th" className="font-bold" style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
                    DRAWING NO - {check.drawingNo !== undefined && check.drawingNo !== null ? check.drawingNo : null}
                  </TableCell>
                </TableRow>
                <TableRow key={3}>
                  <TableCell component="th" className="font-bold" style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
                    ACTIVITY - {check.activity !== undefined && check.activity !== null  ? check.activity : null}
                  </TableCell>
                </TableRow>
                <TableRow key={4}>
                  <TableCell component="th" className="font-bold" style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
                   START TIME - {check.startTime !== undefined && check.startTime !== null  ? check.startTime : null}
                  </TableCell>
                </TableRow>
              </> 
            </TableBody>
          </Table>
        </TableContainer>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
           <TableBody>
             <>
               <TableRow key={1}>
                 <TableCell component="th" className="font-bold" style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
                   DATE - {check.checkedDate !== undefined ? check.checkedDate : null}
                 </TableCell>
               </TableRow>
               <TableRow key={2}>
                 <TableCell component="th" className="font-bold" style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
                   LOCATION - {check.location !== undefined ? check.location : null}
                 </TableCell>
               </TableRow>
               <TableRow key={3}>
                <TableCell component="th" className="font-bold" style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
                  CONCRETE GRADE - {check.concrete_grade !== undefined ? check.concrete_grade : null}
                </TableCell>
               </TableRow>
               <TableRow key={4}>
               <TableCell component="th" className="font-bold" style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
                  FINISH TIME - {check.finishTime !== undefined ? check.finishTime : null}
               </TableCell>
               </TableRow>
             </> 
           </TableBody>
          </Table>
        </TableContainer>
      </div>
      :null}

      {check.checklist !== undefined ?
        check.checklist.map((ch) => (
          <TableContainer component={Paper}>
            {check.type === 'Normal'?
            <div className="flex w-full items-center justify-between mt-16">
              <Typography  className={clsx(classes.heading, "font-bold ml-10")}>
                {ch.category}
              </Typography>
            </div>
            :null}
          
            <List className="p-0 w-full">
             {ch.items.map((element) => (
                <>
                  <ListItem>
                    <ListItemText primary={element.title} />
                    <ListItemIcon>
                      {element.status === 3 ?
                        <IconButton
                          edge="end"
                          size="large"
                        >
                          <CheckCircleOutlineIcon />
                        </IconButton>
                      : <IconButton
                          edge="end"
                          size="large"
                        >
                          <RadioButtonUncheckedIcon />
                        </IconButton>
                      }
                    </ListItemIcon>
                    
                  </ListItem>
                  {element.comments.map((com) => (
                    <ListItem key={com._id} button >
                      <ListItemText className="font-bold" primary={com.comment} />
                    </ListItem>
                  ))}
                </>
              ))}
            </List>    
          </TableContainer>
        ))
      :null}

      {check.type === 'Normal'?
      <TableContainer style={{ marginTop: "20px" }} component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableBody>
            <TableRow key={1}>
             <TableCell component="th" className="font-bold" style={{  fontSize: "100%" }}  variant="h6" scope="row" width="100%">
               Remarks - {check.remarks}
             </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      :null}

      {check.markedUser !== undefined && check.type === 'Normal' ? 
        <div class="grid grid-cols-2 divide-x divide-gray-400">
          <TableContainer component={Paper}>
            <Table  aria-label="simple table">
              <TableBody>
               {check.markedUser.map((mark)=>(
                <TableRow key={1}>
                  <TableCell component="th"className="font-bold" style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
                    Inspected By - {mark}
                  </TableCell>
                </TableRow>
               ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
             <TableBody>
                <>
                 <TableRow key={1}>
                   <TableCell component="th" className="font-bold" style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
                     Approved By - {check.approvedBy}
                   </TableCell>
                 </TableRow>
                </> 
             </TableBody>
            </Table>
          </TableContainer>
        </div>
      :null}

      {check.type === 'Normal' ?
      <TableContainer style={{ marginTop: "20px" }} component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableBody>
           <>
             <StyledTableRow key={1}>
                <StyledTableCell style={{ textAlign: "center", fontSize: "100%" }} className="font-bold" width="20%" align="left"> {check.contractor_name}</StyledTableCell>
                <StyledTableCell style={{ textAlign: "center", fontSize: "100%" }} className="font-bold" width="15%" align="left">{check.pmc_name}</StyledTableCell>
                <StyledTableCell style={{ textAlign: "center", fontSize: "100%" }} className="font-bold"width="15%" align="left"> {check.client_name} </StyledTableCell>
             </StyledTableRow>
             <StyledTableRow key={1}>
                <StyledTableCell style={{ textAlign: "center", fontSize: "100%" }} className="font-bold" width="20%" align="left"> Contractor Name</StyledTableCell>
                <StyledTableCell style={{ textAlign: "center", fontSize: "100%" }} className="font-bold" width="15%" align="left"> PMC Name</StyledTableCell>
                <StyledTableCell style={{ textAlign: "center", fontSize: "100%" }} className="font-bold"width="15%" align="left"> Client Name </StyledTableCell>
             </StyledTableRow>
           </> 
          </TableBody>
        </Table>
      </TableContainer>  
      :null}  
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setViewOpen(false)} variant="contained" color="primary">
        CLOSE
      </Button>
    </DialogActions>
    </Dialog>
  </>
  );
};

export default React.memo(CheckList);
