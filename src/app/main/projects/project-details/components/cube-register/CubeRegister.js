import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Fab, Icon, Typography, Button } from '@material-ui/core';
import FuseAnimate from "@fuse/core/FuseAnimate";
import FuseLoading from "@fuse/core/FuseLoading";
import { useDispatch, useSelector } from "react-redux";
import ReactTable from "react-table-6";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import CubeRegisterDialog from "./CubeRegisterDialog";
import { Backdrop } from "@material-ui/core";
import {
    getCubeRegister,
    openNewDialog,
    openEditDialog,
    detailSample
  } from "app/main/projects/store/projectsSlice";
import moment from "moment/moment";
import Chip from "@material-ui/core/Chip";

const useStyles = makeStyles((theme) => ({
  addButton: {
    position: "fixed",
    right: 40,
    bottom: 5,
    zIndex: 99,
  },
  root: {
    maxHeight: "68vh",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 3,
    color: "#fff",
  },
}));


function CubeRegister(props) {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const cubeRegister = useSelector(({ projects }) => projects.cubeRegister.sampleList);
  const projectId = useSelector(({ projects }) => projects.details._id);
  const loading = useSelector(({ projects }) => projects.loading);
  const [access, setAccess] = useState();
  const team = useSelector(({ projects }) => projects.details.team);
  const role = useSelector(({ auth }) => auth.user);
  const [hide, setHide] = useState(false);
  let list = [];
  let id = '';
  let sampleNo = '';
  let sampleDate = '';
  let First_Test_Date = '';
  let Second_Test_Date = '';
  let status = '';
  let date = new Date();
  let today = moment(date).format("DD/MM/YYYY");

  cubeRegister.forEach((element) => {
    const average = list => list.reduce((prev, curr) => prev + curr) / list.length;
    id = element.id; 
    sampleNo = element.sampleNo;
    sampleDate = element.sampleDate
    First_Test_Date = element.First_Test_Date ;
    Second_Test_Date = element.Second_Test_Date;

    let avgArray1 = [], avg1 = 0, percentAvg1 = '';

    element.FirstTestData[0].data.forEach((fel)=>{
      avgArray1.push(fel.strength);
    })

    avg1 = avgArray1.length > 0 ? average(avgArray1) : 0;

    if(element.grade === undefined || element.grade === '')
    {
      percentAvg1 = (avg1 / 0.45).toFixed(2);
    } else if(element.grade === 'M10')
    {
      percentAvg1 = (avg1 / 0.1).toFixed(2);
    } else if(element.grade === 'M15')
    {
      percentAvg1 = (avg1 / 0.15).toFixed(2);
    } else if(element.grade === 'M20' || element.grade === 'M20 ')
    {
      percentAvg1 = (avg1 / 0.2).toFixed(2);
    } else if(element.grade === 'M25')
    {
      percentAvg1 = (avg1 / 0.25).toFixed(2);
    } else if(element.grade === 'M30'|| element.grade === 'M30PILE' || element.grade === 'M30 FF' || element.grade === 'M30FF' || element.grade === 'M30 Normal' || element.grade === 'M30N' || element.grade === 'M30NORMAL' || element.grade === 'M30 FREE FLOW' || element.grade === 'M30 Pile')
    {
     percentAvg1 = (avg1/ 0.3).toFixed(2);
    } else if(element.grade === 'M35')
    {
      percentAvg1 = (avg1/ 0.35).toFixed(2);
    } else if(element.grade === 'M40' || element.grade === 'M40FF')
    {
      percentAvg1 = (avg1/ 0.4).toFixed(2);
    } else if(element.grade === 'M45')
    {
      percentAvg1 = (avg1 / 0.45).toFixed(2);
    } else if(element.grade === 'M50')
    {
      percentAvg1 = (avg1 / 0.5).toFixed(2);
    } else if(element.grade === 'M55')
    {
      percentAvg1 = (avg1 / 0.55).toFixed(2);
    } else if(element.grade === 'M60')
    {
      percentAvg1 = (avg1 / 0.6).toFixed(2);
    } else if(element.grade === 'M65')
    {
      percentAvg1 = (avg1 / 0.65).toFixed(2);
    } else if(element.grade === 'M70')
    {
      percentAvg1 = (avg1 / 0.7).toFixed(2);
    }

    let avgArray2 = [], avg2= 0, percentAvg2= '';

    element.SecondTestData[0].data.forEach((fel)=>{
     avgArray2.push(fel.strength);
    })

    avg2 = avgArray2.length > 0 ? average(avgArray2) : 0;

   if(element.grade === undefined || element.grade === '')
   {
     percentAvg2= (avg2/ 0.45).toFixed(2);
   }else if(element.grade === 'M10')
   {
    percentAvg2= (avg2/ 0.1).toFixed(2);
   } else if(element.grade === 'M15')
   {
     percentAvg2= (avg2/ 0.15).toFixed(2);
   } else if(element.grade === 'M20' || element.grade === 'M20 ')
   {
     percentAvg2= (avg2/ 0.2).toFixed(2);
   } else if(element.grade === 'M25')
   {
     percentAvg2= (avg2/ 0.25).toFixed(2);
   }else if(element.grade === 'M30'|| element.grade === 'M30PILE' || element.grade === 'M30 FF' || element.grade === 'M30FF' || element.grade === 'M30 Normal' || element.grade === 'M30N' || element.grade === 'M30NORMAL' || element.grade === 'M30 FREE FLOW' || element.grade === 'M30 Pile')
   {
    percentAvg2 = (avg2/ 0.3).toFixed(2);
   } else if(element.grade === 'M35')
   {
     percentAvg2= (avg2/ 0.35).toFixed(2);
   } else if(element.grade === 'M40' || element.grade === 'M40FF')
   {
     percentAvg2= (avg2/ 0.4).toFixed(2);
   } else if(element.grade === 'M45')
   {
     percentAvg2= (avg2/ 0.45).toFixed(2);
   } else if(element.grade === 'M50')
  {
    percentAvg2= (avg2/ 0.5).toFixed(2);
   } else if(element.grade === 'M55')
   {
    percentAvg2= (avg2/ 0.55).toFixed(2);
   } else if(element.grade === 'M60')
   {
     percentAvg2= (avg2/ 0.6).toFixed(2);
   } else if(element.grade === 'M65')
   {
     percentAvg2= (avg2/ 0.65).toFixed(2);
   } else if(element.grade === 'M70')
   {
     percentAvg2= (avg2/ 0.7).toFixed(2);
   }

    let Date1 = moment(element.FirstResult_Reminder_Date).format("DD/MM/YYYY");
    let Date2 = moment(element.SecondResult_Reminder_Date).format("DD/MM/YYYY");

    if(process(Date1) < process(today) && element.FirstTestData[0].data.length <= 0){
      status = 'Overdue';
    }else if(process(Date2) < process(today) && element.SecondTestData[0].data.length <= 0){
      status = 'Overdue';
    }else if(process(Date1) > process(today) || process(Date2) > process(today) ){
      status = "New";
    }else{
      status = "Complete"
    }

    list.push({ id, sampleNo, sampleDate, First_Test_Date, Second_Test_Date, favg:Number(percentAvg1), savg: Number(percentAvg2), status });
  });

  function process(date){
    var parts = date.split("/");
    return new Date(parts[2], parts[1] - 1, parts[0]);
 }

//  const updateHighlightStatus = () => {
//   const currentDate = moment();
//   const updatedCubeRegister = cubeRegister.map((cube) => {
//     const sampleDate = moment(cube.sampleDate, "DD/MM/YYYY");
//     const daysDifference = currentDate.diff(sampleDate, "days");

//     if (daysDifference >= 28) {
//       return {
//         ...cube,
//         highlight: false, 
//       };
//     }

//     return cube;
//   });

// };

// useEffect(() => {
//   updateHighlightStatus();
// }, [cubeRegister]);

  
  useEffect(() => {
    team.forEach((t)=>{
      if(t._id === role.data.id && t.role === "owner")
      {
        setAccess(true)
      }else if(t._id === role.data.id && t.role !== "owner")
      {
         const member=t.tab_access.filter((i)=>i === "Cube-Register");
         console.log(member)
         if(member[0] === "Cube-Register")
         {
           setAccess(true)
         }
      }
      if(t._id === role.data.id && t.role === "CIDCO Official"){
        setHide(true)
       }
    })
  }, [access, role.data.id, team]);

  useEffect(() => {
    dispatch(getCubeRegister(projectId));
  }, [dispatch, projectId]);

  if (!cubeRegister) {
    return <FuseLoading />;
  }

  const openDialog = (data) => {
    let sampleId = data.id;
    dispatch(detailSample({ sampleId })).then((response) => {
      dispatch(openEditDialog(data));
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
         { console.log("chklist",list)}

  return (
    <React.Fragment>
      <Paper className="w-full rounded-8 shadow-1">
      <div className="flex items-center justify-between px-16 h-64 border-b-1">
          <Typography className="text-16 font-bold">Cube Register</Typography>
          {list.length > 0 ?
            <>
              <Typography className="text-30 font-500 rounded-4 px-8 py-4">
                Failed
               <Chip className="mr-6 ml-10" style={{ backgroundColor: "#FF0000" }}/>
               Overdue
               <Chip className="mr-6 ml-10" style={{ backgroundColor: "#FFA500" }}/>
               {access && hide === false?
                 <Button color="primary" onClick={() => dispatch(openNewDialog())} variant="contained" style={{padding:'3px 16px'}} nowrap="true">Add Sample</Button> 
                :null}
               </Typography> 
            </>
          :null} 
         { console.log("chklist",list)}
        </div>
        <FuseAnimate animation="transition.slideUpIn" delay={100}>
          <ReactTable
            filterable = {true} 
            className = {classes.root}
            getTrProps = {(state, rowInfo, column) => {
              return {
                className: "-striped -highlight items-center justify-center",
              };
            }}
            data = {list}
            defaultFilterMethod={(filter, row) => filterCaseInsensitive(filter, row) }
            columns = {[
              {
                Header: "Sample No",
                accessor: "sampleNo",
                style: { 'white-space': 'unset' },
                Cell: ({ row }) => (
                  <Typography
                    className="font-bold hover:underline cursor-pointer"
                    color="secondary"
                    onClick={() => {
                      openDialog(row._original)
                    }}
                  >
                    {row.sampleNo}
                  </Typography>
                ),
                getProps: (state, rowInfo) => {
                  if (rowInfo && rowInfo.original) {
                    return {
                      style: {
                        background: rowInfo.original.status === 'Overdue' ? "#FFA500" : null,
                        height:'34px',
                      }
                    };
                  } else {
                    return {};
                  }
                },
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
                Header: "Date of Casting",
                accessor: "sampleDate",
                // style : {'text-align': 'center'},
                // width: 150,
                className: "justify-center font-bold",
                getProps: (state, rowInfo) => {
                  if (rowInfo && rowInfo.original) {
                    return {
                      style: {
                        background: rowInfo.original.status === 'Overdue' ? "#FFA500" : null,
                        height:'34px',
                      }
                    };
                  } else {
                    return {};
                  }
                },
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
                Header: "First Testing Date",
                accessor: "First_Test_Date",
                className: "justify-center font-bold",
                getProps: (state, rowInfo) => {
                  if (rowInfo && rowInfo.original) {
                    return {
                      style: {
                        background: rowInfo.original.savg > 100 && rowInfo.original.savg > 0 ? null  :
                        rowInfo.original.favg < 65 && rowInfo.original.favg > 0 ? "#FF0000"  : rowInfo.original.status === 'Overdue' ? "#FFA500" : null,
                        height:'34px',
                      }
                    };
                  } else {
                    return {};
                  }
                },
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
                Header: "Second Testing Date",
                accessor: "Second_Test_Date",
                className: "justify-center font-bold",
                getProps: (state, rowInfo) => {
                  if (rowInfo && rowInfo.original) {
                    return {
                      style: {
                        background: rowInfo.original.savg < 100 && rowInfo.original.savg > 0 ? "#FF0000"  : rowInfo.original.status === 'Overdue' ? "#FFA500" : null,
                        height:'34px',
                      }
                    };
                  } else {
                    return {};
                  }
                },
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
              // {
              //   Header: 'Status',
              //   style: { textAlign:"center",'white-space': 'unset' },
              //   id: 'status',
              //   accessor: (d) => (
              //     <Typography
              //       className={
              //         d.status === 'In Progress'
              //           ? 'bg-orange-700 text-white inline p-4 rounded truncate'
              //           : d.status === 'Complete'
              //           ? 'bg-green-700 text-white inline p-4 rounded truncate'
              //           : d.status === 'New'
              //           ? 'bg-blue  -700 text-white inline p-4 rounded truncate'
              //           : d.status === 'Overdue'
              //           ? 'bg-red-700 text-white inline p-4 rounded truncate '
              //           :'bg-purple-700 text-white inline p-4 rounded truncate '
              //       }
              //     >
              //       {d.status}
              //     </Typography>
              //   ),
              //   className: 'font-bold',
              // },
            ]}
            defaultPageSize={10}
            noDataText="No Sample Found"
          />
        </FuseAnimate>
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
       
        {hide === true ? null :
        <FuseAnimate animation="transition.expandIn" delay={300}>
          <Fab
            color="primary"
            aria-label="add"
            className={classes.addButton}
            onClick={() => {
              dispatch(openNewDialog())
            }}
          >
            <Icon>add</Icon>
          </Fab>
        </FuseAnimate>
        }
      
      </Paper>

      <CubeRegisterDialog />

    </React.Fragment>
  );
}

export default CubeRegister;