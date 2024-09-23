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
  updateEquipment,
  updateEquipmentData,
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

function Ssaequipment(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getVendors(projectId));
  }, [dispatch]);
  const projectId = useSelector(({ projects }) => projects.details._id);
  const loading = useSelector(({ projects }) => projects.loading);
  const equipment = useSelector(({ projects }) => projects.equipment);
  const vendors = useSelector(({ projects }) => projects.vendors);
  const [newEquipment, setNewEquipment] = useState(equipment);
  const [createAccess, setCreateAccess] = useState();
  const team = useSelector(({ projects }) => projects.details.team);
  const role = useSelector(({ auth }) => auth.user);
  //const equipmentType = useSelector(({ organizations }) => organizations.dataStructure.equipmentType);
  const equipmentType = useSelector(({ sites }) => sites.dataStructure.equipmentType);
  const [hide, setHide] = useState(false);
  let tempEq = [], vendorsName = [];

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
    dispatch(updateEquipment(newEquipment));
  }, [newEquipment]);

  if(props.data.Dialogtype === 'edit')
  {
    if(equipment.length > 0){
      if(equipmentType.length >= equipment.length){
        equipmentType.forEach((lbs, index)=>{
            let x = 0;
            equipment.forEach((lb, id)=>{
              if(lb.machinery_type === lbs){
                x++;
                tempEq.push({
                  machinery_type: lb.machinery_type,
                  agency: lb.agency,
                  Count: lb.Count,
                })
              }else if(x === 0 && id === equipment.length -1){
                tempEq.push({
                  machinery_type: lbs,
                  agency: vendorsName.length > 0 ? vendorsName[0].name : '',
                  Count: 0,
                })

                if(index === equipmentType.length -1){
                  let filEq1 = tempEq.filter((eq)=> eq.machinery_type === lb.machinery_type);
                  if(filEq1.length === 0){
                    tempEq.push({
                      machinery_type: lb.machinery_type,
                      agency: vendorsName.length > 0 ? vendorsName[0].name : '',
                      Count: lb.Count,
                    })
                  }
                }
              }
            })
          })
      }else if(equipment.length > equipmentType.length){
        equipment.forEach((lb, index)=>{
            let x = 0;
            equipmentType.forEach((lbs, id)=>{
              if(lb.machinery_type === lbs){
                x++;
                tempEq.push({
                  machinery_type: lb.machinery_type,
                  agency: lb.agency,
                  Count: lb.Count,
                })
              }else if(x === 0 && id === equipmentType.length -1){
                tempEq.push({
                  machinery_type: lb.machinery_type,
                  agency: vendorsName.length > 0 ? vendorsName[0].name : '',
                  Count: lb.Count,
                })

                if(index === equipment.length -1){
                  let filEq2 = tempEq.filter((eq)=> eq.machinery_type === lbs);
                  if(filEq2.length === 0){
                    tempEq.push({
                      machinery_type: lbs,
                      agency: vendorsName.length > 0 ? vendorsName[0].name : '',
                      Count: 0,
                    })
                  }
                }
              }
            })  
          })
      }
    }else{
      equipmentType.forEach((lb)=>{
        tempEq.push({
        machinery_type: lb,
        agency: vendorsName.length > 0 ? vendorsName[0].name : '',
        Count: 0,
        })
      })
    }
  }else{ 
    if(equipment.length > 0){
      equipmentType.forEach((lb)=>{
        let filterLb = equipment.filter((lab)=> lab.machinery_type === lb);
        if(filterLb.length > 0){
          tempEq.push({
            machinery_type: lb,
            agency: filterLb[0].agency,
            Count: filterLb[0].Count,
          })
        }else{
          tempEq.push({
            machinery_type: lb,
            agency: vendorsName.length > 0 ? vendorsName[0].name : '',
            Count: 0,
          })
        }  
      })
    }else{
      equipmentType.forEach((lb)=>{
        tempEq.push({
          machinery_type: lb,
          agency: vendorsName.length > 0 ? vendorsName[0].name : '',
          Count: 0,
        })
      })
    }
  }

  const handleChange = (prop) => (event) => {
    tempEq.map((lb)=>{
      if(lb.machinery_type === prop){
        lb.Count = Number(event.target.value);
        lb.agency = vendorsName.length > 0 ? vendorsName[0].name : '';
      }
    })
    setNewEquipment(tempEq);
  };
 
  if (!vendors) {
    return <FuseLoading />;
  }

  const handleOpen =() =>{
    if(props.data.Dialogtype === 'edit')
    {
      dispatch(updateEquipmentData({ projectId, "type":"update", reportId:props.data.data._id,Data:tempEq})).then(
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
      bodyFormData.set("labour", JSON.stringify([]));
      bodyFormData.set("hindrance", JSON.stringify([]));
      bodyFormData.set("staff", JSON.stringify([]));
      bodyFormData.set("sitevisitor", JSON.stringify([]));
      bodyFormData.set("notes", JSON.stringify([]));
      bodyFormData.set("equipment", JSON.stringify(tempEq));
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

  props.onCountChange({ equipment: tempEq.length });

  return (
    <React.Fragment>
     <FormControl variant="outlined">  
        <List className="grid grid-cols-2">
          {tempEq.map((lb)=>
            <>
             <ListItem>
                <ListItemText className="w-1/2 font-bold" variant="h6">{lb.machinery_type}</ListItemText>
                <TextField
                  variant="outlined"
                  type="number"
                  className="w-1/3 items-center justify-center"
                  value={lb.Count}
                  onChange={handleChange(lb.machinery_type)}
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
          disabled={createAccess === true && tempEq.length > 0 ? false :true}
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
 
export default Ssaequipment;