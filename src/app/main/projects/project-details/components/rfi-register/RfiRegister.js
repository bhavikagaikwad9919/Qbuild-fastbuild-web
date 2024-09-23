import React, { useState,useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Fab, Icon } from "@material-ui/core";
import FuseAnimate from "@fuse/core/FuseAnimate";
import { useDispatch, useSelector } from "react-redux";
import ReactTable from "react-table-6";
import Paper from "@material-ui/core/Paper";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import RfiDialog from "./RfiDialog";
import { InputLabel } from '@material-ui/core';
import Typography from "@material-ui/core/Typography";
import moment from "moment";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";
import { detailRfi,  openNewDialog, openEditDialog } from "app/main/projects/store/projectsSlice";

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

function RfiRegister(props) {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const loading = useSelector(({ projects }) => projects.loading);
  const rfis = useSelector(({ projects }) => projects.rfis.rfiList);
  const projectId = useSelector(({ projects }) => projects.details._id);
  const [data, setData] = useState([]);
  const user = useSelector(({ auth }) => auth.user);
  const team = useSelector(({ projects }) => projects.details.team);
  const [access, setAccess] = useState(false);
  const [type, setType] = useState('All');
  const [hide, setHide] = useState(false);

  useEffect(() => {
    team.forEach((t)=>{
      if((t._id === user.data.id && t.role === "owner") || user.role === 'admin')
      {
        setAccess(true)
      }else if(t._id === user.data.id && t.role !== "owner")
      {
        const member=t.tab_access.filter((i)=>i === "RFI Register");
        console.log(member)
        if(member[0] === "RFI Register")
        {
          setAccess(true)
        }
      }

      if(t._id === user.data.id && t.role === "CIDCO Official"){
        setHide(true)
      }
    })
  }, [access, user.data.id, user.role, team]);

  let _id = '', rfiNo = '', rfiStatus = '';
  useEffect(()=>{
    let  newRfis = [];
    rfis.forEach((el)=>{
      let fromSpcpl = [],  toSpcpl = [],  fromAhc = [],  toAhc = [];

      el.fromSpcpldates.forEach((spd)=>{ fromSpcpl.push(` ${spd}`) })
      el.toSpcpldates.forEach((spd)=>{ toSpcpl.push(` ${spd}`) })
      el.fromAhcdates.forEach((spd)=>{ fromAhc.push(` ${spd}`) })
      el.toAhcdates.forEach((spd)=>{ toAhc.push(` ${spd}`) })

      _id = el._id;
      rfiNo = el.rfiNo;

      
      newRfis.push({ _id, rfiNo, fromSpcpl, fromAhc, toAhc, toSpcpl, rfiStatus});
    })

    setData(newRfis);
 
  },[rfis])

  const filterRfi = (event) =>{
    let  newRfis = [];
    setType(event.target.value)
    if(event.target.value === 'All'){
      let  newRfis = [];
      rfis.forEach((el)=>{
        let fromSpcpl = [],  toSpcpl = [],  fromAhc = [],  toAhc = [];
        _id = el._id;
        rfiNo = el.rfiNo;
        el.fromSpcpldates.forEach((spd)=>{ fromSpcpl.push(` ${spd}`) })
        el.toSpcpldates.forEach((spd)=>{ toSpcpl.push(` ${spd}`) })
        el.fromAhcdates.forEach((spd)=>{ fromAhc.push(` ${spd}`) })
        el.toAhcdates.forEach((spd)=>{ toAhc.push(` ${spd}`) })
        
        newRfis.push({ _id, rfiNo, fromSpcpl, fromAhc, toAhc, toSpcpl, rfiStatus});
      })
  
      setData(newRfis);
    }else{
      rfis.forEach((el)=>{
        let fromSpcpl = [],  toSpcpl = [],  fromAhc = [],  toAhc = [];
        if(el.status === event.target.value){
          _id = el._id;
          rfiNo = el.rfiNo;
          el.fromSpcpldates.forEach((spd)=>{ fromSpcpl.push(` ${spd}`) })
          el.toSpcpldates.forEach((spd)=>{ toSpcpl.push(` ${spd}`) })
          el.fromAhcdates.forEach((spd)=>{ fromAhc.push(` ${spd}`) })
          el.toAhcdates.forEach((spd)=>{ toAhc.push(` ${spd}`) })
          
          newRfis.push({ _id, rfiNo, fromSpcpl, fromAhc, toAhc, toSpcpl, rfiStatus});
        }
      })
  
      setData(newRfis);
    }
  }

  const openDialog = async (data) => {
    await dispatch(detailRfi({ projectId, rfiId:data._id }));
    dispatch(openEditDialog(data));
  }

  function filterCaseInsensitive(filter, row) {
    const id = filter.pivotId || filter.id;
    return (
      row[id] !== undefined ?
        String(row[id].props.children.toLowerCase()).includes(filter.value.toLowerCase())
      :
        false
    );
  }

  function handleClose(){
    setType('All');
    let  newRfis = [];
    rfis.forEach((el)=>{
      let fromSpcpl = [],  toSpcpl = [],  fromAhc = [],  toAhc = [];
      _id = el._id;
      rfiNo = el.rfiNo;
      _id = el._id;
      rfiNo = el.rfiNo;
      el.fromSpcpldates.forEach((spd)=>{ fromSpcpl.push(` ${spd}`) })
      el.toSpcpldates.forEach((spd)=>{ toSpcpl.push(` ${spd}`) })
      el.fromAhcdates.forEach((spd)=>{ fromAhc.push(` ${spd}`) })
      el.toAhcdates.forEach((spd)=>{ toAhc.push(` ${spd}`) })
      
      newRfis.push({ _id, rfiNo, fromSpcpl, fromAhc, toAhc, toSpcpl, rfiStatus});
    })

    setData(newRfis);
  }

  return (
    <React.Fragment>
      <Paper className="w-full rounded-8 shadow-1">
        <div className="flex items-center justify-between px-16 h-64 border-b-1">
          <Typography className="text-16 font-bold">RFI Register</Typography>
          <div className="flex items-end justify-end"  >
            <div className="flex flex-row gap-5 ml-40">
             <FormControl variant="outlined">
              <InputLabel id="demo-simple-select-outlined-label">
                Filter
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={type}
                onChange={filterRfi}
                label="Filter"
              >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="OPEN">OPEN</MenuItem>
                  <MenuItem value="CLOSED">CLOSED</MenuItem>
                  <MenuItem value="REJECTED">REJECTED</MenuItem>
              </Select>
             </FormControl>
            </div>
          </div> 
        </div>
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <Paper className="w-full rounded-8 shadow-1">
        <FuseAnimate animation="transition.slideUpIn" delay={100}>
          <ReactTable
            className={classes.root}
            getTrProps={(state, rowInfo, column) => {
              return {
                className: "-striped -highlight",
              };
            }}
            data={data}
            filterable
            defaultFilterMethod={(filter, row) => filterCaseInsensitive(filter, row) }
            columns={[
              {
                Header: "RFI No.",
                accessor: "rfiNo",
                //filterable: true,
                style: {'white-space': 'unset' },
                Cell: ({ row }) => (
                  <Typography
                    className="font-bold hover:underline cursor-pointer"
                    color="secondary"
                    onClick={access ? () => openDialog(row._original)
                      : () => dispatchWarningMessage(dispatch, "You don't have an access to update a issue.")
                    }
                  >
                    {row.rfiNo}
                  </Typography>
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
                Header: "RFI Date (From SPCPL)",
                id: "fromSpcpldates",
                style: { 'white-space': 'unset' },
                accessor: (i) => (
                  <Typography>
                    {i.fromSpcpl + "  "}
                  </Typography>
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
                //filterable: true,
                // width: 200,
           
              },
              {
                Header: "RFI Date (To AHC)",
                id: "toAhcdates",
                style: {'white-space': 'unset' },
                accessor: (i) => (
                  <Typography>
                    {i.toAhc +" "}
                  </Typography>
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
                //filterable: true,
                // width: 200,
               
              },
              {
                Header: "Response Date (From AHC)",
                id: "fromAhcdates", 
                style: { 'white-space': 'unset' },
                accessor: (i) => (
                  <Typography>
                    {i.fromAhc +" "}
                  </Typography>
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
                //filterable: true,
                // width: 200,
               
              },
              {
                Header: "Response Date (To SPCPL)",
                id: "toSpcpldates",
                style: { 'white-space': 'unset' },
                accessor: (i) => (
                  <Typography>
                    {i.toSpcpl + " "}
                  </Typography>
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
                //filterable: true,
                // width: 200,
           
              },
            ]}
            defaultPageSize={10}
            noDataText="No Data found"
          />
        </FuseAnimate>
        </Paper>
     
        {hide === true ? null :
          <FuseAnimate animation="transition.expandIn" delay={300}>
            <Fab
              color="primary"
              aria-label="add"
              className={classes.addButton}
              onClick={access?() => {
               dispatch(openNewDialog())
              }: () => dispatchWarningMessage(dispatch, "You don't have an access to add an issue.")}
            >
             <Icon>add</Icon>
            </Fab>
          </FuseAnimate>
        }
      </Paper>
      
      <RfiDialog  close={handleClose}/>

    </React.Fragment>
  );
}

export default RfiRegister;
