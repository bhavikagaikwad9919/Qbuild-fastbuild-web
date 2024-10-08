import React, { useEffect, useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Button, TextField, InputLabel } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import {
  listInventories,
  addIndentData,
  updateIndentData,
  updateIndent,
  deleteMaterialTransaction,
  saveReport,
  openEditDialog,
  closeNewDialog,
  getDetailReport,
  routes,
  getVendors,
  closeEditDialog,
  fecthPurchaseOrderBySupplierId,
  detailIndent,
} from "app/main/projects/store/projectsSlice";
import moment from "moment";
import CancelIcon from "@material-ui/icons/Cancel";
import IconButton from '@material-ui/core/IconButton';
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { Link } from "react-router-dom";
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import { format } from 'date-fns';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 3,
    color: '#fff',
  },
}));




const initialState = {
  id: "",
  selectedtype: "",
  inventory_name: "",
  indent_No: "",
  unit: "",
  quantity: "",
  purpose: "",
  date: null,
};



const initialValue = {
  id: "",
  name: "",
  quantity: "",
  unit: "",
  brand: [],
  supplier: "",
  supplierId: "",
  orderNo: "",
  purchaseOrderId: "",
  challan_no: "",
  transactionType: "out",
  description: "",
  grade: "",
  rate: 0,
  amount: 0,
};

function IndentDialog(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const projectId = useSelector(({ projects }) => projects.details._id);
  const loading = useSelector(({ projects }) => projects.loading);
  const IndentDetails = useSelector(({ projects }) => projects.indent.detailIndent);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('new');
  const [form, setForm] = useState(initialState);
  const projectDialog = useSelector(({ projects }) => projects.projectDialog);
  const [value, setValue] = React.useState(initialValue);
  const [rate, setRate] = useState(0);
  const inventory = useSelector(({ projects }) => projects.inventories);
  const [access, setAccess] = useState();
  const user = useSelector(({ auth }) => auth.user);
  const modules = useSelector(({ projects }) => projects.details.module);
  const po = useSelector(
    ({ projects }) => projects.purchaseOrders.purchaseOrderList
  );
  const team = useSelector(({ projects }) => projects.details.team);
  const [showManualEntry, setShowManualEntry] = useState(false);

  console.log("IndentDetails", IndentDetails)

  const initprojectDialog = useCallback(() => {
    setOpen(true);
    if (projectDialog.Dialogtype === 'edit') {
      setType('edit');
    }

    if (projectDialog.Dialogtype === "edit" && projectDialog.data) {
      if (IndentDetails !== '') {
        setForm({
          selectedtype: IndentDetails.select_intent_type,
          indent_No: IndentDetails.unique_autogenerated_intent_no,
          inventory_id: IndentDetails.inventory_id || null,
          inventory_name: IndentDetails.inventory_name,
          unit: IndentDetails.unit,
          quantity: IndentDetails.quantity,
          purpose: IndentDetails.purpose,
          status: IndentDetails.status,
          date: format(new Date(IndentDetails.required_date), 'yyyy-MM-dd'),
        });
        if (IndentDetails.inventory_id === null || IndentDetails.inventory_id === undefined) {
          setShowManualEntry(true);

        }
        if (showManualEntry) {
          setValue({
            name: IndentDetails.inventory_name,
            unit: IndentDetails.unit,
          });
        } else {
          setValue({
            id: IndentDetails.inventory_id || '',
            name: IndentDetails.inventory_name || '',
            unit: IndentDetails.unit || '',
          });
        }
      }
    }
    if (projectDialog.Dialogtype === "new") {
      setType('new');
      setForm(initialState);
      setValue(initialValue);

    }
  }, [projectDialog.data, projectDialog.Dialogtype, setForm]);


  useEffect(() => {
    if (projectDialog.props.open) {
      initprojectDialog();
    }
  }, [projectDialog.props.open, initprojectDialog]);



  useEffect(() => {
    console.log("Form state:", form);
  }, [form]);

  useEffect(() => {
    team.forEach((t) => {
      if ((t._id === user.data.id && t.role === "owner") || user.role === 'admin') {
        setAccess(true)
      } else if (t._id === user.data.id && t.role !== "owner") {

        const member = t.tab_access.filter((i) => i === "Inventory");
        console.log(member);
        if (member[0] === "Inventory") {
          setAccess(true);
        }
      }
    })
  }, [access, user.data.id, user.role, team]);


  function closeComposeDialog() {
    setForm(initialState);
    setShowManualEntry(false);
    projectDialog.Dialogtype === "edit"
      ? dispatch(closeEditDialog())
      : dispatch(closeNewDialog());
  }


  const changeTypeOptionBaseOnValue = (value) => {
    setForm({ ...form, "selectedtype": value });
  }


  const indentOption = ['Material'];

  // const handleChange = (prop) => (event) => {
  //   let value = event.target.value;
  //   if (prop === "quantity") {
  //     value = parseInt(value, 10);
  //     if (isNaN(value)) {
  //       value = "";
  //     }
  //   } else if (prop === "indent_No") {
  //     value = value.trim() === "" ? "" : value;
  //   }
  //   setForm((prevForm) => ({ ...prevForm, [prop]: value }));
  // };


  const handleChange = (prop) => (event) => {
    let value = event.target.value;
    if (prop === "quantity") {
      value = parseInt(value, 10);
      if (isNaN(value)) {
        value = "";
      }
    } else if (prop === "indent_No") {
      value = value.trim() === "" ? "" : value;
    } else if (prop === "inventory_name") {
      setForm((prevForm) => ({ ...prevForm, [prop]: value }));
      return;
    } else if (prop === "unit") {
      setForm((prevForm) => ({ ...prevForm, [prop]: value }));
      return;
    }
    setForm((prevForm) => ({ ...prevForm, [prop]: value }));
  };




  const handleSubmit = () => {
    console.log("from", form)
    let data = {
      site_code: "ABC",
      select_intent_type: form.selectedtype,
      unique_autogenerated_intent_no: form.indent_No,
      inventory_id: showManualEntry ? null : value.id,
      inventory_name: showManualEntry ? form.inventory_name : value.name,
      unit: showManualEntry ? form.unit : value.unit,
      quantity: form.quantity,
      purpose: form.purpose,
      required_date: form.date,
      project: projectId,
      purchase_order: null,
      status: "New",
    };

   
    dispatch(addIndentData({ projectId, data })).then((response) => {
      setForm(initialState);
      setValue(initialValue);
      closeComposeDialog();
    })
  }
  console.log("value777777", value)
  console.log("setform", form)



  const handleUpdatee = () => {
    let updatedData = {
      site_code: "ABC",
      select_intent_type: form.selectedtype,
      unique_autogenerated_intent_no: form.indent_No,
      inventory_id: showManualEntry ? null : value.id,
      inventory_name: showManualEntry ? form.inventory_name : value.name,
      unit: showManualEntry ? form.unit : value.unit,
      quantity: form.quantity,
      purpose: form.purpose,
      required_date: form.date,
    };

    console.log("Updating indent with data:", value);

    var indentId = IndentDetails._id;
    console.log("indentId", indentId)

    dispatch(updateIndentData({ projectId, indentId: IndentDetails._id, data: updatedData }))
      .then((response) => {
        console.log("Update response:", response);
        setForm(initialState);
        setValue(initialValue);
        closeComposeDialog();
      })
  };


  const handleApprove = () => {
    let updatedData = {
      ...form,
      status: "Pending",
    };

    dispatch(updateIndentData({ projectId, indentId: IndentDetails._id, data: updatedData }))
      .then((response) => {
        setForm(initialState);
        setValue(initialValue);
        closeComposeDialog();
      })

  };



  const isFormIncomplete = () => {
    const { selectedtype, indent_No, inventory_name, unit, quantity, purpose, date } = form;
    if(showManualEntry === true){
      return (
        selectedtype.length > 0 &&
        inventory_name.length > 0 && unit.length > 0 &&
        quantity > 0 &&
        purpose.length > 0 &&
        date !== null 
      );
    }
    else{
      return (
        selectedtype.length > 0 &&
        value.name.length > 0 && value.unit.length > 0 &&
        quantity > 0 &&
        purpose.length > 0 &&
        date !== null 
      );
    }
};



  const handleDateChange = (prop) => (date) => {
    setForm({ ...form, [prop]: date });
  };
  


  function callInv(inv) {
    if (inv.name !== "RMC" && inv.name !== "Rmc" && inv.name !== "rmc") {
      setRate(0);
      if (finalPo.length > 0) {
        let x = 0;
        finalPo.forEach((fp) => {
          let data = fp.orderData;
          data.forEach((dt) => {
            if (dt.inventory === inv.name && x === 0) {
              x++;
              setRate(dt.rate);
            }
          });
        });
      }
    }
  }


  let invName = [];
  inventory.forEach((item) => {
    invName.push({
      id: item._id,
      name: item.type,
      quantity: item.quantity,
      unit: item.unit,
      brand: item.brand ? item.brand : "",
      supplier: item.supplier ? item.supplier : "",
      grade: item.grade ? item.grade : "",
      transactions: item.transactions ? item.transactions : "",
    });
  });


  let poData = [],
    finalPo = [];
  if (po.length > 0) {
    po.forEach((item) => {
      poData.push({
        orderDate: moment(new Date(item.odDate)).format("YYYY/MM/DD"),
        orderData: item.orderData,
      });
    });

    finalPo = poData.sort(function (a, b) {
      return new Date(a.orderDate) - new Date(b.orderDate);
    });
  }

  return (
    <div className='flex flex-1 w-full'>
      <Dialog open={open}  {...projectDialog.props} fullWidth maxWidth='sm'>
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color='inherit' />
        </Backdrop>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant='subtitle1' className="flex w-full items-center justify-start gap-10" color='inherit'>
              {type === 'new' ? 'Add Indent' : 'Edit Indent'}
            </Typography>
            <IconButton onClick={() => closeComposeDialog()}>
              <CancelIcon style={{ color: "red" }} />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <div className='flex flex-1 flex-col gap-12 w-full mt-10'>
            <Autocomplete
              id="type"
              freeSolo
              className="mb-12"
              options={indentOption}
              value={form.selectedtype}
              onInputChange={(event, value) => {
                changeTypeOptionBaseOnValue(value);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Type"
                  onChange={handleChange("selectedtype")}
                  variant="outlined"
                />
              )}
            />

            {/* <TextField
              className="mt-8"
              variant="outlined"
              id="unique-autogenerated-intent-no"
              label="Unique Autogenerated Intent No"
              value={form.indent_No}
              onChange={handleChange("indent_No")}
              InputLabelProps={{
                shrink: true,
              }}
            /> */}

            {/* <Autocomplete
              value={value}
              disabled={type === "Edit" ? true : false}
              onChange={(event, newValue) => {
                if (typeof newValue === "string") {
                  setValue({
                    name: newValue,
                  });
                } else if (newValue && newValue.inputValue) {
                  setValue({
                    name: newValue.inputValue,
                  });
                } else if (newValue === null) {
                  setValue(initialValue);
                } else {
                  setValue(newValue);
                }

                if (newValue === null) {
                  callInv(initialValue);
                } else {
                  callInv(newValue);
                }
              }}
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              id="free-solo-with-text-demo"
              options={invName}
              getOptionLabel={(option) => {
                if (typeof option === "string") {
                  return option;
                }
                if (option.inputValue) {
                  return option.inputValue;
                }

                return option.name + " " + option.unit;
              }}
              renderOption={(option) =>
                option.name +  " " + option.unit
              }
              style={{ width: 300 }}
              freeSolo
              renderInput={(params) => (
                <TextField {...params} label="Inventory" variant="outlined" />
              )}
            />  */}




            {!showManualEntry && (
              <Autocomplete
                value={value}
                disabled={type === "edit" && !showManualEntry}
                onChange={(event, newValue) => {
                  if (typeof newValue === "string") {
                    setValue({
                      name: newValue,
                    });
                  } else if (newValue && newValue.inputValue) {
                    setValue({
                      name: newValue.inputValue,
                    });
                  } else if (newValue === null) {
                    setValue(initialValue);
                  } else {
                    setValue(newValue);
                  }

                  if (newValue === null) {
                    callInv(initialValue);
                  } else {
                    callInv(newValue);
                  }
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                id="free-solo-with-text-demo"
                options={invName}
                getOptionLabel={(option) => {
                  if (typeof option === "string") {
                    return option;
                  }
                  if (option.inputValue) {
                    return option.inputValue;
                  }

                  return option.name + " " + option.unit;
                }}
                renderOption={(option) =>
                  option.name + " " + option.unit
                }
                style={{ width: 300 }}
                freeSolo
                renderInput={(params) => (
                  <TextField {...params}
                    label="Inventory"
                    variant="outlined"
                    disabled={!showManualEntry}
                  />
                )}
              />
            )}
            {showManualEntry && (
              <>
                <TextField
                  label="Inventory"
                  variant="outlined"
                  style={{ margin: '10px 0' }}
                  value={showManualEntry ? form.inventory_name : value.name}
                  onChange={handleChange("inventory_name")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled={!showManualEntry}
                />
                <TextField
                  label="Unit"
                  variant="outlined"
                  style={{ margin: '10px 0' }}
                  value={showManualEntry ? form.unit : value.unit}
                  onChange={handleChange("unit")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled={!showManualEntry}
                />
              </>
            )}
            {!showManualEntry && (
              <Link
                className="cursor-pointer ml-10 mt-10 mb-10"
                disabled={!showManualEntry}
                onClick={() => {
                  setShowManualEntry(true);
                }}
              >
                Click here to Add New Inventory and Unit
              </Link>
            )}


            <TextField
              className="mt-8"
              variant="outlined"
              id="filled-number"
              label="Quantity"
              value={form.quantity}
              onChange={handleChange("quantity")}
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
            />


            <TextField
              className="mt-8"
              variant="outlined"
              label="Purpose"
              value={form.purpose}
              onChange={handleChange("purpose")}
              InputLabelProps={{
                shrink: true,
              }}
            />

            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker
                className="mt-8"
                required
                label="Date"
                format="dd/MM/yyyy"
                value={form.date}
                onChange={handleDateChange("date")}
                inputVariant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                minDate={new Date()}
              />
            </MuiPickersUtilsProvider>

            <div className='flex flex-row gap-10 mb-20 mt-10'>
              {type === 'new' ? (
                <Button
                  variant='contained'
                  color='primary'
                  disabled={!isFormIncomplete()}
                  onClick={() =>
                    handleSubmit()
                  }
                >
                  ADD
                </Button>
              ) : (
                <Button
                  variant='contained'
                  color='primary'
                  disabled={!isFormIncomplete()}
                  onClick={() =>
                    handleUpdatee()
                  }
                >
                  Update
                </Button>
              )}
              {type === 'edit' && form.status === "New" ? (
                <Button
                  variant='contained'
                  color='primary'
                  disabled={!isFormIncomplete()}
                  onClick={() => handleApprove()}
                >
                  Approve
                </Button>
              ) : null}

              <Button variant='contained' onClick={() => { closeComposeDialog() }}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div >
  );
}

export default IndentDialog;
