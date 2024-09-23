import React, { useState,useEffect } from "react";
import { makeStyles,withStyles } from "@material-ui/core/styles";
import { Fab, Icon, Button } from "@material-ui/core";
import FuseAnimate from "@fuse/core/FuseAnimate";
import Typography from "@material-ui/core/Typography";
import { useDispatch, useSelector } from "react-redux";
import ReactTable from "react-table-6";
import Paper from "@material-ui/core/Paper";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { detailBilling, openNewDialog, openEditDialog, downloadInvoiceExcelReport, viewInvoiceReport} from "app/main/projects/store/projectsSlice";
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import Table from "@material-ui/core/Table";
import DialogContent from "@material-ui/core/DialogContent";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import BillingDialog from "../billing/billingDialog";
import MomDialog from "./momDialog";

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

function Mom(props)
{
    const classes = useStyles(props);
    const dispatch = useDispatch();
    const loading = useSelector(({ projects }) => projects.loading);
    const [access, setAccess] = useState();
    const billings = useSelector(({ projects }) => projects.billing.billingList);
    const projectName = useSelector(({ projects }) => projects.details.title);
    const team = useSelector(({ projects }) => projects.details.team);
    const role = useSelector(({ auth }) => auth.user);
    const projectId = useSelector(({ projects }) => projects.details._id);
    const [bill, setBill] = useState([]);
    const [viewOpen, setViewOpen] = useState(false);
    const userId = useSelector(({ auth }) => auth.user.data.id)

    useEffect(() => {
      team.forEach((t)=>{
        if((t._id === role.data.id && t.role === "owner") || role.role === 'admin')
        {
          setAccess(true)
        }else if(t._id === role.data.id && t.role !== "owner")
        {
          const member=t.tab_access.filter((i)=>i === "Billing");
          console.log(member)
          if(member[0] === "Billing")
          {
            setAccess(true)
          }
        }
     })
    }, [access, role.data.id, role.role, team]);


    const downloadReport = (projectId,projectName,billDetails) =>{
      let billId = billDetails._id;
      let billDate = billDetails.billingDate

      dispatch(
        downloadInvoiceExcelReport({
          projectId,
          projectName,
          billId,
          billDate,
          userId
        })
      );
       
    } 

    const viewReport = (projectId,projectName,billDetails) =>{
      let billId = billDetails._id;
      let billDate = billDetails.billingDate

      dispatch(viewInvoiceReport({ projectId, projectName, billId, billDate,userId })).then((response) => {
        setBill(response.payload);
        setViewOpen(true);
      });
    } 

    const openDialog = async (data) => {
     await dispatch(detailBilling(data._id));
     dispatch(openEditDialog(data));
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
            <Typography className="text-16 font-bold">Mom</Typography>
            {access?  
              <Button color="primary" onClick={() => dispatch(openNewDialog())} variant="contained" className="mb-8" style={{padding:'3px 16px'}} nowrap="true">Create Mom</Button> 
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
            data={billings}
            defaultFilterMethod={(filter, row) => filterCaseInsensitive(filter, row) }
            // pageSize={team.length}
            columns={[
              {
                Header: "Mom Date",
                accessor: "billingDate",
                filterable: true,
                Cell: ({ row }) => (
                  <Typography
                    className="font-bold hover:underline cursor-pointer"
                    color="secondary"
                    onClick={access?() => {
                      openDialog(row._original);
                    }:() => dispatchWarningMessage(dispatch, "You don't have access to view or update bill.")}
                  >
                    {row.billingDate}
                  </Typography>
                ),
                className: "font-bold",
              },
              {
                Header: "Reported By",
                accessor: "billholder_name",
                filterable: true,
              },
              {
                Header: "Assigned to",
                accessor: "billType",
                filterable: true,
              },
              {
                Header: 'Download Mom / View Mom',
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
                      onClick={access ? () => downloadReport(projectId,projectName, row._original):() => dispatchWarningMessage(dispatch, "You don't have access to download the bill.")}
                    >
                     Download
                    </a>
                    <span> / </span>
                    <a
                      className='cursor-pointer'
                      onClick={access ? () => viewReport(projectId,projectName, row._original):() => dispatchWarningMessage(dispatch, "You don't have access to download the bill.")}
                    >
                     View
                    </a>
                  </>
                  
                  
                ),
                className: 'font-bold',
              }
            ]}
            defaultPageSize={10}
            noDataText="No Invoice found"
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
            onClick={() => {
              // setDialogType("new");
              // setDialog(true);
              dispatch(openNewDialog())
            }}
            disabled={access === true ? false :true}
          >
            <Icon>add</Icon>
          </Fab>
        </FuseAnimate>
      
      </Paper>

      <MomDialog />

      <Dialog
       maxWidth="md"
       open = {viewOpen}
      >
        {/* <DialogTitle id="alert-dialog-title">{po.order !== undefined ? po.order[0].orderNo : null}</DialogTitle> */}
        <DialogContent className="items-center justify-center">
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
          <TableBody>
            <>
            <TableRow key={1}>
             <TableCell component="th" className="font-bold" style={{ textAlign: "center", fontSize: "100%" }}  variant="h6" scope="row" width="100%">
               {bill.billholder_name !== undefined ? bill.billholder_name : null}
             </TableCell>
            </TableRow>
            <div class="grid grid-cols-2">
              <TableContainer component={Paper}>
                <Table  aria-label="simple table">
                  <TableBody>
                    <>
                     <TableRow key={1}>
                       <TableCell component="th" className="font-bold" style={{ textAlign: "center", fontSize: "100%" }}  variant="h6" scope="row" width="100%">
                          TAX INVOICE
                       </TableCell>
                     </TableRow>
                     <TableRow key={2}>
                       <TableCell component="th" className="font-bold" style={{ textAlign: "center", fontSize: "100%" }}  variant="h6" scope="row" width="100%">
                         {bill.billed_to !== undefined ? bill.billed_to: null}
                       </TableCell>
                     </TableRow>
                    </> 
                  </TableBody>
                </Table>
              </TableContainer>
              <TableContainer component={Paper}>
                <Table  aria-label="simple table">
                  <TableBody>
                    <>
                     <TableRow key={3}>
                       <TableCell component="th" className="font-bold" style={{ textAlign: "center", fontSize: "100%" }}  variant="h6" scope="row" width="100%">
                         {bill.billingdate !== undefined ? bill.billingdate : null}
                       </TableCell>
                     </TableRow>
                     <TableRow key={4}>
                       <TableCell component="th" className="font-bold" style={{ textAlign: "center", fontSize: "100%" }}  variant="h6" scope="row" width="100%">
                         INVOICE NO - {bill.invoice_no !== undefined ? bill.invoice_no : null}
                       </TableCell>
                     </TableRow>
                    </> 
                  </TableBody>
                </Table>
              </TableContainer>
            </div>  

            <div class="grid grid-cols-2 divide-x divide-gray-400">
              <TableContainer component={Paper}>
               <Table  aria-label="simple table">
                 <TableBody>
                   <>
                      <TableRow key={1}>
                        <TableCell component="th" style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
                         ADD - {bill.address !== undefined ? bill.address : null}
                       </TableCell>
                      </TableRow>
                      <TableRow key={2}>
                       <TableCell component="th" multiline rows={2} style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
                        Supply Place - Maharashtra
                       </TableCell>
                      </TableRow>
                      <TableRow key={3}>
                       <TableCell component="th" style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
                         KIND ATTN:
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
                       <TableCell component="th" style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
                          SITE ADDRESS - {bill.site_address !== undefined ? bill.site_address : null}
                       </TableCell>
                     </TableRow>
                     <TableRow key={2}>
                       <TableCell component="th" style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
                         WORK ORDER DATE - {bill.work_order_date !== undefined ? bill.work_order_date : null}
                       </TableCell>
                     </TableRow>
                     <TableRow key={3}>
                       <TableCell component="th" style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
                         WORK ORDER NO - {bill.work_order_no !== undefined ? bill.work_order_no : null}
                       </TableCell>
                     </TableRow>
                     <TableRow key={4}>
                       <TableCell component="th" style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
                         CONTACT NO - {bill.contact !== undefined ? bill.contact : null}
                       </TableCell>
                     </TableRow>
                    </> 
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
                     
            {bill.boqdata !== undefined ?
              (bill.billType === 'Current'?              
              <TableContainer style={{ marginTop: "20px" }} component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                   <TableRow>
                      <StyledTableCell width="15%">SR No.</StyledTableCell>
                      <StyledTableCell width="50%">Description</StyledTableCell>
                      <StyledTableCell width="15%">Unit</StyledTableCell>
                      <StyledTableCell width="15%">Quantity</StyledTableCell>
                      <StyledTableCell width="25%">RATE</StyledTableCell>
                      <StyledTableCell width="20%">AMOUNT</StyledTableCell>
                   </TableRow>
                  </TableHead>
                  <TableBody>
                   {bill.boqdata.map((od,id) => (
                      <StyledTableRow key={1}>
                        <StyledTableCell component="th" width="15%" scope="row"> {od.Sr} </StyledTableCell>
                        <StyledTableCell width="50%" align="left"> {od.Description} </StyledTableCell>
                        <StyledTableCell width="15%" align="left"> {od.Unit} </StyledTableCell>
                        <StyledTableCell  width="15%" align="left"> {od.Qty} </StyledTableCell>
                        <StyledTableCell  width="25%" align="left"> {od.Rate} </StyledTableCell>
                        <StyledTableCell  width="20%" align="left"> {od.Amount} </StyledTableCell>
                      </StyledTableRow>
                    ))}
                     <StyledTableRow key={1}>
                     <StyledTableCell component="th" width="15%" scope="row"> </StyledTableCell>
                     <StyledTableCell width="30%" align="left"> </StyledTableCell>
                     <StyledTableCell width="15%" align="left"> </StyledTableCell>
                     <StyledTableCell  width="15%" align="left" className="font-bold">Total Bill</StyledTableCell>
                     <StyledTableCell  width="15%" align="left"> </StyledTableCell>
                     <StyledTableCell  width="20%" align="left" className="font-bold"> {bill.sum !== undefined ? bill.sum : null}</StyledTableCell>
                   </StyledTableRow>
                   {bill.gstin === ''?
                     <StyledTableRow key={1}>
                       <StyledTableCell component="th" width="15%" scope="row"> </StyledTableCell>
                       <StyledTableCell width="50%" align="left"> </StyledTableCell>
                       <StyledTableCell width="15%" align="left"> </StyledTableCell>
                       <StyledTableCell  width="15%" align="left" className="font-bold">Grand Total </StyledTableCell>
                       <StyledTableCell  width="25%" align="left"></StyledTableCell>
                       <StyledTableCell  width="20%" align="left"className="font-bold"> {bill.total !== undefined ? bill.total : null}</StyledTableCell>
                     </StyledTableRow>
                      :
                     <>
                     <StyledTableRow key={1}>
                       <StyledTableCell component="th" width="15%" scope="row"> </StyledTableCell>
                       <StyledTableCell width="50%" align="left"> </StyledTableCell>
                       <StyledTableCell width="15%" align="left"> </StyledTableCell>
                       <StyledTableCell  width="15%" align="left" className="font-bold">CGST</StyledTableCell>
                       <StyledTableCell  width="25%" align="left"></StyledTableCell>
                       <StyledTableCell  width="20%" align="left"className="font-bold"> {bill.cgst !== undefined ? bill.cgst : null}</StyledTableCell>
                     </StyledTableRow>

                     <StyledTableRow key={1}>
                       <StyledTableCell component="th" width="15%" scope="row"> </StyledTableCell>
                       <StyledTableCell width="50%" align="left"> </StyledTableCell>
                       <StyledTableCell width="15%" align="left"> </StyledTableCell>
                       <StyledTableCell  width="15%" align="left" className="font-bold">SGST</StyledTableCell>
                       <StyledTableCell  width="25%" align="left"></StyledTableCell>
                       <StyledTableCell  width="20%" align="left" className="font-bold"> {bill.sgst !== undefined ? bill.sgst : null}</StyledTableCell>
                     </StyledTableRow>

                     <StyledTableRow key={1}>
                       <StyledTableCell component="th" width="15%" scope="row"> </StyledTableCell>
                       <StyledTableCell width="50%" align="left"> </StyledTableCell>
                       <StyledTableCell width="15%" align="left"> </StyledTableCell>
                       <StyledTableCell  width="15%" align="left" className="font-bold">Grand Total </StyledTableCell>
                       <StyledTableCell  width="25%" align="left"></StyledTableCell>
                       <StyledTableCell  width="20%" align="left" className="font-bold"> {bill.total !== undefined ? bill.total : null}</StyledTableCell>
                     </StyledTableRow>
                     </>
                    }
                  </TableBody>
                </Table>
              </TableContainer>
              :
              <TableContainer style={{ marginTop: "20px" }} component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                 <TableRow>
                    <StyledTableCell width="15%">SR No.</StyledTableCell>
                    <StyledTableCell width="30%">Description</StyledTableCell>
                    <StyledTableCell width="15%">Unit</StyledTableCell>
                    <StyledTableCell width="15%">WO Qty</StyledTableCell>
                    <StyledTableCell width="15%">Previous Qty</StyledTableCell>
                    <StyledTableCell width="15%">Current Qty</StyledTableCell>
                    <StyledTableCell width="15%">Total Qty</StyledTableCell>
                    <StyledTableCell width="30%">RATE</StyledTableCell>
                    <StyledTableCell width="20%">AMOUNT</StyledTableCell>
                 </TableRow>
                </TableHead>
                <TableBody>
                 {bill.boqdata.map((od,id) => (
                    <StyledTableRow key={1}>
                      <StyledTableCell component="th" width="15%" scope="row"> {od.Sr} </StyledTableCell>
                      <StyledTableCell width="30%" align="left"> {od.Description} </StyledTableCell>
                      <StyledTableCell width="15%" align="left"> {od.Unit} </StyledTableCell>
                      <StyledTableCell  width="15%" align="left"> {od.WO} </StyledTableCell>
                      <StyledTableCell  width="15%" align="left"> {od.previous === '' ? od.previous : od.previous.toFixed(2)} </StyledTableCell>
                      <StyledTableCell  width="15%" align="left"> {od.current === '' ? od.current : od.current.toFixed(2) } </StyledTableCell>
                      <StyledTableCell  width="15%" align="left"> {od.current === '' ? (od.previous + od.current) : (od.previous + od.current).toFixed(2)} </StyledTableCell>
                      <StyledTableCell  width="30%" align="left"> {od.Rate} </StyledTableCell>
                      <StyledTableCell  width="20%" align="left"> {od.Amount.toFixed(2)} </StyledTableCell>
                    </StyledTableRow>
                  ))}
                   <StyledTableRow key={1}>
                     <StyledTableCell component="th" width="15%" scope="row"> </StyledTableCell>
                     <StyledTableCell width="30%" align="left"> </StyledTableCell>
                     <StyledTableCell width="15%" align="left"> </StyledTableCell>
                     <StyledTableCell  width="15%" align="left"> </StyledTableCell>
                     <StyledTableCell  width="15%" align="left"> </StyledTableCell>
                     <StyledTableCell  width="15%" align="left" className="font-bold">Total Bill</StyledTableCell>
                     <StyledTableCell  width="15%" align="left"> </StyledTableCell>
                     <StyledTableCell  width="30%" align="left"></StyledTableCell>
                     <StyledTableCell  width="20%" align="left" className="font-bold"> {bill.sum !== undefined ? bill.sum : null}</StyledTableCell>
                   </StyledTableRow>
                  <StyledTableRow key={1}>
                     <StyledTableCell component="th" width="15%" scope="row"> </StyledTableCell>
                     <StyledTableCell width="30%" align="left"> </StyledTableCell>
                     <StyledTableCell width="15%" align="left"> </StyledTableCell>
                     <StyledTableCell  width="15%" align="left"> </StyledTableCell>
                     <StyledTableCell  width="15%" align="left"> </StyledTableCell>
                     <StyledTableCell  width="15%" align="left" className="font-bold">Previous Amount</StyledTableCell>
                     <StyledTableCell  width="15%" align="left"> </StyledTableCell>
                     <StyledTableCell  width="30%" align="left"></StyledTableCell>
                     <StyledTableCell  width="20%" align="left" className="font-bold"> {bill.previousBillAmount !== undefined ? bill.previousBillAmount.toFixed(2) : null}</StyledTableCell>
                   </StyledTableRow>
                   <StyledTableRow key={1}>
                     <StyledTableCell component="th" width="15%" scope="row"> </StyledTableCell>
                     <StyledTableCell width="30%" align="left"> </StyledTableCell>
                     <StyledTableCell width="15%" align="left"> </StyledTableCell>
                     <StyledTableCell  width="15%" align="left"> </StyledTableCell>
                     <StyledTableCell  width="15%" align="left"> </StyledTableCell>
                     <StyledTableCell  width="15%" align="left" className="font-bold">Current Amount</StyledTableCell>
                     <StyledTableCell  width="15%" align="left"> </StyledTableCell>
                     <StyledTableCell  width="30%" align="left"></StyledTableCell>
                     <StyledTableCell  width="20%" align="left" className="font-bold"> {bill.sum !== undefined ? (bill.sum - bill.previousBillAmount).toFixed(2) : null}</StyledTableCell>
                   </StyledTableRow>
                 {bill.gstin === ''?
                   <StyledTableRow key={1}>
                     <StyledTableCell component="th" width="15%" scope="row"> </StyledTableCell>
                     <StyledTableCell width="30%" align="left"> </StyledTableCell>
                     <StyledTableCell width="15%" align="left"> </StyledTableCell>
                     <StyledTableCell width="15%" align="left"> </StyledTableCell>
                     <StyledTableCell width="15%" align="left"> </StyledTableCell>
                     <StyledTableCell width="15%" align="left" className="font-bold">Payable Amount</StyledTableCell>
                     <StyledTableCell width="15%" align="left"> </StyledTableCell>
                     <StyledTableCell width="30%" align="left"> </StyledTableCell>
                     <StyledTableCell width="20%" align="left" className="font-bold"> {bill.total !== undefined ? bill.total.toFixed(2) : null}</StyledTableCell>
                   </StyledTableRow>
                    :
                   <>
                   <StyledTableRow key={1}>
                     <StyledTableCell component="th" width="15%" scope="row"> </StyledTableCell>
                     <StyledTableCell width="30%" align="left"> </StyledTableCell>
                     <StyledTableCell width="15%" align="left"> </StyledTableCell>
                     <StyledTableCell width="15%" align="left"> </StyledTableCell>
                     <StyledTableCell width="15%" align="left"> </StyledTableCell>
                     <StyledTableCell width="15%" align="left" className="font-bold">CGST 9% </StyledTableCell>
                     <StyledTableCell width="15%" align="left"> </StyledTableCell>
                     <StyledTableCell width="30%" align="left"></StyledTableCell>
                     <StyledTableCell width="20%" align="left" className="font-bold"> {bill.cgst !== undefined ? bill.cgst.toFixed(2) : null}</StyledTableCell>
                   </StyledTableRow>

                   <StyledTableRow key={1}>
                     <StyledTableCell component="th" width="15%" scope="row"> </StyledTableCell>
                     <StyledTableCell width="30%" align="left"> </StyledTableCell>
                     <StyledTableCell width="15%" align="left"> </StyledTableCell>
                     <StyledTableCell width="15%" align="left"> </StyledTableCell>
                     <StyledTableCell width="15%" align="left"> </StyledTableCell>
                     <StyledTableCell width="15%" align="left" className="font-bold">SGST 9%</StyledTableCell>
                     <StyledTableCell width="15%" align="left"> </StyledTableCell>
                     <StyledTableCell width="30%" align="left"></StyledTableCell>
                     <StyledTableCell width="20%" align="left" className="font-bold"> {bill.sgst !== undefined ? bill.sgst.toFixed(2) : null}</StyledTableCell>
                   </StyledTableRow>

                   <StyledTableRow key={1}>
                     <StyledTableCell component="th" width="15%" scope="row"> </StyledTableCell>
                     <StyledTableCell width="30%" align="left"> </StyledTableCell>
                     <StyledTableCell width="15%" align="left"> </StyledTableCell>
                     <StyledTableCell width="15%" align="left"> </StyledTableCell>
                     <StyledTableCell width="15%" align="left"> </StyledTableCell>
                     <StyledTableCell width="15%" className="font-bold" align="left">Payable Amount</StyledTableCell>
                     <StyledTableCell width="15%" align="left"> </StyledTableCell> 
                     <StyledTableCell width="30%" align="left"></StyledTableCell>
                     <StyledTableCell width="20%" className="font-bold" align="left"> {bill.total !== undefined ? bill.total.toFixed(2) : null}</StyledTableCell>
                   </StyledTableRow>
                   </>
                  }
                </TableBody>
              </Table>
            </TableContainer>)
            :null}
            <TableRow key={11}>
             <TableCell component="th" className="font-bold" style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
               Grand Total In Words - {bill.wordTotal !== undefined ? bill.wordTotal : null}
             </TableCell>
            </TableRow>

            {bill.pan !== '' || bill.gstin !== '' || bill.hsncode !== '' ? 
            <TableRow key={12}>
             <TableCell component="th" className="font-bold" style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
             PAN NO - {bill.pan === undefined ? null :  bill.pan} {"      "}
             GST NO - {bill.gstin === undefined ? null :  bill.gstin} {"      "}
             HSN CODE - {bill.hsncode === undefined ? null :  bill.hsncode}  {"     "} 
             </TableCell> 
            </TableRow>
            :null}

            <TableRow key={13}>
             <TableCell component="th" className="font-bold" style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
               BANK DETAILS -  
             </TableCell> 
            </TableRow>

            <div class="grid grid-cols-2 divide-x divide-gray-400">
              <TableContainer component={Paper}>
               <Table  aria-label="simple table">
                 <TableBody>
                   <>
                      <TableRow key={1}>
                        <TableCell component="th" style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
                         BANK NAME - {bill.bank_name !== undefined ? bill.bank_name : null}
                       </TableCell>
                      </TableRow>
                      <TableRow key={2}>
                       <TableCell component="th" style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
                         ACCOUNT NO - {bill.account_no !== undefined ? bill.account_no : null} 
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
                       <TableCell component="th" style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
                         BRANCH NAME - {bill.branch_name !== undefined ? bill.branch_name : null}
                       </TableCell>
                     </TableRow>
                     <TableRow key={2}>
                       <TableCell component="th" style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
                         IFSC CODE - {bill.ifsc_code !== undefined ? bill.ifsc_code : null}
                       </TableCell>
                     </TableRow>
                    </> 
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
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

export default Mom;