import {
    makeStyles,
    withStyles,
    Paper,
    Typography,
  } from "@material-ui/core";
  import _ from "@lodash";
  import {
    getProject,
    listTasks,
  } from "../../../../store/projectsSlice";
  import clsx from "clsx";
  import React, { useEffect } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import PlanView from "app/main/projects/plan-view/PlanView";
  import FuseLoading from "@fuse/core/FuseLoading";
  import Table from "@material-ui/core/Table";
  import TableBody from "@material-ui/core/TableBody";
  import TableCell from "@material-ui/core/TableCell";
  import TableContainer from "@material-ui/core/TableContainer";
  import TableHead from "@material-ui/core/TableHead";
  import TableRow from "@material-ui/core/TableRow";
  import { LazyLoadImage } from "react-lazy-load-image-component";
  
  
  const useStyles = makeStyles((theme) => ({
    page: {
      width: "21cm",
      minHeight: "29.7cm",
      padding: "2cm",
      margin: "1cm auto",
      border: " 1px #D3D3D3 solid",
      borderRadius: "5px",
      background: "white",
      boxShadow: " 0 0 5px rgba(0, 0, 0, 0.1)",
    },
    page1: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100vh",
      margin: "20px",
      alignItems: "start",
      justifyContent: "center",
    },
    table: {
      minWidth: 500,
    },
    img: {
      pageBreakAfter: "always",
      overflow: "auto",
      // pageBreakBefore: "always",
    },
    task: {
      pageBreakBefore: "always",
      pageBreakAfter: "always",
    },
    list: {
      width: "100%",
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    pagebreak:{
      pageBreakInside: "avoid",
    }
  }));
  
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
  
  function PlanSummary(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    useEffect(() => {
      dispatch(getProject(props.match.params.projectId));
      dispatch(
        listTasks({ projectId: props.match.params.projectId, filter: {} })
      );
    }, [dispatch,props.match.params.projectId]);
    const details = useSelector(({ projects }) => projects.details);
    const plans = useSelector(({ projects }) => projects.details.plans);
    const tasks = useSelector(({ projects }) => projects.tasks.tasksArray);
    // const information = useSelector(
    //   ({ projects }) => projects.additionalInformation
    // );
  
    if (plans) {
      let tasks = [];
      tasks.forEach((task) => {
        if (task.planId) {
          plans.forEach((plan) => {
            if (plan._id.toString() === task.planId.toString()) { 
              tasks.push({
                planId: task.planId,
                index: task.planIndex,
                url: plan.file,
                title: task.title,
                description: task.description,
                marker: task.marker,
                pictures: task.pictures || [],
              });
            }
          });
        }
      });
  
      var groups = {};
      for (var i = 0; i < tasks.length; i++) {
        var groupName = tasks[i].planId;
        if (!groups[groupName]) {
          groups[groupName] = [];
        }
        groups[groupName].push(tasks[i]);
      }
  
      tasks = [];
      for (var groupName1 in groups) {
        tasks.push({ planId: groupName1, items: groups[groupName1] });
      }
    }
    let filteredTasks = [];
    const taskFilter = (planId) => {
      filteredTasks = [];
      //let i = 1;
      tasks.forEach((task) => {
        let newTask = {};
        if (task.planId === planId) {
          newTask.index =task.planIndex;
          newTask.title = task.title;
          newTask.location = task.location;
          newTask.description=task.description;
          newTask.pictures=task.pictures || [];
          filteredTasks.push(newTask);
          i++;
        }
      }); 
      filteredTasks=_.sortBy(filteredTasks,"index");

    };
   
    // function createData(index, title, ans) {
    //   return { index, title, ans };
    // }

  
    if (!plans) {
      return <FuseLoading />;
    }
  
    return (
      <div className="flex flex-1 flex-col mb-10">
        <Paper>
          <div className="ml-24">
            <div className={clsx(classes.page1)}>
              <div className="mb-88">
                <Typography className="font-bold" style={{ fontSize: "300%" }}>
                  Plan Summary
                </Typography>
                <Typography className="font-bold" style={{ fontSize: "300%" }}>
                  Report
                </Typography>
              </div>
              <div className="mb-88">
                <Typography className="font-bold" style={{ fontSize: "200%" }}>
                  {details.title}
                </Typography>
                <Typography variant="subtitle1">{details.location}</Typography>
              </div>
              <div>
                <Typography variant="h6" className="font-bold">
                  ISSUED BY
                </Typography>
                <Typography variant="subtitle1">QBUILD APP</Typography>
              </div>
            </div>
            <div
              className="flex flex-1 flex-col gap-10 mb-10"
              style={{
                margin: "20px",
                width: "95%",
                pageBreakAfter: "always",
              }}
            >
              <Typography
                style={{ textAlign: "center" }}
                variant="h6"
                id="tableTitle"
                component="div"
              >
               Plans
              </Typography>
            </div>
            {plans.map((plan) => (
              <>
                {taskFilter(plan._id)}
                <div className={classes.img}>
                  <PlanView
                    projectId={props.match.params.projectId}
                    planId={plan._id}
                    feature={true}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    margin: "20px",
                    width: "95%",
                    pageBreakBefore: "always",
                    pageBreakAfter: "always",
                    
                  }}
                >
                  <TableContainer component={Paper}>
                       <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <StyledTableCell width="25%" align="center">Index No.</StyledTableCell>
                            <StyledTableCell width="25%" align="left">Task/Defect</StyledTableCell>
                            <StyledTableCell width="25%" align="left">Flat/Room/Unit</StyledTableCell>
                            <StyledTableCell width="50%" align="left">Description</StyledTableCell>
                          </TableRow>
                        </TableHead>
                       </Table>
                    </TableContainer>
                  
                  {filteredTasks.length ? (
                    filteredTasks.map((task,id) => ( 
                        <>
                    <TableContainer className="mt-20 pageBreakInside-avoid"   component={Paper}>
                       <Table className={classes.table} aria-label="simple table">
                        <TableBody >
                            <StyledTableRow  key={task.index}>
                              <StyledTableCell width="25%" align="center" component="th" scope="row">
                                {id+1}
                              </StyledTableCell>
                              <StyledTableCell width="25%" align="left">
                                {task.title}
                              </StyledTableCell>
                              <StyledTableCell width="25%" align="left">
                                {task.location}
                              </StyledTableCell>
                              <StyledTableCell width="50%" align="left">
                                {task.description}
                              </StyledTableCell>
                            </StyledTableRow>
                            {task.pictures.length>0?(
                            <>     
                             <StyledTableRow key={task.index}>
                      {/* <StyledTableCell width="15%" component="th" scope="row">
                          <Typography className="font-bold" style={{ fontSize: "100%" }} variant="subtitle1">Photos</Typography>
                      </StyledTableCell> */}
                    {task.pictures && task.pictures[0] ? (
                       <StyledTableCell width="25%" align="left">
                                <>
                                    <LazyLoadImage effect="blur"
                                        width="100%"
                                        className=" w-auto h-auto"
                                       // height={50}
                                        src={task.pictures[0].pictureUrl}
                                        alt="picture1" />
                                </>
                                </StyledTableCell>
                            ) : null}
                     
                    {task.pictures && task.pictures[1] ? (
                       <StyledTableCell width="25%" height="auto" align="left">
                                <>
                                    <LazyLoadImage effect="blur"
                                         width="100%"
                                         className=" w-auto h-auto"
                                        //height={50}
                                        src={task.pictures[1].pictureUrl}
                                        alt="picture1" />
                                </>
                                </StyledTableCell>
                            ) : null}

                   {task.pictures && task.pictures[2] ? (
                         <StyledTableCell width="25%" align="left">
                                <>
                                    <LazyLoadImage effect="blur"
                                         width="100%"
                                         className=" w-auto h-full"
                                       // height={50}
                                        src={task.pictures[2].pictureUrl}
                                        alt="picture1" />
                                </>
                                </StyledTableCell>
                            ) : null}
                            </StyledTableRow>
              
                            </>
                           ):null}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  
                      </>  
                    ))
                  ) : null}
                </div>
              </>
            ))}
          </div>
        </Paper>
      </div>
    );
  }
  
  export default PlanSummary;
  