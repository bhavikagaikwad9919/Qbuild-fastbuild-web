import React, { useEffect,useCallback,  useState } from "react";
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import {
  addInventory,
  updateDetailInventory,
  closeNewDialog,
  routes,
} from "app/main/projects/store/projectsSlice";
import ListItemText from '@material-ui/core/ListItemText';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";
import ChipInput from "material-ui-chip-input";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import CancelIcon from "@material-ui/icons/Cancel";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from '@material-ui/core/styles';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 3,
    color: '#fff',
  },
}));

const InventoryUpdateDialog = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const projectId = useSelector(({ projects }) => projects.details._id);
  const data = useSelector(({ projects }) => projects.projectDialog.data);
  const inventory = useSelector(({ projects }) => projects.inventories);
  const modules = useSelector(({ projects }) => projects.details.module);
  const [open, setOpen] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [brands, setBrands] = useState([]);
  const [values, setValues] = React.useState({
    type: "",
    unit: "",
    brand: "",
    supplier: [],
    threshold: 0,
  });
  const vendors = useSelector(({ projects }) => projects.vendors);
  const projectDialog = useSelector(({ projects }) => projects.projectDialog);
  const user = useSelector(({ auth }) => auth.user);
  const team = useSelector(({ projects }) => projects.details.team);
  const [access, setAccess] = useState();
  const [supplierName, setsupplierName] = React.useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  var stop = 0; var estop = 0;
  let vendorsName = [];

  // if (!vendors) {
  //   return <FuseLoading />;
  // }

  vendors.vendorsList.forEach((item) => {
    if(item.agencyType === 'Supplier'){
      vendorsName.push({
        supplierId: item._id,
        name: item.name,
      });
    }
  });

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

  useEffect(() => {
    if (props.open) {
      setOpen(true);
    }
    if (data !== null) {
      setValues({
        type: data.type,
        unit: data.unit,
        brand: data.brand,
        supplier: data.supplier,
      });
      setSuppliers(...suppliers, data.supplier);
     // setsupplierName(...supplierName, data.supplier)
      setBrands(...brands, data.brand);
    }
  }, [props.open, data]);

  function handleAddSupplier(value) {
    setSuppliers((suppliers) => [...suppliers, value]);  
  }

  function handleDeleteSupplier(supplier, index) {
    setSuppliers(suppliers.filter((item) => item !== supplier));
  }  

  function handleAddBrand(value) {
    setBrands((brands) => [...brands, value]);   
  }

  function handleDeleteBrand(Brand, index) {
    setBrands(brands.filter((item) => item !== Brand));
  }  

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleChangeSupplier = (event) => {
    const {
      target: { value },
    } = event;
    setSuppliers(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleIdChange = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((_id) => _id !== id));
      setSuppliers(suppliers.filter((sup)=> sup.id !== id));
    } else { 
      let supplier = vendorsName.filter((ven)=> ven.supplierId === id);
      setSelectedIds([...selectedIds, id]);
      setSuppliers([...suppliers, supplier[0]])
    } 
  };

  // const handleClose = () => {
  //   setOpen(false);
  //   props.close();
  // };

  const initprojectDialog = useCallback(() => {
  
     if (projectDialog.props.open) {
      setOpen(true);
    }
    if (data !== null) {
      setValues({
        type: data.type,
        unit: data.unit,
        brand: data.brand,
        supplier: data.supplier,
      });
      setSuppliers(...suppliers, data.supplier);
      setBrands(...brands, data.brand);
    }

  }, [projectDialog.data, projectDialog.Dialogtype]);

  useEffect(() => {
    if (projectDialog.props.open) {
      initprojectDialog();
    }
  }, [projectDialog.props.open, initprojectDialog]);
  function closeComposeDialog() {
      setValues({
        type: "",
        unit: "",
        brand: "",
        supplier: [],
        threshold: 0,
      });
      setBrands([]);
      setSuppliers([]);
      dispatch(closeNewDialog());
  }

  const disableButton = () => {
    return values.type.length > 0 && values.unit.length > 0 && suppliers.length >0;
  };

  // const brands = inventory.map(i => i.brand)
  // const brandsOption = brands.filter((b, idx) => brands.indexOf(b) === idx)

  // const supplier = inventory.map(i => i.supplier)
  // const supplierOption = supplier.filter((s, idx) => supplier.indexOf(s) === idx)

  const changebrandOptionBaseOnValue = (value) => {
    setValues({ ...values, brand: value });
  }

  const changesupplierOptionBaseOnValue = (value) => {
    setValues({ ...values, supplier: value });
  }

  function handleSubmit() {
    if (data === null) {
      if(inventory.length===0)
      {
        dispatch(
          addInventory({
            projectId: projectId,
            type: values.type,
            unit: values.unit,
            brand: brands,
            supplier: suppliers,
            threshold: parseInt(values.threshold),
          })
        );
        closeComposeDialog();
      }else if(inventory.length>0){
        inventory.map((inv, index) => {
          if (inv.type.toLowerCase() === values.type.toLowerCase()) {
            stop = 1;
            dispatchWarningMessage(dispatch, "Inventory already exits.");
          } else if (inventory.length === index + 1 && stop === 0) {
            stop = 1;
            dispatch(
              addInventory({
                projectId: projectId,
                type: values.type,
                unit: values.unit,
                brand:  brands,
                supplier: suppliers,
                threshold: parseInt(values.threshold),
              })
            );
            closeComposeDialog();
          }
        })
      }
      
    } else {
      if(inventory.length === 1)
      {
        dispatch(
          updateDetailInventory({
            projectId,
            inventoryId: data._id,
            form:{
              type:values.type,
              unit:values.unit,
              brand:brands,
              supplier:suppliers,
              threshold:values.threshold,
            },
          })
        );
        closeComposeDialog();
      }else{
        const invent = inventory.filter(i => i.type !==data.type)
        invent.map((inv, index) => {
            if (inv.type.toLowerCase() === values.type.toLowerCase()) {
                  estop = 1;
                  dispatchWarningMessage(dispatch, "Inventory already exits.");
              }else if (invent.length === index + 1 && estop === 0) {
                 estop = 1;
              dispatch(
                updateDetailInventory({
                  projectId,
                  inventoryId: data._id,
                  form:{
                    type:values.type,
                    unit:values.unit,
                    brand:brands,
                    supplier:suppliers,
                    threshold:values.threshold,
                  },
                })
              );
              closeComposeDialog();
            }
          })
        }
      }
    
  }

  function redirectToAgency(){
    if(modules.length === 0 || modules.includes("Agency")){
      if(access === true){
        closeComposeDialog();
        sessionStorage.setItem("link", 'link');
        dispatch(routes("Vendors"));
      }else{
        dispatchWarningMessage(dispatch, "You don't have access to add a Supplier from Agency.")
      }
    }else{
      dispatchWarningMessage(dispatch, "Please include Agency module from Settings to Add Suppliers.")
    }
  }

  return (
    <>
      <Dialog
        open={projectDialog.props.open}
        onClose={closeComposeDialog}
        aria-labelledby="form-dialog-title"
      >
         <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant='subtitle1' className="flex w-full items-center justify-start gap-10" color='inherit'>
              {projectDialog.Dialogtype === "new" ? "New Inventory Item" : "Edit Inventory"}
            </Typography>
            <IconButton onClick={() => closeComposeDialog()}>
              <CancelIcon style={{ color: "red" }} />
            </IconButton>
          </Toolbar>
        </AppBar>
        {/* <DialogTitle id="form-dialog-title">
          {projectDialog.Dialogtype === "new" ? "New Inventory Item" : "Edit Inventory"}
        </DialogTitle> */}
        <DialogContent>
          <div className="flex flex-col mx-12 gap-10  ">
            <TextField
              required
              onChange={handleChange("type")}
              value={values.type}
              autoFocus
              id="iType"
              label="Name"
              className="mt-10"
              variant="outlined"
            />
            <TextField
              required
              onChange={handleChange("unit")}
              value={values.unit}
              id="unit"
              label="Unit"
              variant="outlined"
            />
            {/* <TextField
              onChange={handleChange("brand")}
              value={values.brand}
              id="brand"
              label="Brand"
              variant="outlined"
            /> */
            /* <TextField
              onChange={handleChange("supplier")}
              value={values.supplier}
              id="supplier"
              label="Supplier"
              variant="outlined"
            /> */}

            <ChipInput
            id="Brand"
            label="Brand"
            value={brands}
            onAdd={(brand) => handleAddBrand(brand)}
            onDelete={(brand, index) => handleDeleteBrand(brand, index)}
            // newChipKeyCodes={[13, 32, 188]}
            variant="outlined"
           />

            {/* // <Autocomplete
            //   id="brand"
            //   freeSolo
            //   options={brandsOption}
            //   value={values.brand}
            //   onInputChange={(event, value) => {
            //     changebrandOptionBaseOnValue(value);
            //   }}
            //   renderInput={(params) => (
            //     <TextField
            //       {...params}
            //       label="Brand"
            //       onChange={handleChange("brand")}
            //       variant="outlined" />
            //   )}
            // /> */}
            {/* /* <Autocomplete
              id="supplier"
              freeSolo
              options={supplierOption}
              value={values.supplier}
              onInputChange={(event, value) => {
                changesupplierOptionBaseOnValue(value);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Supplier"
                  onChange={handleChange("supplier")}
                  variant="outlined" />
              )}
            /> */}

            {/* <ChipInput
              id="Suppliers"
              label="Suppliers"
              required
              value={suppliers}
              onAdd={(supplier) => handleAddSupplier(supplier)}
              onDelete={(supplier, index) => handleDeleteSupplier(supplier, index)}
              variant="outlined"
            /> */}
            <FormControl sx={{ m: 1, width: 300 }} variant="outlined">
              <InputLabel id="demo-simple-select-outlined-label">
                Select Suppliers
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={suppliers}
                onChange={handleChangeSupplier}
                multiple
                renderValue={(selected) => selected.join(', ')}
                MenuProps={MenuProps}
                label="Supplier"
              >
                {vendorsName.map((vname) => (
                  <MenuItem key={vname.supplierId} value={vname.name}>
                    <Checkbox checked={suppliers.indexOf(vname.name) > -1} />
                    <ListItemText primary={vname.name} />
                  </MenuItem>
                ))}
                <Link
                  className="cursor-pointer ml-20"
                  onClick={() => redirectToAgency()}
                >
                  Click here to Add New Suppliers
                </Link>
              </Select>
            </FormControl>
            <TextField
              type="number"
              onChange={handleChange("threshold")}
              value={values.threshold}
              id="threshold"
              label="Threshold"
              variant="outlined"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              closeComposeDialog();
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            disabled={!disableButton()}
            onClick={() => {
              handleSubmit();
            }}
            color="primary"
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InventoryUpdateDialog;
