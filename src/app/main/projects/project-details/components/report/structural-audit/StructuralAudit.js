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
  getInformation,
  listObservations,
  getObservations
} from "../../../../store/projectsSlice";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
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

function StructuralAudit(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProject(props.match.params.projectId));
    dispatch(getInformation(props.match.params.projectId));
    dispatch(listObservations(props.match.params.projectId));
    dispatch(getObservations(props.match.params.projectId));
    dispatch(
      listTasks({ projectId: props.match.params.projectId, filter: {} })
    );
  }, [dispatch, props.match.params.projectId]);
  
  const details = useSelector(({ projects }) => projects.details);
  const plans = useSelector(({ projects }) => projects.details.plans);
  const tasks = useSelector(({ projects }) => projects.tasks.tasksArray);
  const information = useSelector(
    ({ projects }) => projects.additionalInformation
  );
  const observations = useSelector(
    ({ projects }) => projects.observations.observationsArray
  );

  const report_observations = useSelector(
    ({ projects }) => projects.reportObservations.observationsArray
  );
  const [image, setImage] = useState({
    name: "",
    file: "",
    url: "",
 });

 useEffect(()=>{
   if(information.image === undefined)
   {
     setImage({name: "", url: "", size: ""}); 
   }else{
     setImage(information.image); 
   }
 }, []);

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
    for (var groupName in groups) {
      tasks.push({ planId: groupName, items: groups[groupName] });
    }
  }

  let filteredTasks = [];
  const taskFilter = (planId) => {
    filteredTasks = [];
    let i = 1;
    tasks.map((task) => {
      let newTask = {};
      if (task.planId === planId) {
        newTask.index =task.planIndex;
        newTask.title = task.title;
        newTask.location = task.location;
        newTask.description = task.description;
        newTask.pictures = task.pictures || [];
        filteredTasks.push(newTask);
        i++;
      }
    }); 
    filteredTasks=_.sortBy(filteredTasks,"index");
  };

  function createData(index, title, ans) {
    return { index, title, ans };
  }

  function createData1(index, title, ans,reason) {
    return { index, title, ans, reason };
  }

  const rows1 = [
    createData(1, "Name of Building", details.title),
    createData(2, "CTS NO. /Ward", information.ward),
    createData(3, "No of Storey", information.no_of_storey),
    createData(4, "Year of Construction", information.constructionYear),
    createData(5, "Use", information.use),
  ];
  const rows2 = [
    createData("A", "Foundation", information.constructionMode.foundation),
    createData("B", "Floors", information.constructionMode.floors),
    createData("C", "Walls", information.constructionMode.walls),
    createData("D", "Beams", information.constructionMode.beams),
    createData("E", "Columns", information.constructionMode.columns),
    createData("F", "Roof", information.constructionMode.roof),
  ];
  let row3 = [];
  const history = () => {
    if (information.repairHistory.length) {
      information.repairHistory.map((item) => {
        row3.push(createData("A", "Year", item.year));
        row3.push(createData("B", "Notes", item.notes));
        row3.push(createData("C", "Slab recasting", item.slabRecasting));
        row3.push(createData("D", "Column Jacketing", item.columnJacketing));
        row3.push(
          createData("E", "Structural Repairs", item.structuralRepairs)
        );
        row3.push(
          createData("F", "Tenantable Repairs", item.tenantableRepairs)
        );
        row3.push(
          createData("G", "Roof / Waterproofing", item.roofWaterproofing)
        );
        row3.push(createData("H", "Plumbing", item.plumbing));
        row3.push(
          createData(
            "I",
            "Additions/Alterations if any",
            item.additionalAlterations
          )
        );
      });
    }
  };
  const rows4 = [
    createData(8, "Date of Inspection", information.date_of_inspection),
    createData(9, "Validity Period of Report", information.validity_period),
  ];
  const rows5 = [
    createData("A", "Internal Plaster", information.conditionsOf.internalPlaster),
    createData("B", "External Plaster", information.conditionsOf.externalPlaster),
    createData("C", "Plumbing", information.conditionsOf.plumbing),
    createData("D", "Drains lines/ chambers", information.conditionsOf.drainLinesChambers),
  ];
  let rows6=[];
  if(report_observations.length > 0)
  {
    rows6 = [
    createData("A", report_observations[0].title, report_observations[0].description),
    createData("B", report_observations[1].title, report_observations[1].description),
    createData("C", report_observations[2].title, report_observations[2].description),
    createData("D", report_observations[3].title, report_observations[3].description),
    createData("E", report_observations[4].title, report_observations[4].description),
    createData("F", report_observations[5].title, report_observations[5].description),
    createData("G", report_observations[6].title, report_observations[6].description),
    createData("H", report_observations[7].title, report_observations[7].description),
    createData("I", report_observations[8].title, report_observations[8].description),
    createData("J", report_observations[9].title, report_observations[9].description),
    createData("K", report_observations[10].title, report_observations[10].description),
    createData("L", report_observations[11].title, report_observations[11].description),
    createData("M", report_observations[12].title, report_observations[12].description),
    createData("N", report_observations[13].title, report_observations[13].description),
    createData("O", report_observations[14].title, report_observations[14].description),
    createData("P", report_observations[15].title, report_observations[15].description),
    createData("Q", report_observations[16].title, report_observations[16].description),
    createData("12", report_observations[17].title, report_observations[17].description),
    createData("13", report_observations[18].title, report_observations[18].description),


  ];
  }

  const rows7 = [
    createData("A", "Water Proofing", information.breifDescription.waterproofing),
    createData("B", "External Plaster", information.breifDescription.externalPlaster),
    createData("C", "Slab Recasting", information.breifDescription.slabRecasting),
    createData("D", "Column Jacketing", information.breifDescription.columnJacketing),
    createData("E", "Structural Repairs", information.breifDescription.structuralRepairs),
    createData("F", "RCC Cover to be replaced", information.breifDescription.rccCover),
    createData("G", "Beam Recasting", information.breifDescription.beamRecasting),
    createData("H", "Partial Evacuation", information.breifDescription.partialEvacuation),
    createData("I", "Propping", information.breifDescription.propping),

  ];

  const rows8 = [
    createData1("15", "Conclusions of Consultants","Observations", "Key Reason"),
    createData1("A", "Whether structure is livable / or whether it is to be evacuated / pulled down", information.conclusions.livableRepairs.length === 0? "" : information.conclusions.livableRepairs[0].observations,information.conclusions.livableRepairs.length === 0? "": information.conclusions.livableRepairs[0].key_reason),
    createData1("B", "Whether structure requires tenantable repairs / Major structural repairs & its time frame", information.conclusions.structuralRepairs.length === 0 ? "": information.conclusions.structuralRepairs[0].observations,information.conclusions.structuralRepairs.length === 0? "": information.conclusions.structuralRepairs[0].key_reason),
    createData1("C", "Whether structure can be allowed to occupy during course of repairs", information.conclusions.course_of_repairs.length === 0 ? "": information.conclusions.course_of_repairs[0].observations,information.conclusions.course_of_repairs.length === 0? "": information.conclusions.course_of_repairs[0].key_reason),
    createData1("D", "Nature / Methodology of repairs", information.conclusions.nature_of_repairs.length === 0 ? "": information.conclusions.nature_of_repairs[0].observations,information.conclusions.nature_of_repairs.length === 0? "": information.conclusions.nature_of_repairs[0].key_reason),
    createData1("E", "Whether structure requires immediate propping, if so, its propping plan / methodology given", information.conclusions.propping.length === 0 ? "": information.conclusions.propping[0].observations,information.conclusions.propping.length === 0? "": information.conclusions.propping[0].key_reason),
    createData1("F", "Whether other immediate safety measures required- What is specific recommendation?", information.conclusions.safety_measures.length === 0 ? "": information.conclusions.safety_measures[0].observations,information.conclusions.safety_measures.length === 0? "": information.conclusions.safety_measures[0].key_reason),
    createData1("G", "Enhancement in life of structure after repairs / frequency of repairs required in extended life period", information.conclusions.enhancement.length === 0 ? "": information.conclusions.enhancement[0].observations,information.conclusions.enhancement.length === 0? "": information.conclusions.enhancement[0].key_reason),
    createData1("H", "Projected repair cost / Sq.ft.", information.conclusions.repairCost.length === 0 ? "": information.conclusions.repairCost[0].observations,information.conclusions.repairCost.length === 0? "": information.conclusions.repairCost[0].key_reason),
    createData1("I", "Projected reconstruction cost / Sq.ft.", information.conclusions.reconstructionCost.length === 0 ? "": information.conclusions.reconstructionCost[0].observations,information.conclusions.reconstructionCost.length === 0? "": information.conclusions.reconstructionCost[0].key_reason),
    createData1("J", "Specific remarks, whether building needs to be vacated / demolished / repairable", information.conclusions.remarks.length === 0 ? "": information.conclusions.remarks[0].observations,information.conclusions.remarks.length === 0? "": information.conclusions.remarks[0].key_reason),
    createData1("K", "Whether structure in extremely critical condition", information.conclusions.critical_condition.length === 0 ? "": information.conclusions.critical_condition[0].observations,information.conclusions.critical_condition.length === 0? "": information.conclusions.critical_condition[0].key_reason),
   ];

    const rows9 = [
      createData("16", "Critical Observation", information.breifDescription.criticalObservation),
    ];



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
                Structural Audit
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

          {image.url !== '' && image.url !== undefined ?
            <img src={image.url} style={{'marginLeft':'30px', 'paddingRight':'100px'}} alt="image" />
          :null}
        
          <div
            className="flex flex-1 flex-col gap-10"
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
              Report
            </Typography>
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableBody>
                  {rows1.map((row) => (
                    <TableRow key={row.index}>
                      <TableCell component="th" scope="row" width="10%">
                        {row.index}
                      </TableCell>
                      <TableCell width="15%" align="left">{row.title}</TableCell>
                      <TableCell align="left">{row.ans === ''|| row.ans === null || row.ans === undefined ? '--': row.ans}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell align="left" colSpan={3}>
                     6. Mode of construction of existing building
                    </TableCell>
                  </TableRow>
                  {rows2.map((row) => (
                    <TableRow key={row.index}>
                      <TableCell component="th" scope="row" width="10%">
                        {row.index}
                      </TableCell>
                      <TableCell align="left">{row.title}</TableCell>
                      <TableCell align="left">{row.ans === ''|| row.ans === null || row.ans === undefined ? '--': row.ans}</TableCell>
                    </TableRow>
                  ))}

                  {history()}
                  <TableRow>
                    <TableCell align="left" colSpan={3}>
                     7 History of Repairs done year-wise
                    </TableCell>
                  </TableRow>
                  {row3.map((row) => (
                    <TableRow key={row._id}>
                      <TableCell component="th" scope="row" width="10%">
                        {row.index}
                      </TableCell>
                      <TableCell align="left">{row.title}</TableCell>
                      <TableCell align="left">{row.ans === ''|| row.ans === null || row.ans === undefined ? '--': row.ans}</TableCell>
                    </TableRow>
                  ))}
                   {rows4.map((row) => (
                    <TableRow key={row.index}>
                      <TableCell component="th" scope="row" width="10%">
                        {row.index}
                      </TableCell>
                      <TableCell align="left">{row.title}</TableCell>
                      <TableCell align="left">{row.ans === ''|| row.ans === null || row.ans === undefined ? '--': row.ans}</TableCell>
                    </TableRow>
                  ))}
                   <TableRow>
                    <TableCell align="left" colSpan={3}>
                     10 Condition Of -
                    </TableCell>
                  </TableRow>
                  {rows5.map((row) => (
                    <TableRow key={row.index}>
                      <TableCell component="th" scope="row" width="10%">
                        {row.index}
                      </TableCell>
                      <TableCell align="left">{row.title}</TableCell>
                      <TableCell align="left">{row.ans === ''|| row.ans === null || row.ans === undefined ? '--': row.ans}</TableCell>
                    </TableRow>
                  ))}
                   <TableRow>
                    <TableCell align="left" colSpan={3}>
                     11 General observations about -
                    </TableCell>
                  </TableRow>
                  {rows6.map((row) => (
                    <TableRow key={row.index}>
                      <TableCell component="th" scope="row" width="10%">
                        {row.index}
                      </TableCell>
                      <TableCell align="left">{row.title}</TableCell>
                      <TableCell align="left">{row.ans === ''|| row.ans === null || row.ans === undefined ? '--': row.ans}</TableCell>
                    </TableRow>
                  ))}
                    <TableRow>
                    <TableCell align="left" colSpan={3}>
                     14 Brief Description of repairs to be done.
                    </TableCell>
                  </TableRow>
                  {rows7.map((row) => (
                    <TableRow key={row.index}>
                      <TableCell component="th" scope="row" width="10%">
                        {row.index}
                      </TableCell>
                      <TableCell align="left">{row.title}</TableCell>
                      <TableCell align="left">{row.ans === ''|| row.ans === null || row.ans === undefined ? '--': row.ans}</TableCell>
                    </TableRow>
                  ))}
                     
                </TableBody>
              </Table>
            </TableContainer>

            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
              <TableBody>
              {rows8.map((row) => (
                    <TableRow key={row.index}>
                      <TableCell component="th" scope="row" width="10%">
                        {row.index}
                      </TableCell>
                      <TableCell width="25%" align="left">{row.title}</TableCell>
                      <TableCell width="25%" align="left">{row.ans === ''|| row.ans === null || row.ans === undefined ? '--': row.ans}</TableCell>
                      <TableCell width="25%" align="left">{row.reason === ''|| row.reason === null || row.reason === undefined ? '--': row.reason}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
              </Table>
            </TableContainer>

            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
              <TableBody>
              {rows9.map((row) => (
                    <TableRow key={row.index}>
                      <TableCell component="th" scope="row" width="10%">
                        {row.index}
                      </TableCell>
                      <TableCell width="15%"  align="left">{row.title}</TableCell>
                      <TableCell align="left">{row.ans === ''|| row.ans === null || row.ans === undefined ? '--': row.ans}</TableCell>  
                    </TableRow>
                  ))}
              </TableBody>
              </Table>
            </TableContainer>
           </div>
          {/* <div
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
              Observations
            </Typography>
            {observations.length ? (
              <List className={classes.root}>
                {observations.map((item) => (
                  <ListItem>
                    <ListItemText
                      primary={item.title}
                      secondary={
                        item.pictures.length ? (
                          <div className="flex flex-col gap-6">
                            {item.pictures.map((pic) => pic.pictureUrl)}
                          </div>
                        ) : null
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : null}
          </div>
          */}
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
                        <StyledTableCell width="25%" align="left">Title</StyledTableCell>
                        <StyledTableCell width="25%" align="left">Location</StyledTableCell>
                        <StyledTableCell width="50%" align="left">Description</StyledTableCell>
                      </TableRow>
                    </TableHead>
                  </Table>
                </TableContainer>
                  
                {filteredTasks.length ? (
                  filteredTasks.map((task,id) => ( 
                    <>
                      <TableContainer component={Paper}>
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
                                  {task.pictures && task.pictures[0] ? (
                                    <StyledTableCell width="25%" align="left">
                                      <>
                                        <LazyLoadImage effect="blur"
                                         width="100%"
                                         style={{height:"150px"}}
                                          src={task.pictures[0].pictureUrl}
                                          alt="picture1"
                                        />
                                      </>
                                    </StyledTableCell>
                                  ) : null}

                                  {task.pictures && task.pictures[1] ? (
                                    <StyledTableCell width="25%" height="auto" align="left">
                                      <>
                                        <LazyLoadImage effect="blur"
                                         width="100%"
                                         style={{height:"150px"}}
                                         src={task.pictures[1].pictureUrl}
                                         alt="picture1"
                                        />
                                      </>
                                    </StyledTableCell>
                                  ) : null}
                     
                                  {task.pictures && task.pictures[2] ? (
                                    <StyledTableCell width="25%" align="left">
                                      <>
                                        <LazyLoadImage effect="blur"
                                         width="100%"
                                         style={{height:"150px"}}
                                         src={task.pictures[2].pictureUrl}
                                         alt="picture1"
                                        />
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

export default StructuralAudit;
