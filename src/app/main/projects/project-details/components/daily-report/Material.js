import React, { useState, useEffect } from "react";
import { ListItemSecondaryAction, Typography } from "@material-ui/core";
import FuseUtils from "@fuse/utils";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { updateMaterial } from "app/main/projects/store/projectsSlice";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Icon,
  Grid,
  Fab,
} from "@material-ui/core";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";
import {
  listInventories,
  addMaterialData,
  updateMaterialData,
  deleteMaterialTransaction,
  saveReport,
  openEditDialog,
  closeNewDialog,
  getDetailReport,
  routes,
  getVendors,
  closeEditDialog,
  fecthPurchaseOrderBySupplierId,
} from "app/main/projects/store/projectsSlice";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import moment from "moment";
import { Link } from "react-router-dom";

const filter = createFilterOptions();

const useStyles = makeStyles((theme) => ({
  addButton: {
    position: "absolute",
    right: 12,
    bottom: 12,
    zIndex: 99,
    overflow: "auto",
  },
  delete: {
    color: "red",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

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

const initialValues = {
  id: "",
  name: "",
  quantity: "",
  unit: "",
  brand: "",
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

function Material(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const projectDialog = useSelector(({ projects }) => projects.projectDialog);
  const po = useSelector(
    ({ projects }) => projects.purchaseOrders.purchaseOrderList
  );
  const vendors = useSelector(({ projects }) => projects.vendors);
  const material = useSelector(({ projects }) => projects.material);
  const inventory = useSelector(({ projects }) => projects.inventories);
  const [deleteAccess, setDeleteAccess] = useState();
  const [createAccess, setCreateAccess] = useState();
  const team = useSelector(({ projects }) => projects.details.team);
  const role = useSelector(({ auth }) => auth.user);
  // const material = [...materialState];
  // const inventory = [...inventoryState];
  const [newMaterial, setNewMaterial] = useState(material);
  const [open, setOpen] = useState(false);
  const [delete1, setDelete1] = useState(false);
  const [error, setError] = useState(false);
  const [type, setType] = useState("Edit");
  const [values, setValues] = useState(initialValues);
  const [list, setList] = useState({
    id: "",
    name: "",
    quantity: "",
    unit: "",
    challan_no: "",
    transactionType: "",
    grade: "",
    supplier: "",
    supplierId: "",
    orderNo: "",
    purchaseOrderId: "",
    brand: "",
    rate: 0,
    amount: 0,
  });
  const [value, setValue] = React.useState(initialValue);
  const projectId = useSelector(({ projects }) => projects.details._id);
  const [materialId, setMaterialId] = useState("");
  const loading = useSelector(({ projects }) => projects.loading);
  const [rate, setRate] = useState(0);
  const [hide, setHide] = useState(false);
  const [access, setAccess] = useState();
  const user = useSelector(({ auth }) => auth.user);
  const modules = useSelector(({ projects }) => projects.details.module);
  const supplierPo = useSelector(({ projects }) => projects.supplierPo);
  const gradeType = useSelector(({ dataStructure }) => dataStructure.gradeType);
  const [podetail, setPodetail] = useState({});

  useEffect(() => {
    dispatch(getVendors(projectId));
  }, [dispatch]);

  useEffect(() => {
    team.map((t) => {
      if (
        (t._id === user.data.id && t.role === "owner") ||
        user.role === "admin" ||
        t.role === "purchaseOfficer"
      ) {
        setDeleteAccess(true);
        setCreateAccess(true);
        setAccess(true);
      } else if (t._id === user.data.id && t.role !== "owner") {
        setDeleteAccess(
          t.tab_access.includes("Daily Data") ||
            t.tab_access.includes("Remove Daily Data Entries")
        );
        setCreateAccess(
          t.tab_access.includes("Daily Data") ||
            t.tab_access.includes("Create/Update Daily Data")
        );
        const member = t.tab_access.filter((i) => i === "Inventory");
        console.log(member);
        if (member[0] === "Inventory") {
          setAccess(true);
        }
      }

      if (t._id === role.data.id && t.role === "CIDCO Official") {
        setHide(true);
      }
    });
  }, []);

  useEffect(() => {
    dispatch(updateMaterial(newMaterial));
  }, [newMaterial]);

  let vendorsName = [];

  vendors.vendorsList.forEach((item) => {
    if (item.agencyType === "Supplier") {
      vendorsName.push({
        id: item._id,
        name: item.name,
      });
    }
  });

  useEffect(() => {
    dispatch(listInventories(projectId));
  }, []);
  // useEffect(() => {
  //   if (
  //     values.name.length > 0 &&
  //     values.quantity.length > 0 &&
  //     values.transactionType === "out"
  //   ) {
  //     setError(true);
  //     let inv = invName.find((item) => item.id === values.id);
  //     if (inv) {
  //       let quantity = inv.quantity;
  //       if (quantity >= Number(values.quantity)) {
  //         setError(false);
  //       }
  //     }
  //   }
  // }, [values]);

  const handleOpen = () => {
    setType("New");
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setValues({
      name: "",
      quantity: 0,
      supplier: "",
      unit: "",
      brand: "",
      supplier: "",
      challan_no: "",
      transactionType: "out",
      description: "",
      grade: "",
      rate: 0,
      amount: 0,
      orderNo: "",
      supplierId: "",
      purchaseOrderId: "",
    });
    setValue(initialValue);
  };
  // console.log("RATEvalue",rate)
  const handleChange = (prop) => (event) => {
    if (prop === "quantity") {
      let re = /[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)/;
      if (re.test(event.target.value) || event.target.value === "") {
        setValues({ ...values, [prop]: event.target.value });
      }
    } else if (prop === "grade") {
      // setRate(0);
      // if(finalPo.length > 0){
      //   let x = 0;
      //   finalPo.forEach((fp)=>{
      //     let data = fp.orderData;
      //     data.forEach((dt)=>{
      //       if(dt.inventory === value.name && dt.grade === event.target.value && x === 0){
      //         x++;
      //         setRate(dt.rate);
      //       }
      //     })
      //   })
      // }

      if (podetail) {
        if (podetail.orderData) {
          podetail.orderData.forEach((data) => {
            if (data.inventory === "RMC") {
              if (
                data.inventoryId === value.id &&
                data.grade === event.target.value
              ) {
                setRate(data.rate);
              }
            } else {
              if (data.inventoryId === value.id) {
                setRate(data.rate);
              }
            }
          });
        }
      }

      setValues({ ...values, [prop]: event.target.value });
    } else if (prop === "supplier") {
      let venId = "";
      vendorsName.forEach((vendor) => {
        if (vendor.name === event.target.value) {
          venId = vendor.id;
        }
      });
      setValues({ ...values, [prop]: event.target.value, supplierId: venId });

      if (venId !== undefined && venId !== "" && venId.length > 0) {
        dispatch(
          fecthPurchaseOrderBySupplierId({
            supplierId: venId,
            inventoryId: value.id,
          })
        );
      }
    } else {
      setValues({ ...values, [prop]: event.target.value });
    }
  };

  const handleChangeName = (id, name) => {
    setValues({ ...values, id: id, name: name });
  };

  function buttonDisabled() {
    if (value !== null && values.transactionType !== undefined) {
      if (values.transactionType === "in" && values.challan_no !== undefined) {
        return (
          value.name.length > 0 &&
          values.quantity >= 0.01 &&
          values.supplier.length > 0 &&
          values.quantity.length < 9 &&
          values.challan_no.length > 0 &&
          values.challan_no.trim().length > 0 &&
          error === false &&
          values.orderNo.length > 0
        );
      } else {
        return (
          value.name.length > 0 &&
          values.quantity >= 0.01 &&
          values.supplier.length > 0 &&
          values.quantity.length < 9 &&
          error === false
        );
      }
    }
  }

  function handleSelectList(
    id,
    name,
    unit,
    quantity,
    description,
    challan_no,
    transactionType,
    grade,
    projectInventoryId,
    supplier,
    brand,
    rate,
    amount,
    orderNo,
    supplierId,
    purchaseOrderId
  ) {
    let venId = "";
    if (supplierId === undefined) {
      venId = getSupplierId(supplier);
    } else if (supplierId.length === 0) {
      venId = getSupplierId(supplier);
    } else {
      venId = supplierId;
    }

    invName.forEach((inv) => {
      if (inv.id === projectInventoryId) {
        setValue({
          id: inv.id,
          name: inv.name,
          quantity: inv.quantity,
          unit: inv.unit,
          brand: inv.brand ? inv.brand : "",
          supplier: inv.supplier ? inv.supplier : "",
          grade: inv.grade ? inv.grade : "",
          rate: inv.rate === undefined ? 0 : inv.rate,
          amount: inv.amount === undefined ? 0 : inv.amount,
          transactions: inv.transactions ? inv.transactions : "",
        });
      }
    });
    setOpen(true);
    setList({
      id,
      name,
      unit,
      quantity,
      transactionType,
      grade,
      supplier,
      brand,
    });
    setValues({
      id: projectInventoryId,
      name,
      quantity: quantity.toString(),
      description,
      challan_no: challan_no === null ? "" : challan_no,
      transactionType,
      grade,
      supplier,
      brand,
      rate: rate === undefined ? 0 : rate,
      amount: amount === undefined ? 0 : amount,
      orderNo: orderNo,
      purchaseOrderId,
      supplierId: venId,
    });

    if (venId !== undefined || venId !== "") {
      dispatch(
        fecthPurchaseOrderBySupplierId({
          supplierId: venId,
          inventoryId: projectInventoryId,
        })
      );
    }
  }

  function getSupplierId(supplier) {
    let supplierId = "";
    vendorsName.forEach((vendor) => {
      if (vendor.name === supplier) {
        supplierId = vendor.id;
      }
    });

    return supplierId;
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

  function setPoDetails(poData) {
    setValues({
      ...values,
      orderNo: poData.orderNo,
      purchaseOrderId: poData._id,
    });
    setPodetail(poData);

    poData.orderData.forEach((data) => {
      if (data.inventoryId === value.id) {
        setRate(data.rate);
      }
    });
  }
  console.log(rate);
  function listChange() {
    let mat = JSON.parse(JSON.stringify(material));

    if (value.name === "") {
      setOpen(false);
    } else {
      mat.forEach((item) => {
        if (item._id === list.id) {
          inventory.forEach((inv) => {
            // let newRate = values.rate === undefined || values.rate === 0 ? rate : values.rate;
            // let poData = po.find((pos)=>pos.id === values.purchaseOrderId)
            // if(poData !=null && poData != undefined ){
            //   poData.orderData.forEach((data)=>{
            //     if(data.inventory === "RMC"){
            //       // console.log("rmccheckdata",data,item,values.grade)

            //       if(data.inventoryId === item.projectInventoryId && data.grade === values.grade){
            //          newRate = data.rate === undefined || data.rate === 0 ? rate : data.rate;
            //       }
            //     }else{

            //        newRate = values.rate === undefined || values.rate === 0 ? rate : values.rate;
            //     }
            //   })
            // }

            let newRate = 0;
            let poData = po.find((pos) => pos.id === values.purchaseOrderId);
            if (poData != null && poData != undefined) {
              poData.orderData.forEach((data) => {
                if (data.inventory === "RMC") {
                  if (
                    data.inventoryId === item.projectInventoryId &&
                    data.grade === values.grade
                  ) {
                    newRate =
                      data.rate === undefined || data.rate === 0
                        ? rate
                        : data.rate;
                  }
                } else {
                  if (data.inventoryId == item.projectInventoryId) {
                    console.log(data.rate, "--data");
                    newRate =
                      data.rate === undefined || data.rate === 0
                        ? rate
                        : data.rate;
                    console.log(newRate, "-----on");
                  }
                }
              });
            } else {
              newRate =
                values.rate === undefined || values.rate === 0
                  ? rate
                  : values.rate;
            }

            item.name = value.name;
            item.description = values.description;
            item.transactionType = values.transactionType;
            item.challan_no =
              values.transactionType === "out" ? "" : values.challan_no;
            item.grade = values.grade;
            item.supplier = values.supplier;
            item.brand = values.brand;
            item.rate = values.transactionType === "out" ? 0 : newRate;
            item.supplierId = values.supplierId;
            item.purchaseOrderId =
              values.transactionType === "out" ? "" : values.purchaseOrderId;
            item.orderNo =
              values.transactionType === "out" ? "" : values.orderNo;

            if (inv._id === value.id) {
              if (
                values.quantity > list.quantity + inv.quantity &&
                values.transactionType === "out"
              ) {
                dispatchWarningMessage(
                  dispatch,
                  "Sorry!! Entered quantity is greater than available quantity."
                );
              } else if (
                inv.quantity === 0 &&
                values.transactionType === "out" &&
                list.quantity != values.quantity
              ) {
                dispatchWarningMessage(
                  dispatch,
                  "Sorry!! Entered quantity is not available. Please Add Quantity."
                );
              } else {
                item.unit = inv.unit;
                setNewMaterial(mat);

                let totalQuantity = 0;
                value.transactions.forEach((tran) => {
                  if (tran._id.toString() === item.transactionId.toString()) {
                    totalQuantity = Number(value.quantity);

                    if (tran.transactionType == "in") {
                      totalQuantity =
                        Number(totalQuantity) - Number(tran.quantity);
                    } else {
                      totalQuantity =
                        Number(totalQuantity) + Number(tran.quantity);
                    }

                    if (item.transactionType == "in") {
                      totalQuantity =
                        Number(totalQuantity) + Number(values.quantity);
                    } else {
                      totalQuantity =
                        Number(totalQuantity) - Number(values.quantity);
                    }
                  }
                });

                if (totalQuantity < 0) {
                  dispatchWarningMessage(
                    dispatch,
                    `Please check the prevoius transactions. The available quantity can't be in negative.`
                  );
                } else {
                  item.value = values.quantity;
                  item.amount = values.quantity * newRate;

                  if (props.data.Dialogtype === "edit") {
                    let transact = value.transactions,
                      newTrans = [];

                    transact.map((tan) => {
                      if (tan.status !== 2 && tan.transactionType === "in") {
                        newTrans.push({
                          _id: tan._id,
                          challan_no:
                            tan.challan_no === undefined ||
                            tan.challan_no === null
                              ? ""
                              : tan.challan_no,
                        });
                      }
                    });

                    let filterTran = newTrans.filter(
                      (tran) =>
                        tran.challan_no.toLowerCase() ===
                          values.challan_no.toLowerCase() &&
                        tran._id !== item.transactionId
                    );

                    if (
                      filterTran.length > 0 &&
                      values.transactionType === "in"
                    ) {
                      dispatchWarningMessage(
                        dispatch,
                        `Entered Challan No is already used for ${value.name} inventory. Please check.`
                      );
                    } else {
                      setOpen(false);
                      dispatch(
                        updateMaterialData({
                          projectId,
                          type: "update",
                          reportId: props.data.data._id,
                          Data: item,
                        })
                      ).then((response) => {
                        setValue(initialValue);
                        setValues(initialValues);
                        setRate(0);
                        dispatch(
                          getDetailReport({
                            projectId,
                            reportId: props.data.data._id,
                          })
                        ).then((response) => {
                          let row = {
                            _id: response.payload._id,
                            createdAt: response.payload.createdAt,
                            submittedDate: response.payload.submittedDate,
                            approvalDate: response.payload.approvalDate,
                            status:
                              response.payload.status === 0
                                ? "Inactive"
                                : response.payload.status === 1
                                ? "New"
                                : response.payload.status === 2
                                ? "Submitted"
                                : response.payload.status === 3
                                ? "Approved"
                                : response.payload.status === 4
                                ? "Reverted"
                                : null,
                          };
                          dispatch(openEditDialog(row));
                        });
                      });
                    }
                  } else {
                    setOpen(false);
                    setValue(initialValue);
                    setValues(initialValues);
                    setRate(0);
                  }
                }
              }
            }
          });
        }
      });
    }
  }

  function addList() {
    if (value.name === "") {
      setOpen(false);
    } else {
      let mat = {};
      inventory.forEach((item) => {
        if (value.id === item._id) {
          if (item.quantity === 0 && values.transactionType === "out") {
            dispatchWarningMessage(
              dispatch,
              "Sorry!! Entered quantity is not available. Please Add Quantity."
            );
          } else if (
            values.quantity > item.quantity &&
            values.transactionType === "out"
          ) {
            dispatchWarningMessage(
              dispatch,
              "Sorry!! Entered quantity is greater than available quantity."
            );
          } else {
            let newRate = values.transactionType === "out" ? 0 : rate;

            mat = {
              _id: FuseUtils.generateGUID(),
              projectInventoryId: item._id,
              name: value.name,
              value: values.quantity,
              unit: item.unit,
              challan_no:
                values.transactionType === "out" ? "" : values.challan_no,
              description: values.description,
              transactionType: values.transactionType,
              grade: values.grade,
              supplier: values.supplier,
              supplierId: values.supplierId === "" ? null : values.supplierId,
              purchaseOrderId:
                values.transactionType === "out" ? null : values.purchaseOrderId,
              orderNo: values.transactionType === "out" ? "" : values.orderNo,
              brand: values.brand,
              rate: 
               values.transactionType === "out" ? 0 : newRate,
              amount: values.quantity * newRate,
            };

            let data = {
              projectInventoryId: item._id,
              name: value.name,
              value: values.quantity,
              unit: item.unit,
              challan_no:
                values.transactionType === "out" ? "" : values.challan_no,
              description: values.description,
              transactionType: values.transactionType,
              grade: values.grade,
              supplier: values.supplier,
              supplierId: values.supplierId === "" ? null : values.supplierId,
              purchaseOrderId:
                values.transactionType === "out" ? null : values.purchaseOrderId,
              orderNo: values.transactionType === "out" ? "" : values.orderNo,
              brand: values.brand,
              rate: newRate,
              amount: values.quantity * newRate,
            };

            if (props.data.Dialogtype === "edit") {
              let transact = value.transactions,
                newTrans = [];

              transact.map((tan) => {
                if (tan.status !== 2 && tan.transactionType === "in") {
                  newTrans.push({
                    _id: tan._id,
                    challan_no:
                      tan.challan_no === undefined || tan.challan_no === null
                        ? ""
                        : tan.challan_no,
                  });
                }
              });

              let filterTran = newTrans.filter(
                (tran) =>
                  tran.challan_no.toLowerCase() ===
                    values.challan_no.toLowerCase() &&
                  tran._id !== item.transactionId
              );

              if (filterTran.length > 0 && values.transactionType === "in") {
                dispatchWarningMessage(
                  dispatch,
                  `Entered Challan No is already used for ${value.name} inventory. Please check.`
                );
              } else {
                dispatch(
                  addMaterialData({
                    projectId,
                    reportId: props.data.data._id,
                    Data: data,
                  })
                ).then((response) => {
                  setValues(initialValues);
                  setValue(initialValue);
                  setRate(0);
                  dispatch(
                    getDetailReport({
                      projectId,
                      reportId: props.data.data._id,
                    })
                  ).then((response) => {
                    let row = {
                      _id: response.payload._id,
                      createdAt: response.payload.createdAt,
                      submittedDate: response.payload.submittedDate,
                      approvalDate: response.payload.approvalDate,
                      status:
                        response.payload.status === 0
                          ? "Inactive"
                          : response.payload.status === 1
                          ? "New"
                          : response.payload.status === 2
                          ? "Submitted"
                          : response.payload.status === 3
                          ? "Approved"
                          : response.payload.status === 4
                          ? "Reverted"
                          : null,
                    };
                    dispatch(openEditDialog(row));
                  });
                });
              }
            } else {
              let bodyFormData = new FormData();
              bodyFormData.set("wing", "");
              bodyFormData.set("building", "");
              bodyFormData.set("floor", "");
              bodyFormData.set("flat", "");
              bodyFormData.set("workProgress", JSON.stringify([]));
              bodyFormData.set("inventory", JSON.stringify([data]));
              bodyFormData.set("labour", JSON.stringify([]));
              bodyFormData.set("hindrance", JSON.stringify([]));
              bodyFormData.set("consumption", JSON.stringify([]));
              bodyFormData.set("staff", JSON.stringify([]));
              bodyFormData.set("sitevisitor", JSON.stringify([]));
              bodyFormData.set("notes", JSON.stringify([]));
              bodyFormData.set("equipment", JSON.stringify([]));
              bodyFormData.set("existingAttachments", JSON.stringify([]));
              bodyFormData.append("attachments", "");
              bodyFormData.set("date", props.date);

              let transact = value.transactions,
                newTrans = [];

              transact.map((tan) => {
                if (tan.status !== 2 && tan.transactionType === "in") {
                  newTrans.push({
                    _id: tan._id,
                    challan_no:
                      tan.challan_no === undefined || tan.challan_no === null
                        ? ""
                        : tan.challan_no,
                  });
                }
              });

              let filterTran = newTrans.filter(
                (tran) =>
                  tran.challan_no.toLowerCase() ===
                    values.challan_no.toLowerCase() &&
                  tran._id !== item.transactionId
              );

              if (filterTran.length > 0 && values.transactionType === "in") {
                dispatchWarningMessage(
                  dispatch,
                  `Entered Challan No is already used for ${value.name} inventory. Please check.`
                );
              } else {
                dispatch(
                  saveReport({ projectId, formData: bodyFormData })
                ).then((response) => {
                  if (response.payload === undefined) {
                    setValues(initialValues);
                    setValue(initialValue);
                    setRate(0);
                    setOpen(false);
                    props.onClose();
                  } else {
                    dispatch(
                      getDetailReport({
                        projectId: projectId,
                        reportId: response.payload._id,
                      })
                    ).then(() => {
                      setValues(initialValues);
                      setValue(initialValue);
                      setRate(0);
                      dispatch(closeNewDialog());
                      dispatch(openEditDialog(response.payload));
                    });
                  }
                });
              }
            }
          }
        }
      });
    }
  }

  function deleteList(id) {
    if (props.data.Dialogtype === "edit") {
      setDelete1(true);
      setMaterialId(id);
    } else {
      let mat = JSON.parse(JSON.stringify(material));
      let deletedMat = mat.filter((item) => item._id !== id);
      setNewMaterial(deletedMat);
    }
  }

  function deleteMaterial() {
    let mat = JSON.parse(JSON.stringify(material));
    let deletedMat = mat.filter((item) => item._id === materialId);

    if (deletedMat.length > 0) {
      if (deletedMat[0].transactionType === "in") {
        inventory.map((inv) => {
          if (inv._id === deletedMat[0].projectInventoryId) {
            let availableQuantity =
              Number(inv.quantity) - Number(deletedMat[0].value);

            if (availableQuantity < 0) {
              setDelete1(false);
              dispatchWarningMessage(
                dispatch,
                "Please check the available quantiy. The updated available quantity will not a negative value. "
              );
            } else {
              setDelete1(false);
              deleteRecord(deletedMat);
            }
          }
        });
      } else {
        setDelete1(false);
        deleteRecord(deletedMat);
      }
    }
  }

  function deleteRecord(deletedMat) {
    dispatch(
      deleteMaterialTransaction({
        projectId,
        reportId: props.data.data._id,
        Data: deletedMat,
      })
    ).then((response) => {
      dispatch(
        getDetailReport({ projectId, reportId: props.data.data._id })
      ).then((response) => {
        let row = {
          _id: response.payload._id,
          createdAt: response.payload.createdAt,
          submittedDate: response.payload.submittedDate,
          approvalDate: response.payload.approvalDate,
          status:
            response.payload.status === 0
              ? "Inactive"
              : response.payload.status === 1
              ? "New"
              : response.payload.status === 2
              ? "Submitted"
              : response.payload.status === 3
              ? "Approved"
              : response.payload.status === 4
              ? "Reverted"
              : null,
        };
        dispatch(openEditDialog(row));
      });
    });
  }

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

  function formatOrderNumber(orderNo) {
    const orderSegments = orderNo.split('/');
    const formattedOrderNo = (orderSegments.length >= 2) ? orderSegments.slice(-2).join('/') : "";
    return formattedOrderNo;
  }


  function redirectToInventory() {
    if (modules.length === 0 || modules.includes("Inventory")) {
      if (access === true) {
        if (projectDialog.Dialogtype === "new") {
          props.onClose();
          sessionStorage.setItem("inv", "inv");
          dispatch(routes("Inventory"));
        } else if (projectDialog.Dialogtype === "edit") {
          props.onClose();
          sessionStorage.setItem("inv", "inv");
          dispatch(routes("Inventory"));
        }
      } else {
        dispatchWarningMessage(
          dispatch,
          "You don't have access to add a New Inventory."
        );
      }
    } else {
      dispatchWarningMessage(
        dispatch,
        "Please include Inventory module from Settings to Add Contractor."
      );
    }
  }

  props.onCountChange({ material: material.length });

  return (
    <>
      {!material.length ? (
        <Typography className="text-center" color="textSecondary" variant="h5">
          There are no entries for Material!
        </Typography>
      ) : (
        <List component="nav" aria-label="mailbox folders">
          {material.map((item) => (
            <>
              <ListItem
                button
                key={item._id}
                onClick={
                  createAccess
                    ? (ev) => {
                        setType("Edit");
                        handleSelectList(
                          item._id,
                          item.name,
                          item.unit,
                          item.value,
                          item.description,
                          item.challan_no ? item.challan_no : null,
                          item.transactionType ? item.transactionType : "out",
                          item.grade ? item.grade : null,
                          item.projectInventoryId,
                          item.supplier,
                          item.brand,
                          item.rate ? item.rate : 0,
                          item.amount ? item.amount : 0,
                          item.orderNo ? item.orderNo : "",
                          item.supplierId ? item.supplierId : "",
                          item.purchaseOrderId ? item.purchaseOrderId : ""
                        );
                      }
                    : () =>
                        dispatchWarningMessage(
                          dispatch,
                          "You do not have access to update Material. Contact Project Owner."
                        )
                }
              >
                <ListItemText
                  primary={item.name}
                  secondary={
                    <div className="flex flex-row gap-6">
                      <Typography>{item.value + " " + item.unit}</Typography>

                      {item.transactionType && item.transactionType === "in" ? (
                        <Typography style={{ color: "green" }}>
                          Added
                        </Typography>
                      ) : (
                        <Typography style={{ color: "red" }}>
                          Consumed
                        </Typography>
                      )}
                    </div>
                  }
                />
                {hide === true ? null : (
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={
                        deleteAccess
                          ? () => deleteList(item._id)
                          : () =>
                              dispatchWarningMessage(
                                dispatch,
                                "You do not have access to delete this entry. Contact Project Owner."
                              )
                      }
                      variant="contained"
                    >
                      <Icon className={classes.delete}>delete</Icon>
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            </>
          ))}
        </List>
      )}
      {hide === true ? null : (
        <Fab
          color="primary"
          aria-label="add"
          disabled={createAccess === true ? false : true}
          className={classes.addButton}
          onClick={handleOpen}
        >
          <Icon>add</Icon>
        </Fab>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <DialogTitle id="alert-dialog-title">{"Update Material"}</DialogTitle>
        <DialogContent>
          <FormControl variant="outlined">
            {/* <InputLabel id="demo-simple-select-placeholder-label-label">
              Inventory
            </InputLabel> */}
            {/* <Select
              id="demo-dialog-select"
              key={values.id}
              value={values.id}
              label="Inventory"
              renderInput={(params) => <TextField {...params}   label="Inventory" variant="outlined" />}
            // onChange={handleChange("name")}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {invName.map((iname) => (
                <MenuItem
                  key={iname.id}
                  value={iname.id}
                  onClick={() => handleChangeName(iname.id, iname.name)}
                >
                  <div className="flex flex-col">
                    <Typography>
                      {`${iname.name}` +
                        "  " +
                        `${iname.quantity}` +
                        "  " +
                        `${iname.unit}`}
                    </Typography>
                    <Typography>
                      {iname.brand ? iname.brand : null}
                      {iname.supplier ? `  by ` + `${iname.supplier}` : null}
                    </Typography>
                  </div>
                  
                </MenuItem>
                
              ))}
              
            </Select>
           */}
            <Autocomplete
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

                // if (option.unit !== undefined && option.brand !== undefined && option.supplier !== undefined) {
                return option.name + " " + option.unit;
                // }
              }}
              renderOption={(option) =>
                option.name + " " + option.quantity + " " + option.unit
              }
              style={{ width: 300 }}
              freeSolo
              renderInput={(params) => (
                <TextField {...params} label="Inventory" variant="outlined" />
              )}
            />

            <Link
              className="cursor-pointer ml-10 mt-10 mb-10"
              onClick={() => {
                redirectToInventory();
              }}
            >
              Click here to Add New Inventory
            </Link>

            <TextField
              className="mt-8"
              variant="outlined"
              // error={error}
              // helperText="enter quantity within range of avialble quantity"
              id="filled-number"
              label="Quantity"
              value={values.quantity}
              onChange={handleChange("quantity")}
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <FormControl variant="outlined" className="mt-8">
              <InputLabel id="demo-simple-select-outlined-label">
                Transaction Type
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={values.transactionType}
                disabled={type === "Edit" ? true : false}
                onChange={handleChange("transactionType")}
                label="Transaction Type"
              >
                <MenuItem value="in">Added</MenuItem>
                <MenuItem value="out">Consumed</MenuItem>
              </Select>
            </FormControl>

            {value.name !== "" ? (
              <FormControl variant="outlined" className="mt-8">
                <InputLabel id="demo-simple-select-outlined-label">
                  Supplier
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={values.supplier}
                  onChange={handleChange("supplier")}
                  label="Supplier"
                >
                  {value.supplier.map((sname) => (
                    <MenuItem key={sname} value={sname}>
                      {sname}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : null}

{value.name !== "" &&
    values.transactionType === "in" &&
    values.supplier !== "" ? (
        <FormControl variant="outlined" className="mt-8">
            <InputLabel id="demo-simple-select-outlined-label">
                Purchase Order
            </InputLabel>
            <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={values.orderNo}
                //onChange={handleChange("po")}
                label="Purchase Order"
            >
                <MenuItem
                    key="1"
                    value="No PO"
                    onClick={() => {
                        setValues({
                            ...values,
                            orderNo: "No PO",
                            purchaseOrderId: null,
                        });
                        setRate(0);
                    }}
                >
                    No Po
                </MenuItem>
                {supplierPo.map((po) => (
                    <MenuItem
                        key={po._id}
                        value={po.orderNo}
                        onClick={() => setPoDetails(po)}
                    >
                        {formatOrderNumber(po.orderNo)}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    ) : null}


            {values.supplier !== "" && value.brand.length > 0 ? (
              <FormControl variant="outlined" className="mt-8">
                <InputLabel id="demo-simple-select-outlined-label">
                  Brand
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={values.brand}
                  onChange={handleChange("brand")}
                  label="Brand"
                >
                  {value.brand.map((bname) => (
                    <MenuItem key={bname} value={bname}>
                      {bname}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : null}

            {values.transactionType === "in" ? (
              <TextField
                className="mt-8"
                variant="outlined"
                // error={error}
                // helperText="enter quantity within range of avialble quantity"
                id="challan-number"
                label="Challan No."
                value={values.challan_no}
                onChange={handleChange("challan_no")}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            ) : null}
            {value !== null ? (
              value.name === "RMC" ||
              value.name === "Rmc" ||
              value.name === "rmc" ? (
                <FormControl variant="outlined" className="mt-8 w-full">
                  <InputLabel id="demo-simple-select-outlined-label">
                    Select Grade
                  </InputLabel>
                  <Select
                    required
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={values.grade}
                    onChange={handleChange("grade")}
                    label="Grade"
                  >
                    {gradeType.map((wo) => (
                      <MenuItem value={wo}>
                        <Typography>{wo}</Typography>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : null
            ) : null}

            <TextField
              className="mt-8"
              variant="outlined"
              label="Description"
              value={values.description}
              onChange={handleChange("description")}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            CLOSE
          </Button>
          {type === "Edit" ? (
            hide === true ? null : (
              <Button
                disabled={!buttonDisabled()}
                onClick={() => listChange()}
                color="primary"
                autoFocus
              >
                UPDATE
              </Button>
            )
          ) : (
            <Button
              disabled={!buttonDisabled()}
              onClick={() => addList()}
              color="primary"
              autoFocus
            >
              ADD
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Dialog open={delete1}>
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <DialogTitle id="alert-dialog-slide-title">
          Do you want to delete Material Entry ?
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={() => {
              setDelete1(false);
            }}
            color="primary"
          >
            No
          </Button>
          <Button
            onClick={() => {
              deleteMaterial();
            }}
            color="primary"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default React.memo(Material);
