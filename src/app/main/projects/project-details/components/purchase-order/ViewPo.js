import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Icon,
  Fab
} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { withStyles } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { downloadPO } from 'app/main/projects/store/projectsSlice';
import {  downloadPOPdfReport} from 'app/main/projects/store/projectsSlice';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";


const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  header: {
    minHeight: "100px",
    // maxHeight: "80px",
  },
  container: {
    position: "relative",
  },
  input: {
    color: "white",
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

function ViewPo(props){
  const classes = useStyles();
  const dispatch = useDispatch();
  const projectName = useSelector(({ projects }) => projects.details.title);
  const projectId = useSelector(({ projects }) => projects.details._id);
  const loading = useSelector(({ projects }) => projects.loading);
  const userId = useSelector(({ auth }) => auth.user.data.id)
  const [po, setPO] = useState([]);
  const [poId, setPoId] = useState('');
  const [poOrderNo, setPoOrderNo] = useState()
  const [viewOpen, setViewOpen] = useState(false);
  const [downloadAccess, setDownloadAccess] = useState();
  const team = useSelector(({ projects }) => projects.details.team);
  const role = useSelector(({ auth }) => auth.user);
  const [createAccess, setCreateAccess] = useState();
  const [viewAccess, setViewAccess] = useState();


  let purchaseOrderDetails = props.data;

  function formatOrderNumber(orderNo) {
    const orderSegments = orderNo.split('/');
    const formattedOrderNo = (orderSegments.length >= 2) ? orderSegments.slice(-2).join('/') : "";
    return formattedOrderNo;
  }

  useEffect(() => {
    if (props.open) {
      setViewOpen(true);
      setPoId(props.poId);
      setPoOrderNo(props.orderNo);
      setPO(purchaseOrderDetails)
    }
  }, [props.open]);

  useEffect(() => {
    team.forEach((t) => {
      if ((t._id === role.data.id && t.role === "owner") || role.role === 'admin') {
        setDownloadAccess(true);
        setCreateAccess(true);
        setViewAccess(true);
      } else if (t._id === role.data.id && t.role !== "owner") {
        const member = t.tab_access.filter((i) => i === "Purchase Order");
        setCreateAccess(t.tab_access.includes("Purchase Order") || t.tab_access.includes("Create/Update Purchase Order"));
        setViewAccess(t.tab_access.includes("Purchase Order") || t.tab_access.includes("View Purchase Order"));
        setDownloadAccess(t.tab_access.includes("Purchase Order") || t.tab_access.includes("Download Purchase Order"));

        if (member[0] === "Purchase Order") {
        }
      }
    })
  }, [role.data.id, role.role, team]);

  const handleClose = () => {
    setViewOpen(false);
    props.close();
  };

  function countDecimals (value) {
    if(Math.floor(value) === value) return 0;
    return value.toString().split(".")[1].length || 0;
  }


  
  return (
    <>
       <Dialog fullWidth maxWidth="md" open = {viewOpen}>
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <div style={{ display: "flex", alignItems: "center" }}>
        <DialogTitle id="alert-dialog-title">
            {po.order !== undefined ? (
              <>
                <div>{formatOrderNumber(po.order[0].orderNo)}</div>
              </>
            ) : null}
          </DialogTitle>
        </div>

        <DialogContent className="items-center justify-center">
          <TableContainer component={Paper} style={{ border: '1px solid black', borderBottom: 'none', marginBottom:'25px'}}>
            <Table className={classes.table} aria-label="simple table">
            <TableBody>
              <>
              <TableRow key={1}>
               <TableCell component="th" className="font-bold" style={{ textAlign: "center", fontSize: "20px", borderStyle:'none'}}  variant="h6" scope="row" width="100%">
                 {po.organization !== undefined ? po.organization.name : null}
               </TableCell>
              </TableRow>
              <TableRow key={2}>
               <TableCell component="th" className="font-medium" style={{ textAlign: "center", fontSize: "100%", borderStyle:'ridge', borderBottomWidth:'2px' }}  variant="h6" scope="row" width="100%">
                 {po.organization !== undefined ? po.organization.address : null}
               </TableCell>
              </TableRow>
              <TableRow key={3}>
               <TableCell component="th" className="font-bold" style={{ textAlign: "center", fontSize: "18px", borderStyle:'ridge', borderBottomWidth:'2px' }}  variant="h6" scope="row" width="100%">
                 {po.project !== undefined ? po.project.title : null}
               </TableCell>
              </TableRow>
              <TableRow key={4}>
               <TableCell component="th" className="font-medium" style={{ textAlign: "center", fontSize: "100%", borderStyle:'dotted' }}  variant="h6" scope="row" width="100%">
                 PURCHASE ORDER
               </TableCell>
              </TableRow>
              </> 
            </TableBody>
            </Table>
          </TableContainer>

          <div className="grid grid-cols-2 divide-x divide-gray-400">
          <TableContainer component={Paper} style={{ border: '1px solid black', borderBottom: 'none'}}>
            <Table  aria-label="simple table">
            <TableBody>
              <>
              <TableRow key={1}>
               <TableCell component="th" className="font-bold" style={{ textAlign: "left", fontSize: "100%", borderStyle:'dotted' }}  variant="h6" scope="row" width="100%">
                 TO - {po.Vendor !== undefined && po.Vendor !== null  ? po.Vendor.name : null}
               </TableCell>
              </TableRow>
              <TableRow key={2}>
               <TableCell component="th" style={{ fontSize: "100%",borderStyle:'dotted' }}  variant="h6" scope="row" width="100%">
                 {po.Vendor !== undefined && po.Vendor !== null ? po.Vendor.address : null}
               </TableCell>
              </TableRow>
              <TableRow key={3}>
               <TableCell component="th" className="font-bold" style={{ textAlign: "left", fontSize: "100%", borderStyle:'dotted' }}  variant="h6" scope="row" width="100%">
               Contact No. - {po.Vendor !== undefined && po.Vendor !== null ? po.Vendor.contact.join(' , ') : null}
               </TableCell>
              </TableRow>
              <TableRow key={4}>
               <TableCell component="th" style={{ fontSize: "100%",borderStyle:'dotted' }}  variant="h6" scope="row" width="100%">
                 GSTIN - {po.Vendor !== undefined && po.Vendor !== null  ? po.Vendor.gstin : null}
               </TableCell>
              </TableRow>
              </> 
            </TableBody>
            </Table>
          </TableContainer>
          <TableContainer component={Paper} style={{ border: '1px solid black', borderBottom: 'none', borderLeft:'none'}}>
            <Table aria-label="simple table">
            <TableBody>
              <>
              {/* <TableRow key={1}>
               <TableCell className="font-bold" component="th" style={{ fontSize: "100%", borderStyle:'dotted',borderBottom:'1px solid black' }}  variant="h6" scope="row" width="100%">
                 ORDER NO - {po.order !== undefined ? po.order[0].orderNo : null}
               </TableCell>
              </TableRow> */}
              <TableRow key={2}>
               <TableCell component="th" style={{ fontSize: "100%", borderStyle:'dotted' }}  variant="h6" scope="row" width="100%">
                 ORDER DATE - {po.order !== undefined ? po.order[0].orderDate : null}
               </TableCell>
              </TableRow>
              <TableRow key={3}>
               <TableCell component="th" style={{ fontSize: "100%", borderStyle:'dotted' }}  variant="h6" scope="row" width="100%">
                 QUOTATION - {po.order !== undefined ? po.order[0].quotation : null}
               </TableCell>
              </TableRow>
              <TableRow key={4}>
               <TableCell component="th" style={{ fontSize: "100%", borderStyle:'dotted' }}  variant="h6" scope="row" width="100%">
                 QUOTATION DATE - {po.order !== undefined ? po.order[0].quotationDate : null}
               </TableCell>
              </TableRow>
              </> 
            </TableBody>
            </Table>
          </TableContainer>
          </div>

          {po.order !== undefined ?
            <TableContainer style={{marginTop:'25px',marginBottom:'25px', border: '1px solid black'}} component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell width="15%">SR No.</StyledTableCell>
                    <StyledTableCell width="50%">Inventory</StyledTableCell>
                    <StyledTableCell width="15%">Unit</StyledTableCell>
                    <StyledTableCell width="15%">Quantity</StyledTableCell>
                    <StyledTableCell width="15%">RATE</StyledTableCell>
                    <StyledTableCell width="15%">TRANSPORT</StyledTableCell>
                    <StyledTableCell width="15%">GST</StyledTableCell>
                    <StyledTableCell width="20%">AMOUNT</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                 {po.order[0].orderData.map((od,id) => (
                   <StyledTableRow key={1}>
                     <StyledTableCell component="th" width="15%" scope="row"> {id+1} </StyledTableCell>
                     <StyledTableCell width="50%" align="left"> {od.inventory} </StyledTableCell>
                     <StyledTableCell width="15%" align="left"> {od.unit} </StyledTableCell>
                     <StyledTableCell  width="15%" align="left"> {od.quantity} </StyledTableCell>
                     <StyledTableCell  width="15%" align="left"> {od.rate} </StyledTableCell>
                     <StyledTableCell  width="15%" align="left"> {od.transportAmount} </StyledTableCell>
                     <StyledTableCell  width="10%" align="left"> {od.gst} </StyledTableCell>
                     <StyledTableCell  width="20%" align="left"> {od.amount} </StyledTableCell>
                    </StyledTableRow>
                  ))}
                    <StyledTableRow key={1}>
                      <StyledTableCell component="th" width="15%" scope="row"> </StyledTableCell>
                      <StyledTableCell width="50%" align="left"> </StyledTableCell>
                      <StyledTableCell width="15%" align="left"> </StyledTableCell>
                      <StyledTableCell width="15%" align="left" className="font-bold"> Total </StyledTableCell>
                      <StyledTableCell width="15%" align="left"> </StyledTableCell>
                      <StyledTableCell width="15%" align="left"> </StyledTableCell>
                      <StyledTableCell width="15%" align="left"> </StyledTableCell>
                      <StyledTableCell width="20%" align="left" className="font-bold"> {po.total !== undefined ? countDecimals(po.total) <= 4 ? po.total : Number(po.total).toFixed(4) : null}</StyledTableCell>
                    </StyledTableRow>
                </TableBody>
              </Table>
            </TableContainer>
          :null}

          <TableContainer style={{ border: '1px solid black', borderBottom: 'none', marginBottom:'25px'}} component={Paper}>
            <Table className={classes.table} aria-label="simple table">
            <TableBody>
              <>
              <TableRow key={1}>
               <TableCell component="th" className="font-bold" style={{  fontSize: "100%" }}  variant="h6" scope="row" width="100%">
                Delivery Address :
               </TableCell>
              </TableRow>
              <TableRow key={2}>
               <TableCell component="th" style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
                 {po.project !== undefined ? po.project.location : null}
               </TableCell>
              </TableRow>
              {po.order !== undefined ?
              <TableRow key={3}>
               <TableCell component="th" style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
                 Contact Person -  {po.order[0].siteContactPerson === undefined ? '': po.order[0].siteContactPerson} -
                  {po.order[0].sitePersonNo  === undefined ? '': po.order[0].sitePersonNo }
               </TableCell>
              </TableRow>
              :null}
              </> 
            </TableBody>
            </Table>
          </TableContainer>

          <TableContainer style={{ border: '1px solid black', borderBottom: 'none', marginBottom:'25px'}} component={Paper}>
            <Table className={classes.table} aria-label="simple table">
            <TableBody>
              <>
              <TableRow key={1}>
               <TableCell component="th" className="font-bold" style={{  fontSize: "100%" }}  variant="h6" scope="row" width="100%">
                Billing Address :
               </TableCell>
              </TableRow>
              <TableRow key={2}>
               <TableCell component="th" style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
                 {po.organization !== undefined ? po.organization.name : null}
               </TableCell>
              </TableRow>
              <TableRow key={3}>
               <TableCell component="th" style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
                 {po.organization !== undefined ? po.organization.address : null}
               </TableCell>
         
              </TableRow>
              {po.order !== undefined ?
                <TableRow key={4}>
                 <TableCell component="th" style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
                   Contact Person - { po.order[0].billContactPerson === undefined ? '': po.order[0].billContactPerson} -
                   {po.order[0].billPersonNo === undefined ? '' : po.order[0].billPersonNo} 
                 </TableCell>
                </TableRow>
              :null}
              {po.organization !== undefined ?
              <TableRow key={5}>
               <TableCell component="th" style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
                 Our GSTIN -  { po.organization.gstIn !== undefined ? po.organization.gstIn : null }
               </TableCell>
              </TableRow>
              :null}
              </> 
            </TableBody>
            </Table>
          </TableContainer>

          <TableContainer style={{ border: '1px solid black', borderBottom: 'none', marginBottom:'25px'}} component={Paper}>
           <Table className={classes.table} aria-label="simple table">
             <TableBody>
               <>
                 <TableRow key={1}>
                   <TableCell component="th" className="font-bold" style={{  fontSize: "100%" }}  variant="h6" scope="row" width="100%">
                     Terms & Conditions :
                   </TableCell>
                 </TableRow>
                 <TableRow key={2}>
                   <TableCell component="th"  style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
                     Rates -: {po.order !== undefined ? po.order[0].rates : null}
                   </TableCell>
                 </TableRow>
                 <TableRow key={3}>
                    <TableCell component="th"  style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
                     Delivery -: {po.order !== undefined ? po.order[0].delivery : null}
                    </TableCell>
                 </TableRow>
                 <TableRow key={4}>
                   <TableCell component="th" style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
                     Quality-: {po.order !== undefined ? po.order[0].quality : null}
                   </TableCell>
                 </TableRow>
                 <TableRow key={5}>
                 <TableCell component="th" style={{ fontSize: "100%" }}  variant="h6" scope="row" width="100%">
                   Payment -: {po.order !== undefined ? po.order[0].payment : null}
                 </TableCell>
                </TableRow>
               </> 
             </TableBody>
           </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
        {downloadAccess === true && (
          <Fab 
          color="primary" 
          aria-label="print"
          >
            <DownloadIcon onClick={()=> dispatch(downloadPO({ projectId, projectName, purchaseId: poId, orderNo : poOrderNo }))}/>
          </Fab>
          )}

<Fab color="primary" aria-label="print">
            <Icon onClick={() =>dispatch(downloadPOPdfReport({ projectId, projectName, purchaseId: poId, orderNo : poOrderNo }))}>
              <PictureAsPdfIcon />
            </Icon>
          </Fab>

          <Button onClick={() => handleClose()} variant="contained" color="primary">
            CLOSE
          </Button>
        </DialogActions>
      </Dialog>
    </>
   
  )
}

export default ViewPo;