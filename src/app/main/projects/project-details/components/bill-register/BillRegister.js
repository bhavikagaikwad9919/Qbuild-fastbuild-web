import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Fab, Icon, Button } from "@material-ui/core";
import FuseAnimate from "@fuse/core/FuseAnimate";
import FuseLoading from "@fuse/core/FuseLoading";
import { useDispatch, useSelector } from "react-redux";
import ReactTable from "react-table-6";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import BillRegisterDialog from "./BillRegisterDialog";
import { Backdrop } from "@material-ui/core";
import {
    listBills,
    openNewDialog,
    openEditDialog,
    detailBill,
    downloadBillExcelReport,
    viewBillExcelReport
  } from "app/main/projects/store/projectsSlice";
import Typography from "@material-ui/core/Typography";
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Table from "@material-ui/core/Table";
import DialogContent from "@material-ui/core/DialogContent";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

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


function BillRegister(props) {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const bill = useSelector(({ projects }) => projects.bills.billsList);
  const projectId = useSelector(({ projects }) => projects.details._id);
  const loading = useSelector(({ projects }) => projects.loading);
  const [access, setAccess] = useState();
  const team = useSelector(({ projects }) => projects.details.team);
  const role = useSelector(({ auth }) => auth.user);
  const projectName = useSelector(({ projects }) => projects.details.title);
  const vendors = useSelector(({ projects }) => projects.vendors.vendorsList);
  const [billData, setBillData] = useState([]);
  const [data, setData] = useState([]);
  const [viewOpen, setViewOpen] = useState(false);

  useEffect(() => {
    team.forEach((t)=>{
      if((t._id === role.data.id && t.role === "owner") || role.role === 'admin')
      {
        setAccess(true)
      }else if(t._id === role.data.id && t.role !== "owner")
      {
         const member=t.tab_access.filter((i)=>i === "Bill Register");
         console.log(member)
         if(member[0] === "Bill Register")
         {
           setAccess(true)
         }
      }
   })
  }, [access, role.data.id, role.role, team]);

  useEffect(() => {
    dispatch(listBills(projectId));
  }, []);

  useEffect(() => {
    let bills =[];
 
   bill.forEach((bl)=>{
    let venInfo = vendors.filter((ven)=> ven._id === bl.supplierId && ven.agencyType === 'Supplier');
  
    bills.push({
      "billImage": bl.billImage,
      "createdBy": bl.createdBy,
      "createdDate": bl.createdDate,
      "invoiceDate": bl.invoiceDate,
      "invoiceNo": bl.invoiceNo,
      "orderData": bl.orderData,
      "poId": bl.poId,
      "supplierId": bl.supplierId,
      "supplier": venInfo.length > 0 ? venInfo[0].name: " ",
      "updatedBy": bl.updatedBy,
      "updatedDate": bl.updatedDate,
      "_id": bl._id
    })
  })
   setBillData(bills);
  }, [bill]);

  if (!bill) {
    return <FuseLoading />;
  }

   const openDialog = (data) => {
     let billId=data._id;
      dispatch(detailBill({projectId, billId })).then((response) => {
        dispatch(openEditDialog(data));
      });   
   }

   const downloadReport = (projectId, projectName, billDetails) =>{
    let billId = billDetails._id;
    let orderDate = billDetails.invoiceDate

    if(billDetails.orderData.length == 0){
      dispatchWarningMessage(dispatch, "Order Data Not Found. Please Add.")
    }else{
      dispatch(
        downloadBillExcelReport({
          projectId,
          projectName,
          billId,
          orderDate
        })
      );
    }
    
  } 

  const viewReport = (projectId, projectName, billDetails) =>{
    let billId = billDetails._id;
    let orderDate = billDetails.invoiceDate

    if(billDetails.orderData.length == 0){
      dispatchWarningMessage(dispatch, "Order Data Not Found. Please Add.")
    }else{
      dispatch(viewBillExcelReport({ projectId, projectName, billId, orderDate, })).then((response) => {
        setData(response.payload);
        setViewOpen(true);
      });
    }
    
  }

  function filterCaseInsensitive(filter, row) {
    const id = filter.pivotId || filter.id;
    return (
      row[id] !== undefined ?
        String(row[id].toLowerCase()).includes(filter.value.toLowerCase())
      :
        false
    );
  }

  return (
    <React.Fragment>
      <Paper className="w-full rounded-8 shadow-1">
        <div className="flex items-center justify-between px-16 h-64 border-b-1">
          <Typography className="text-16 font-bold">Bill Register</Typography>  
          {access?
            <Button color="primary" onClick={() => dispatch(openNewDialog())} variant="contained" className="mb-8" style={{padding:'3px 16px'}} nowrap="true">Add Bill</Button> 
          :null}
          </div>
        <FuseAnimate animation="transition.slideUpIn" delay={100}>
          <ReactTable
            className={classes.root}
            getTrProps={(state, rowInfo, column) => {
              return {
                className: "-striped -highlight items-center justify-center",
              };
            }}
            // className={clsx(classes.root)}
            data={billData}
            defaultFilterMethod={(filter, row) => filterCaseInsensitive(filter, row) }
            // pageSize={team.length}
            columns={[
              {
                Header: "Invoice No",
                accessor: "invoiceNo",
                filterable: true,
                Cell: ({ row }) => (
                  <a
                    className="cursor-pointer"
                    onClick={access ? () => {
                      openDialog(row._original)
                    }:() => dispatchWarningMessage(dispatch, "You don't have an access to view or update Bill Register Entry.")}
                  >
                    {row.invoiceNo}
                  </a>
                ),
                className: "font-bold",
              },
              {
                Header: "Invoice Date",
                accessor: "invoiceDate",
                filterable: true,
              },
              {
                Header: "Supplier",
                accessor: "supplier",
                filterable: true,
              },
              {
                Header: 'Download Bill/ View Bill',
                id:'download_report',
                style: { 'white-space': 'unset' },
                accessor: () => (
                  <Typography
                    className={'bg-blue  -700 text-white inline p-4 rounded truncate'}
                  >
                    Download
                  </Typography>
                ),
                Cell: ({ row }) => (
                  <>
                  <a
                    className='cursor-pointer'
                    onClick={access ? () => downloadReport(projectId,projectName, row._original):
                      () => dispatchWarningMessage(dispatch, "You don't have an access to download a Bill.")}
                  >
                   Download
                  </a>
                  <span> / </span>
                  <a
                    className='cursor-pointer'
                    onClick={access ? () => viewReport(projectId,projectName, row._original):
                      () => dispatchWarningMessage(dispatch, "You don't have an access to download a Bill.")}
                  >
                   View
                  </a>
                  </>
                  
                ),
                className: 'font-bold',
              }
            ]}
            defaultPageSize={10}
            noDataText="No Bill Found"
          />
        </FuseAnimate>
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
       
        <FuseAnimate animation="transition.expandIn" delay={300}>
          <Fab
            color="primary"
            aria-label="add"
            className={classes.addButton}
            disabled={access === true ? false :true}
            onClick={() => {
              dispatch(openNewDialog())
            }}
          >
            <Icon>add</Icon>
          </Fab>
        </FuseAnimate>
      
      </Paper>

       <BillRegisterDialog />

       
       <Dialog
         fullWidth maxWidth="md"
         open = {viewOpen}
       >
         <DialogTitle id="alert-dialog-title">{data.bill !== undefined ? data.bill[0].invoiceNo : null}</DialogTitle>
         <DialogContent className="items-center justify-center">
         <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
          <TableBody>
            <>
            <TableRow key={1}>
             <TableCell component="th" className="font-bold" style={{ textAlign: "center", fontSize: "100%" }}  variant="h6" scope="row" width="100%">
               Bill Approval Certificate
             </TableCell>
            </TableRow>
            </> 
          </TableBody>
          </Table>
         </TableContainer>

         <div class="grid grid-cols-2 divide-x divide-gray-400">
         <TableContainer component={Paper}>
          <Table  aria-label="simple table">
          <TableBody>
            <>
            <TableRow key={1}>
             <TableCell component="th" className="font-bold" style={{ textAlign: "center", fontSize: "100%" }}  variant="h6" scope="row" width="100%">
               {data.vendor !== undefined && data.vendor !== null  ? data.vendor.name : null}
             </TableCell>
            </TableRow>
            <TableRow key={2}>
             <TableCell component="th" className="font-bold" style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
               {data.vendor !== undefined && data.vendor !== null ? data.vendor.address : null}
             </TableCell>
            </TableRow>
            <TableRow key={1}>
             <TableCell component="th" className="font-bold" style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
               PAN NO - {data.vendor !== undefined && data.vendor !== null ? data.vendor.pan : null}
             </TableCell>
            </TableRow>
            <TableRow key={1}>
             <TableCell component="th" className="font-bold" style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
               GST NO - {data.vendor !== undefined && data.vendor !== null ? data.vendor.gstin : null}
             </TableCell>
            </TableRow>
            </> 
          </TableBody>
          </Table>
         </TableContainer>
         <TableContainer component={Paper}>
          <Table aria-label="simple table">
          <TableBody>
            <> 
            <TableRow key={1}>
             <TableCell component="th" className="font-bold" style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
               Invoice NO - {data.bill !== undefined ? data.bill[0].invoiceNo : null}
             </TableCell>
            </TableRow>
            <TableRow key={2}>
             <TableCell component="th" className="font-bold" style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
               Invoice DATE - {data.bill !== undefined ? data.bill[0].invoiceDate : null}
             </TableCell>
            </TableRow>
            <TableRow key={3}>
             <TableCell component="th" className="font-bold" style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
               PO Date - {data.po !== undefined ? data.po.orderDate : null}
             </TableCell>
            </TableRow>
            <TableRow key={4}>
             <TableCell component="th" className="font-bold" style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
               PO NO. - {data.po !== undefined ? data.po.orderNo : null}
             </TableCell>
            </TableRow>
            </> 
          </TableBody>
          </Table>
         </TableContainer>
         </div>

         <div style={{ marginTop: "20px" }}  class="grid grid-cols-2 divide-x divide-gray-400">
         <TableContainer component={Paper}>
          <Table  aria-label="simple table">
          <TableBody>
            <>
            <TableRow key={1}>
             <TableCell component="th"  className="font-bold" style={{ textAlign: "center", fontSize: "100%" }}  variant="h6" scope="row" width="100%">
               Name & Address of Buyer
             </TableCell>
            </TableRow>
            <TableRow key={2}>
             <TableCell component="th" className="font-bold" style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
               {data.organization !== undefined && data.organization !== null ? data.organization.name : null}
             </TableCell>
            </TableRow>
            <TableRow key={3}>
             <TableCell component="th" className="font-bold" style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
               {data.organization !== undefined && data.organization !== null ? data.organization.address : null}
             </TableCell>
            </TableRow>
            <TableRow key={4}>
             <TableCell component="th" className="font-bold" style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
               GST NO - {data.organization !== undefined && data.organization !== null ? data.organization.gstIn : null}
             </TableCell>
            </TableRow>
            </> 
          </TableBody>
          </Table>
         </TableContainer>
         <TableContainer  component={Paper}>
          <Table aria-label="simple table">
          <TableBody>
            <>
            <TableRow key={1}>
             <TableCell component="th" className="font-bold" style={{ textAlign: "center", fontSize: "100%" }}  variant="h6" scope="row" width="100%">
                Name & Address of Recipient
             </TableCell>
            </TableRow>
            <TableRow key={2}>
             <TableCell component="th" className="font-bold" style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
               {data.project !== undefined ? data.project.title : null}
             </TableCell>
            </TableRow>
            <TableRow key={3}>
             <TableCell component="th"  className="font-bold" style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
               {data.project !== undefined ? data.project.location : null}
             </TableCell>
            </TableRow>
            <TableRow key={4}>
             <TableCell component="th" className="font-bold" style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
               GST NO - 
             </TableCell>
            </TableRow>
            </> 
          </TableBody>
          </Table>
         </TableContainer>
         </div>

         {data.bill !== undefined ?
           <TableContainer style={{ marginTop: "20px" }} component={Paper}>
             <Table className={classes.table} aria-label="simple table">
               <TableHead>
                 <TableRow>
                   <StyledTableCell width="40%">Product Name</StyledTableCell>
                   <StyledTableCell width="15%">Challan's</StyledTableCell>
                   <StyledTableCell width="15%">Unit</StyledTableCell>
                   <StyledTableCell width="15%">Quantity</StyledTableCell>
                   <StyledTableCell width="15%">RATE</StyledTableCell>
                   <StyledTableCell width="15%">GST %</StyledTableCell>
                   <StyledTableCell width="20%">AMOUNT</StyledTableCell>
                 </TableRow>
               </TableHead>
               <TableBody>
                  {data.bill[0].orderData.map((od,id) => (
                    <StyledTableRow key={1}>
                     <StyledTableCell width="40%" align="left"> {od.inventory + "  " + od.grade} </StyledTableCell>
                     <StyledTableCell width="15%" align="left"> {od.challanNo + " "} </StyledTableCell>
                     <StyledTableCell width="15%" align="left"> {od.unit} </StyledTableCell>
                     <StyledTableCell width="15%" align="left"> {od.quantity} </StyledTableCell>
                     <StyledTableCell width="15%" align="left"> {od.rate} </StyledTableCell>
                     <StyledTableCell width="15%" align="left"> {od.gst} </StyledTableCell>
                     <StyledTableCell width="20%" align="left"> {od.amount.toFixed(2)} </StyledTableCell>
                    </StyledTableRow>
                  ))}
                  <StyledTableRow key={1}>
                    <StyledTableCell width="40%" align="left"> </StyledTableCell>
                    <StyledTableCell width="15%" align="left"> </StyledTableCell>
                    <StyledTableCell width="15%" align="left"> </StyledTableCell>
                    <StyledTableCell width="15%" align="left"> </StyledTableCell>
                    <StyledTableCell width="15%" align="left"> </StyledTableCell>
                    <StyledTableCell width="15%" align="left" className="font-bold"> Total</StyledTableCell>
                    <StyledTableCell width="20%" align="left" className="font-bold"> {data.total !== undefined ? data.total : null}</StyledTableCell>
                  </StyledTableRow>
                  {data.bill[0].transport > 0 ? 
                  <>
                    <StyledTableRow key={1}>
                      <StyledTableCell width="40%" align="left"> </StyledTableCell>
                      <StyledTableCell width="15%" align="left"> </StyledTableCell>
                      <StyledTableCell width="15%" align="left"> </StyledTableCell>
                      <StyledTableCell width="15%" align="left"> </StyledTableCell>
                      <StyledTableCell width="15%" align="left"> </StyledTableCell>
                      <StyledTableCell width="15%" align="left" className="font-bold">Transport</StyledTableCell>
                      <StyledTableCell width="20%" align="left" className="font-bold"> {data.bill[0].transport}</StyledTableCell>
                    </StyledTableRow>
                    <StyledTableRow key={1}>
                      <StyledTableCell width="40%" align="left"> </StyledTableCell>
                      <StyledTableCell width="15%" align="left"> </StyledTableCell>
                      <StyledTableCell width="15%" align="left"> </StyledTableCell>
                      <StyledTableCell width="15%" align="left"> </StyledTableCell>
                      <StyledTableCell width="15%" align="left"> </StyledTableCell>
                      <StyledTableCell width="15%" align="left" className="font-bold">Transport Gst</StyledTableCell>
                      <StyledTableCell width="20%" align="left" className="font-bold"> {data.bill[0].transportgst}</StyledTableCell>
                    </StyledTableRow>
                    <StyledTableRow key={1}>
                      <StyledTableCell width="40%" align="left"> </StyledTableCell>
                      <StyledTableCell width="15%" align="left"> </StyledTableCell>
                      <StyledTableCell width="15%" align="left"> </StyledTableCell>
                      <StyledTableCell width="15%" align="left"> </StyledTableCell>
                      <StyledTableCell width="15%" align="left"> </StyledTableCell>
                      <StyledTableCell width="15%" align="left" className="font-bold">TDS Amount</StyledTableCell>
                      <StyledTableCell width="20%" align="left" className="font-bold"> {data.bill[0].tdsamount}</StyledTableCell>
                    </StyledTableRow>
                    <StyledTableRow key={1}>
                      <StyledTableCell width="40%" align="left"> </StyledTableCell>
                      <StyledTableCell width="15%" align="left"> </StyledTableCell>
                      <StyledTableCell width="15%" align="left"> </StyledTableCell>
                      <StyledTableCell width="15%" align="left"> </StyledTableCell>
                      <StyledTableCell width="15%" align="left"> </StyledTableCell>
                      <StyledTableCell width="15%" align="left" className="font-bold">Grand Total</StyledTableCell>
                      <StyledTableCell width="20%" align="left" className="font-bold"> {data.finalAmount}</StyledTableCell>
                    </StyledTableRow>
                  </>
                  :null}
                </TableBody>
              </Table>
           </TableContainer>
         :null}

          <TableContainer component={Paper}>
           <Table className={classes.table} aria-label="simple table">
             <TableBody>
               <>
                 <TableRow key={1}>
                   <TableCell component="th" className="font-bold" style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
                      Total Amount In Words - {data.wordTotal !== undefined ? data.wordTotal : null}
                   </TableCell>
                 </TableRow>
                 {data.po !== undefined ?
                   <TableRow key={1}>
                     <TableCell component="th" className="font-bold" style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
                       Contact Name and Phone - {data.po.siteContactPerson !== undefined ? data.po.siteContactPerson  : null} -
                       {data.po.sitePersonNo !== undefined ? data.po.sitePersonNo  : null}
                     </TableCell>
                   </TableRow>
                  :null}
                </> 
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewOpen(false)} variant="contained" color="primary">
            CLOSE
          </Button>
        </DialogActions>
      </Dialog>

    </React.Fragment>
  );
}

export default BillRegister;