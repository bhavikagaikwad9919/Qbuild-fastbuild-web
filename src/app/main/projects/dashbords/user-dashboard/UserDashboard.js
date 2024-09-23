import FusePageSimple from "@fuse/core/FusePageSimple";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Divider, Grid } from '@material-ui/core';
import Paper from "@material-ui/core/Paper";
import {
  getProject,
  routes,
  getDashboardAsPerProject
} from "../../store/projectsSlice";
import moment from "moment";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import clsx from "clsx";
import _ from "@lodash";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Chip from "@material-ui/core/Chip";
import { Tooltip, Card } from "@material-ui/core";
import history from "@history";
import ReactTable from "react-table-6";
import FuseAnimate from "@fuse/core/FuseAnimate";
import withFixedColumns from "react-table-hoc-fixed-columns";
import "react-table-hoc-fixed-columns/lib/styles.css";
import { getOrganization } from "app/main/organization/store/organizationSlice";
import LaborGraph from './widgets/LaborGraph';
import InventoryGraph from './widgets/InventoryGraph';
const ReactTableFixedColumns = withFixedColumns(ReactTable);

const useStyles = makeStyles((theme) => ({
  content: {
    "& canvas": {
      maxHeight: "100%",
    },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  centerText: {
    textAlign: "center",
  },
  centerText1: {
    textAlign: "center",
    width: 'auto',
    whiteSpace: 'pre-wrap',
    cursor: 'pointer'
  },
  selectedProject: {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderRadius: "8px 0 0 0",
  },
  projectMenuButton: {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderRadius: "0 8px 0 0",
    marginLeft: 1,
  },
  div: {
    height: "150px",
  },
}));

function UserDashboard(props) {
  const dispatch = useDispatch();
  const inventory = useSelector(({ projects }) => projects.inventories);
  const entities = useSelector(({ projects }) => projects.entities);
  const loading = useSelector(({ projects }) => projects.loading);
  const projectDetails = useSelector(({ projects }) => projects.details);
  const classes = useStyles(props);
  const pageLayout = useRef(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState({
    _id: null,
    menuEl: null,
  });
  const [projects, setProjects] = useState([]);
  const [type, setType] = useState("");
  const [show, setShow] = useState(false);
  const [barData, setBarData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [iframeUrl, setIframeUrl] = useState('');
  const [inv, setInv] = useState('');
  const [inventoryList, setInventoryList] = useState([]);
  const [laborData, setLaborData] = useState([]);
  const [monthlyLabor, setMonthlyLabor] = useState(0);
  const [totalLabor, setTotalLabor] = useState(0);
  const [invData, setInvData] = useState([]);
  const [monthlyInvCount, setMonthlyInvCount] = useState(0);
  const [totalInvCount, setTotalInvCount] = useState(0);
  const [isInventoryView, setIsInventoryView] = useState(true);
  const [showInventoryGraph, setShowInventoryGraph] = useState(true);





  useEffect(() => {
    setPageLoading(true);
    if (inventory.length > 0) {
      let tempInv = [];
      inventory.forEach((invn) => {
        if (String(invn.type.toLowerCase()).startsWith('rmc')) {
          tempInv.push(invn);
        } else if (String(invn.type.toLowerCase()).startsWith('cement')) {
          tempInv.push(invn);
        } else if (String(invn.type.toLowerCase()).includes('steel') || String(invn.type.toLowerCase()).startsWith('steel')) {
          tempInv.push(invn);
        }
      })

      if (tempInv.length > 0) {
        dispatch(getDashboardAsPerProject({ projectId: projectDetails._id, invId: tempInv[0]._id })).then((response) => {
          let data = response.payload.labourData;
          console.log(response.payload)
          setLaborData(data);
          setTotalLabor(response.payload.totalCount)
          setMonthlyLabor(response.payload.monthlyLaborCount)
          setInvData(response.payload.inventoryData);
          setTotalInvCount(response.payload.totalInvCount)
          setMonthlyInvCount(response.payload.monthlyInventoryCount)
          setPageLoading(false);
          setInv(tempInv[0].type)
        })
      } else {
        dispatch(getDashboardAsPerProject({ projectId: projectDetails._id, invId: '' })).then((response) => {
          let data = response.payload.labourData;
          setLaborData(data);
          setTotalLabor(response.payload.totalCount)
          setMonthlyLabor(response.payload.monthlyLaborCount)
          setInvData(response.payload.inventoryData);
          setTotalInvCount(response.payload.totalInvCount)
          setMonthlyInvCount(response.payload.monthlyInventoryCount)
          setPageLoading(false);
        })
      }

      setInventoryList(tempInv);

    } else {
      dispatch(getDashboardAsPerProject({ projectId: projectDetails._id, invId: '' })).then((response) => {
        let data = response.payload.labourData;
        setLaborData(data);
        setTotalLabor(response.payload.totalCount)
        setMonthlyLabor(response.payload.monthlyLaborCount)
        setInvData(response.payload.inventoryData);
        setTotalInvCount(response.payload.totalInvCount)
        setMonthlyInvCount(response.payload.monthlyInventoryCount)
        setPageLoading(false);
      })
    }

  }, [dispatch, inventory]);

  useEffect(() => {
    if (!_.isEmpty(projectDetails)) {
      setSelectedProject({ _id: projectDetails._id, menuEl: null });
    }
  }, []);

  useEffect(() => {
    let i = 0;
    invData.forEach((inv) => {
      if (inv.value > 0) {
        i++;
      }
    })

    if (i > 0) {
      setShowInventoryGraph(true)
    } else {
      setShowInventoryGraph(false)
    }
  }, [invData]);

  useEffect(() => {
    let newProjects = [], tableData = [], tdata = [], tempKey = [],
      tempColumns = [{
        fixed: "left",
        Header: "Project Name",
        accessor: "name",
        className: "font-bold",
        width: 150,
        style:
        {
          borderWidth: 0.5,
          borderStyle: 'solid',
          height: '34px',
        },
        Cell: ({ row }) => (
          <a
            className="cursor-pointer"
            onClick={() => gotoProject(row._original)}
          >
            {row._original.name}
          </a>
        ),
      }];

    if (entities.ownedProjects) {
      entities.ownedProjects.data.forEach((pro) => {
        if (pro.projectType === 'residential' || pro.projectType === 'commercial' || pro.projectType === 'RES-COMM') {
          pro.checklist.forEach((ch) => {
            if (ch.title === 'Master' && ch.templateType === 'Monitoring') {
              ch.items.forEach((item, id) => {
                tempKey.push(item.title)
                tdata.push({ 'item': item.title, 'id': id })
              })
            }
          })
        }
      });
    }
    if (entities.associatedProjects) {
      entities.associatedProjects.data.forEach((pro) => {
        if (pro.projectType === 'residential' || pro.projectType === 'commercial' || pro.projectType === 'RES-COMM') {
          pro.checklist.forEach((ch) => {
            if (ch.title === 'Master' && ch.templateType === 'Monitoring') {
              ch.items.forEach((item) => {
                tempKey.push(item.title)
              })
            }
          })
        }
      });
    }

    const uniqueItem = tempKey.filter(unique)

    if (uniqueItem.length > 0) {
      if (entities.ownedProjects) {
        entities.ownedProjects.data.forEach((pro) => {
          if (pro.projectType === 'residential' || pro.projectType === 'commercial' || pro.projectType === 'RES-COMM') {
            pro.checklist.forEach((ch) => {
              if (ch.title === 'Master' && ch.templateType === 'Monitoring') {
                setShow(true);
                setType("All");
                let temp2 = { "id": pro._id, "name": pro.title };
                for (var i = 0; i < uniqueItem.length; i++) {
                  let x = 0;
                  for (var j = 0; j < ch.items.length; j++) {
                    if (uniqueItem[i] === ch.items[j].title) {
                      temp2 = {
                        ...temp2,
                        [uniqueItem[i].toLowerCase().replace(/\s+/g, '')]:
                        {
                          updatedDate: ch.items[j].updatedDate,
                          status: ch.items[j].status,
                          comments: ch.items[j].comments,
                          "id": pro._id
                        }
                      }
                      x = 1;
                    } else if (j === ch.items.length - 1 && x === 0) {
                      temp2 = {
                        ...temp2, [uniqueItem[i].toLowerCase().replace(/\s+/g, '')]:
                        {
                          updatedDate: '',
                          status: '',
                          comments: [],
                          "id": pro._id
                        }
                      }
                    }
                  }
                }
                tableData.push(temp2)
              }
            })
          }
          newProjects.push(pro);
        });
        setBarData(tableData);
        setProjects(newProjects);
      }

      if (entities.associatedProjects) {
        entities.associatedProjects.data.forEach((pro) => {
          if (pro.projectType === 'residential' || pro.projectType === 'commercial' || pro.projectType === 'RES-COMM') {
            pro.checklist.forEach((ch) => {
              if (ch.title === 'Master' && ch.templateType === 'Monitoring') {
                setShow(true);
                setType("All");
                let temp2 = { "id": pro._id, "name": pro.title };
                for (var i = 0; i < uniqueItem.length; i++) {
                  let x = 0;
                  for (var j = 0; j < ch.items.length; j++) {
                    if (uniqueItem[i] === ch.items[j].title) {
                      temp2 = {
                        ...temp2,
                        [uniqueItem[i].toLowerCase().replace(/\s+/g, '')]:
                        {
                          updatedDate: ch.items[j].updatedDate,
                          status: ch.items[j].status,
                          comments: ch.items[j].comments
                        }
                      }
                      x = 1;
                    } else if (j === ch.items.length - 1 && x === 0) {
                      temp2 = {
                        ...temp2, [uniqueItem[i].toLowerCase().replace(/\s+/g, '')]:
                        {
                          updatedDate: '',
                          status: '',
                          comments: []
                        }
                      }
                    }
                  }
                }
                tableData.push(temp2)
              }
            })
          }
          newProjects.push(pro);
        });
        setBarData(tableData);
        setProjects(newProjects);
      }

      uniqueItem.forEach((ut) => {
        let tempUt = ut.toLowerCase().replace(/\s+/g, '')
        tempColumns.push({
          Header: () => <span className={clsx(classes.centerText1)}>{ut}</span>,
          //width: 'initial',
          style: {
            borderWidth: 0.5,
            borderStyle: 'solid',
          },
          getProps: (state, rowInfo) => {
            if (rowInfo && rowInfo.original) {
              return {
                style: {
                  background: rowInfo.original[tempUt].status === 3 ? "#32CD32" : rowInfo.original[tempUt].comments.length || rowInfo.original[tempUt].status === 5 ? "orange" : null,
                  height: '34px',
                }
              };
            } else {
              return {};
            }
          },
          Cell: ({ row }) => (
            <>
              <Tooltip
                title={
                  row._original[tempUt].status !== 3 ?
                    row._original[tempUt].comments.length ?
                      row._original[tempUt].comments[row._original[tempUt].comments.length - 1].comment
                      : null
                    : "Complete"}
                placement="top"
                width="auto"
              >
                <Typography className={clsx(classes.centerText1)} onClick={() => callFolder(ut, row._original[tempUt])}>
                  {row._original[tempUt].updatedDate ? moment(row._original[tempUt].updatedDate).format("DD-MM-YYYY") : null}
                </Typography>
              </Tooltip>
            </>
          ),
        })
      })

    }
    setColumns(tempColumns)
  }, [entities]);

  useEffect(() => {
    if (_.isEmpty(projectDetails)) {
      if (projects.length) {
        setSelectedProject({ _id: projects[0]._id, menuEl: null });
      }
    }
  }, [projects]);

  useEffect(() => {
    if (projectDetails.organizationId !== undefined) {
      dispatch(getOrganization({ OrganizationId: projectDetails.organizationId }));
    }
  }, []);

  const unique = (value, index, self) => {
    return self.indexOf(value) === index
  }

  const handleChange = (prop) => (event) => {
    setInv(event.target.value);
  };

  function callFolder(folder, value) {
    let id = value.id;
    if (id !== undefined && id !== null) {
      dispatch(getProject(id)).then(
        (response) => {
          history.push({ pathname: `/projects/${id}` });
          dispatch(routes("FolderDoc"));
          sessionStorage.setItem("folder", folder);
        }
      );
    }
  }

  function gotoProject(row) {
    dispatch(getProject(row.id)).then(
      (response) => {
        history.push({ pathname: `/projects/${row.id}`, })
      }
    );
  }

  function changeInventoryGraph(invDetails) {
    setPageLoading(true);
    dispatch(getDashboardAsPerProject({ projectId: projectDetails._id, invId: invDetails._id })).then((response) => {
      setIframeUrl(response.payload);
      setInvData(response.payload.inventoryData);
      setTotalInvCount(response.payload.totalInvCount)
      setMonthlyInvCount(response.payload.monthlyInventoryCount)
      setPageLoading(false);
      setInv(invDetails.type)
    })
  }

  return (
    <FusePageSimple
      className="flex flex-wrap"
      classes={{
        header: "min-h-160 h-160",
        toolbar: "min-h-48 h-48",
        rightSidebar: "w-288",
        content: classes.content,
      }}
      enter={{
        animation: "transition.slideUpBigIn",
      }}
      content={
        show === true && type === 'Single' ?//type All for adityraj
          <div className="flex flex-wrap w-full p-20">
            <Paper className="w-full rounded-8 shadow-1">
              <div className="flex items-center justify-between px-16 h-64 border-b-1">
                <Typography className="text-16">Master Checklist</Typography>
                <Typography className="text-30 font-500 rounded-4 px-8 py-4">
                  In Progress
                  <Chip className="mr-6 ml-10" style={{ backgroundColor: "orange" }} />
                  Completed
                  <Chip className="mr-6 ml-10" style={{ backgroundColor: "#32CD32" }} />
                </Typography>
              </div>
              <FuseAnimate animation="transition.slideUpIn" className="p-20 w-full h-auto " delay={100}>
                <ReactTableFixedColumns
                  className={classes.root}
                  getTrProps={(state, rowInfo, column) => {
                    return {
                      className: "items-center justify-center",
                    };
                  }}
                  data={barData}
                  columns={columns}
                  defaultPageSize={barData.length > 10 ? 10 : barData.length}
                />
              </FuseAnimate>
            </Paper>
          </div>
          :
          <>
            <div className="flex flex-wrap w-full">
              <Backdrop className={classes.backdrop} open={pageLoading}>
                <CircularProgress color="inherit" />
              </Backdrop>
              <div className="flex items-center w-full mr-16 justify-between px-16 h-48 border-b-1">
                <div className="flex w-full items-center justify-start gap-10" >
                  <Typography className="text-16 font-bold"> Dashboard </Typography>
                </div>

                {inventoryList.length > 0 ?
                  <div className="flex w-md items-end justify-end">
                    <FormControl className="mt-10 mb-10 mr-16">
                      <InputLabel id="demo-simple-select-placeholder-label-label">
                        Inventory
                      </InputLabel>
                      <Select
                        required
                        id="demo-dialog-select"
                        className="w-full"
                        value={inv}
                        onChange={handleChange("inv")}
                      >
                        {inventoryList.map((vname) => (
                          <MenuItem key={vname.id} value={vname.type} onClick={() => changeInventoryGraph(vname)}>
                            {vname.type + " - " + vname.unit}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  : null}
              </div>

              {/* <button onClick={toggleGraph}>
        Toggle Graph
      </button> */}
              {/* Inventory row */}

              {/* {inventoryList.length > 0 ?
               <div className="flex flex-col sm:flex-row w-full">
                  <Card className="shadow-1 w-full mb-4 sm:mb-0" style={{"borderColor":"#D3D3D3","borderBottom":"none", "borderRadius":"10px", "marginBottom":"10px","marginRight":"5px", "marginTop":"10px" }}>
                    {invData.length ?
                      <InventoryGraph data={invData}/>
                    :
                      <Grid container spacing={{ xs: 6, md: 4 }}  alignItems="center" justify="center" >
                        <Grid item xs={12}>
                          <Typography className= "font-bold text-center" style={{'fontSize':'20px', 'marginTop':'20px','color':'black','font-family': 'Arial, Helvetica, sans-serif'}}>  NO DATA FOUND </Typography>
                        </Grid>
                      </Grid>
                    }
                    {console.log("invData",invData)}
                  </Card>
                  <Card className="shadow-1 sm:w-1/4 mb-4 sm:mb-0" style={{"borderColor":"#D3D3D3","borderBottom":"none", "borderRadius":"10px", "paddingTop":"20px","marginRight":"5px", "marginBottom":"10px","marginTop":"10px" }}>
                    <Grid container spacing={{ xs: 6, md: 4 }}  alignItems="center" justify="center" >
                      <Grid item xs={12}>
                      <Typography className= "font-bold text-center" style={{'fontSize':'40px','color':'black','font-family': 'Arial, Helvetica, sans-serif'}}>  {Number.isInteger(monthlyInvCount) ? monthlyInvCount : monthlyInvCount.toFixed(2)} </Typography>
                      <Typography className= "font-bold text-center" style={{'fontSize':'15px','color':'black','font-family': 'Arial, Helvetica, sans-serif'}}>  Total Consumed in <br/>last 30 days </Typography>
                      </Grid>
                    </Grid>
                  </Card>
                  <Card className="shadow-1 sm:w-1/4 mb-4 sm:mb-0" style={{"borderColor":"#D3D3D3","borderBottom":"none", "borderRadius":"10px", "paddingTop":"20px", "marginBottom":"10px","marginRight":"5px","marginTop":"10px"}}>
                    <Grid container spacing={{ xs: 6, md: 4 }}  alignItems="center" justify="center" >
                      <Grid item xs={12}>
                      <Typography className= "font-bold text-center" style={{'fontSize':'40px','color':'black','font-family': 'Arial, Helvetica, sans-serif'}}>  {Number.isInteger(totalInvCount) ? totalInvCount : totalInvCount.toFixed(2)} </Typography>
                      <Typography className= "font-bold text-center" style={{'fontSize':'15px','color':'black','font-family': 'Arial, Helvetica, sans-serif'}}>  Cumulative <br/> Consumed </Typography>
                      </Grid>
                    </Grid>
                  </Card>
               </div>
              :null} */}


              {/* */}
              {showInventoryGraph && invData.length > 0 ? (
                <div className="flex flex-col sm:flex-row w-full">
                  <Card className="shadow-1 w-full mb-4 sm:mb-0" style={{ "borderColor": "#D3D3D3", "borderBottom": "none", "borderRadius": "10px", "marginBottom": "10px", "marginRight": "5px", "marginTop": "10px" }}>
                    {invData.length ? (
                      <InventoryGraph data={invData} />
                    ) : (
                      <Grid container spacing={{ xs: 6, md: 4 }} alignItems="center" justify="center">
                        <Grid item xs={12}>
                          <Typography className="font-bold text-center" style={{ 'fontSize': '20px', 'marginTop': '20px', 'color': 'black', 'fontFamily': 'Arial, Helvetica, sans-serif' }}>  NO DATA FOUND </Typography>
                        </Grid>
                      </Grid>
                    )}
                  </Card>
                  <Card className="shadow-1 sm:w-1/4 mb-4 sm:mb-0" style={{ "borderColor": "#D3D3D3", "borderBottom": "none", "borderRadius": "10px", "paddingTop": "20px", "marginRight": "5px", "marginBottom": "10px", "marginTop": "10px" }}>
                    <Grid container spacing={{ xs: 6, md: 4 }} alignItems="center" justify="center">
                      <Grid item xs={12}>
                        <Typography className="font-bold text-center" style={{ 'fontSize': '40px', 'color': 'black', 'font-family': 'Arial, Helvetica, sans-serif' }}>  {Number.isInteger(monthlyInvCount) ? monthlyInvCount : monthlyInvCount.toFixed(2)} </Typography>
                        <Typography className="font-bold text-center" style={{ 'fontSize': '15px', 'color': 'black', 'font-family': 'Arial, Helvetica, sans-serif' }}>  Total Consumed in <br />last 30 days </Typography>
                      </Grid>
                    </Grid>
                  </Card>
                  <Card className="shadow-1 sm:w-1/4 mb-4 sm:mb-0" style={{ "borderColor": "#D3D3D3", "borderBottom": "none", "borderRadius": "10px", "paddingTop": "20px", "marginBottom": "10px", "marginRight": "5px", "marginTop": "10px" }}>
                    <Grid container spacing={{ xs: 6, md: 4 }} alignItems="center" justify="center">
                      <Grid item xs={12}>
                        <Typography className="font-bold text-center" style={{ 'fontSize': '40px', 'color': 'black', 'font-family': 'Arial, Helvetica, sans-serif' }}>  {Number.isInteger(totalInvCount) ? totalInvCount : totalInvCount.toFixed(2)} </Typography>
                        <Typography className="font-bold text-center" style={{ 'fontSize': '15px', 'color': 'black', 'font-family': 'Arial, Helvetica, sans-serif' }}>  Cumulative <br /> Consumed </Typography>
                      </Grid>
                    </Grid>
                  </Card>
                </div>
              ) : null}

              {/* Labor row */}
              <div className="flex flex-col sm:flex-row w-full">
                <Card className="shadow-1 w-full mb-4 sm:mb-0" style={{ "borderColor": "#D3D3D3", "borderBottom": "none", "borderRadius": "10px", "marginBottom": "10px", "marginRight": "5px", }}>
                  {laborData.length > 0 ?
                    <LaborGraph data={laborData} />
                    :
                    <Grid container spacing={{ xs: 6, md: 4 }} alignItems="center" justify="center" >
                      <Grid item xs={12}>
                        <Typography className="font-bold text-center" style={{ 'fontSize': '20px', 'marginTop': '20px', 'color': 'black', 'font-family': 'Arial, Helvetica, sans-serif' }}>  NO DATA FOUND </Typography>
                      </Grid>
                    </Grid>
                  }

                </Card>
                <Card className="shadow-1 sm:w-1/4 mb-4 sm:mb-0" style={{ "borderColor": "#D3D3D3", "borderBottom": "none", "borderRadius": "10px", "paddingTop": "20px", "marginBottom": "10px", "marginRight": "5px", }}>
                  <Grid container spacing={{ xs: 6, md: 4 }} alignItems="middle" justify="center" >
                    <Grid item xs={12}>
                      <Typography className="font-bold text-center" style={{ 'fontSize': '40px', 'color': 'black', 'font-family': 'Arial, Helvetica, sans-serif' }}>  {monthlyLabor} </Typography>
                      <Typography className="font-bold text-center" style={{ 'fontSize': '15px', 'color': 'black', 'font-family': 'Arial, Helvetica, sans-serif' }}>  Total Labor in <br />last 30 days </Typography>
                    </Grid>
                  </Grid>
                </Card>
                <Card className="shadow-1 sm:w-1/4 mb-4 sm:mb-0" style={{ "borderColor": "#D3D3D3", "borderBottom": "none", "borderRadius": "10px", "paddingTop": "20px", "marginBottom": "10px", "marginRight": "5px", }}>
                  <Grid container spacing={{ xs: 6, md: 4 }} alignItems="center" justify="center" >
                    <Grid item xs={12}>
                      <Typography className="font-bold text-center" style={{ 'fontSize': '40px', 'color': 'black', 'font-family': 'Arial, Helvetica, sans-serif' }}>  {totalLabor} </Typography>
                      <Typography className="font-bold text-center" style={{ 'fontSize': '15px', 'color': 'black', 'font-family': 'Arial, Helvetica, sans-serif' }}>  Cumulative <br /> Labor Count </Typography>
                    </Grid>
                  </Grid>
                </Card>
              </div>

              {/* Daily data and checklist */}
              {/* <div className="flex flex-col sm:flex-row w-full">
                <Card className="shadow-1 sm:w-1/4 mb-4 sm:mb-0" style={{"borderColor":"#D3D3D3","borderBottom":"none", "borderRadius":"10px", "paddingTop":"10px", "marginBottom":"10px","marginRight":"5px","height":"150px", "paddingTop":"20px"}}>
                    <Grid container spacing={{ xs: 6, md: 4 }}  alignItems="center" justify="center" >
                      <Grid item xs={12}>
                      <Typography className= "font-bold text-center" style={{'fontSize':'40px','color':'black','font-family': 'Arial, Helvetica, sans-serif'}}> 12 Dec, 2022 </Typography>
                      <Typography className= "font-bold text-center" style={{'fontSize':'15px','color':'black','font-family': 'Arial, Helvetica, sans-serif'}}>  Last Daily Data Added </Typography>
                      </Grid>
                    </Grid>
                  </Card>
                  <Card className="shadow-1 sm:w-1/4 mb-4 sm:mb-0" style={{"borderColor":"#D3D3D3","borderBottom":"none", "borderRadius":"10px", "paddingTop":"10px", "marginBottom":"10px","marginRight":"5px", "height":"150px", "paddingTop":"20px" }}>
                    <Grid container spacing={{ xs: 6, md: 4 }}  alignItems="center" justify="center" >
                      <Grid item xs={12}>
                      <Typography className= "font-bold text-center" style={{'fontSize':'40px','color':'black','font-family': 'Arial, Helvetica, sans-serif'}}>  4 </Typography>
                      <Typography className= "font-bold text-center" style={{'fontSize':'15px','color':'black','font-family': 'Arial, Helvetica, sans-serif'}}>  Checklists Created in last 30 Days </Typography>
                      </Grid>
                    </Grid>
                  </Card>
                </div> */}
              {/* <iframe
                src={iframeUrl}
                frameBorder={0}
                width="100%"
                height={600}
                allowTransparency
              /> */}
            </div>
          </>
      }
      // rightSidebarContent={
      // 	<FuseAnimateGroup
      // 		className="w-full"
      // 		enter={{
      // 			animation: 'transition.slideUpBigIn'
      // 		}}
      // 	>
      // 		<div className="widget w-full p-12">
      // 			<WidgetNow />
      // 		</div>
      // 		<div className="widget w-full p-12">
      // 			<WidgetWeather widget={widgets.weatherWidget} />
      // 		</div>
      // 	</FuseAnimateGroup>
      // }
      ref={pageLayout}
    />
  );
  //}
}

export default UserDashboard;
