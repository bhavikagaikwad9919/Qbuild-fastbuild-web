import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import FuseLoading from "@fuse/core/FuseLoading";
import {
  getVendors,
  updateLabour,
  updateLabourData,
  saveReport,
  openEditDialog,
  getDetailReport,
} from "app/main/projects/store/projectsSlice";

const useStyles = makeStyles((theme) =>({
  addButton: {
    position: "absolute",
    right: 12,
    bottom: 12,
    zIndex: 99,
  },
  delete: {
    color: "red",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

function Ssalabour(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getVendors(projectId));
  }, [dispatch]);
  const projectId = useSelector(({ projects }) => projects.details._id);
  const loading = useSelector(({ projects }) => projects.loading);
  const labour = useSelector(({ projects }) => projects.labour);
  const vendors = useSelector(({ projects }) => projects.vendors);
  const [newLabour, setNewLabour] = useState(labour);
  const [createAccess, setCreateAccess] = useState();
  const team = useSelector(({ projects }) => projects.details.team);
  const role = useSelector(({ auth }) => auth.user);
  //const laborRole = useSelector(({ organizations }) => organizations.dataStructure.laborRole);
  const laborRole = useSelector(({ sites }) => sites.dataStructure.laborRole);
  const [hide, setHide] = useState(false);

  let templab = [], vendorsName = [];

  vendors.vendorsList.forEach((item) => {
    if(item.agencyType === 'Sub-Contractor'){
      vendorsName.push({
       id: item._id,
       name: item.name,
      });
    }
  });

  useEffect(() => {
    team.map((t)=>{
     if(t._id === role.data.id && t.role === "owner"|| role.role === 'admin' || role.role === 'purchaseOfficer')
     {
       setCreateAccess(true);
     }else if(t._id === role.data.id && t.role !== "owner")
     {
       setCreateAccess(t.tab_access.includes("Daily Data") || t.tab_access.includes("Create/Update Daily Data"));
     }

      if(t._id === role.data.id && t.role === "CIDCO Official"){
       setHide(true)
      }
    })
  }, []);

  useEffect(() => {
    dispatch(updateLabour(newLabour));
  }, [newLabour]);

  if(props.data.Dialogtype === 'edit')
  {
    if(labour.length > 0){
      if(laborRole.length >= labour.length){
        laborRole.forEach((lbs, index)=>{
            let x = 0;
            labour.forEach((lb, id)=>{
              if(lb.role === lbs){
                x++;
                templab.push({
                  role: lb.role,
                  agency: lb.agency,
                  labourCount: lb.labourCount,
                })
              }else if(x === 0 && id === labour.length -1){
                templab.push({
                  role: lbs,
                  agency: vendorsName.length > 0 ? vendorsName[0].name : '',
                  labourCount: 0,
                })
  
                if(index === laborRole.length -1){
                  let filEq1 = templab.filter((eq)=> eq.role === lb.role);
                  if(filEq1.length === 0){
                    templab.push({
                      role: lb.role,
                      agency: vendorsName.length > 0 ? vendorsName[0].name : '',
                      labourCount: lb.labourCount,
                    })
                  }
                }
              }
            })
          })
      }else if(labour.length > laborRole.length){
        labour.forEach((lb, index)=>{
            let x = 0;
            laborRole.forEach((lbs, id)=>{
              if(lb.role === lbs){
                x++;
                templab.push({
                  role: lb.role,
                  agency: lb.agency,
                  labourCount: lb.labourCount,
                })
              }else if(x === 0 && id === laborRole.length -1){
                templab.push({
                  role: lb.role,
                  agency: vendorsName.length > 0 ? vendorsName[0].name : '',
                  labourCount: lb.labourCount,
                })
  
                if(index === labour.length -1){
                  let filEq2 = templab.filter((eq)=> eq.role === lbs);
                  if(filEq2.length === 0){
                    templab.push({
                      role: lbs,
                      agency: vendorsName.length > 0 ? vendorsName[0].name : '',
                      labourCount: 0,
                    })
                  }
                }
              }
            })  
          })
      }
    }else{
      laborRole.forEach((lb)=>{
        templab.push({
          role: lb,
          agency: vendorsName.length > 0 ? vendorsName[0].name : '',
          labourCount: 0,
        })
      })
    }
  }else{ 
    if(labour.length > 0){
      laborRole.forEach((lb)=>{
        let filterLb = labour.filter((lab)=> lab.role === lb);
        if(filterLb.length > 0){
          templab.push({
            role: lb,
            agency: filterLb[0].agency,
            labourCount: filterLb[0].labourCount,
          })
        }else{
          templab.push({
            role: lb,
            agency: vendorsName.length > 0 ? vendorsName[0].name : '',
            labourCount: 0,
          })
        }  
      })
    }else{
      laborRole.forEach((lb)=>{
        templab.push({
          role: lb,
          agency: vendorsName.length > 0 ? vendorsName[0].name : '',
          labourCount: 0,
        })
      })
    }
  }

  const handleChange = (prop) => (event) => {
    templab.map((lb)=>{
      if(lb.role === prop){
        lb.labourCount = Number(event.target.value);
        lb.agency = vendorsName.length > 0 ? vendorsName[0].name : '';
      }
    })
    setNewLabour(templab);
  };
 
  if (!vendors) {
    return <FuseLoading />;
  }

  const handleOpen =() =>{
    if(props.data.Dialogtype === 'edit')
    {
      dispatch(updateLabourData({ projectId, "type":"update", reportId:props.data.data._id,Data:templab})).then(
        (response) => {
          dispatch(getDetailReport({ projectId,reportId:props.data.data._id})).then(
            (response) => {
              if(response.payload === undefined)
              {
                props.onClose();
              }else{
                let row = {
                  "_id": response.payload._id,
                  "createdAt": response.payload.createdAt,
                  "submittedDate": response.payload.submittedDate,
                  "approvalDate": response.payload.approvalDate,
                  "status": response.payload.status === 0 ? 'Inactive' :response.payload.status === 1 ? 'New' : response.payload.status === 2 ? 'Submitted' :response.payload.status === 3 ? 'Approved' : response.payload.status === 4 ? 'Reverted':null,
                }
                dispatch(openEditDialog(row));
              }   
           }
         );
       }
      );
    }else{
      let bodyFormData = new FormData();
      bodyFormData.set("wing", "");
      bodyFormData.set("building", "");
      bodyFormData.set("floor", "");
      bodyFormData.set("flat", "");
      bodyFormData.set("workProgress", JSON.stringify([]));
      bodyFormData.set("inventory", JSON.stringify([]));
      bodyFormData.set("labour", JSON.stringify(templab));
      bodyFormData.set("hindrance", JSON.stringify([]));
      bodyFormData.set("staff", JSON.stringify([]));
      bodyFormData.set("sitevisitor", JSON.stringify([]));
      bodyFormData.set("notes", JSON.stringify([]));
      bodyFormData.set("equipment", JSON.stringify([]));
      bodyFormData.set("consumption", JSON.stringify([]));
      bodyFormData.set("existingAttachments", JSON.stringify([]));
      bodyFormData.append("attachments", '');
      bodyFormData.set("date", props.date);

     dispatch(saveReport({ projectId, formData: bodyFormData })).then(
      (response) => {
        if(response.payload === undefined)
        {
          props.onClose();
        }else{
          dispatch(getDetailReport({ projectId: projectId, reportId: response.payload._id })).then(
            (res) => {
              dispatch(openEditDialog(response.payload));
            }
         );
        }
      }
     );
    }
  }

  props.onCountChange({ labour: templab.length });

  return (
    <React.Fragment>
     <FormControl variant="outlined">  
        <List className="grid grid-cols-2">
          {templab.map((lb)=>
            <>
             <ListItem>
                <ListItemText className="w-1/2 font-bold" variant="h6">{lb.role}</ListItemText>
                <TextField
                  variant="outlined"
                  type="number"
                  className="w-1/3 items-center justify-center"
                  value={lb.labourCount}
                  onChange={handleChange(lb.role)}
                />
              </ListItem>
            </>
          )}
        </List>
     </FormControl>
      {hide === true ? null :
        <Button
          color="primary"
          variant="contained"
          aria-label="add"
          disabled={createAccess === true && templab.length > 0 ? false :true}
          onClick={handleOpen}
          className={"pl-16 m-16"}
        >
          Save
        </Button>
      }
      <Button
        variant="contained"
        aria-label="add"
        onClick={props.onClose}
        className={"pl-16 m-16"}
      >
       CLOSE
      </Button>
    </React.Fragment>
  );
}

export default Ssalabour;
