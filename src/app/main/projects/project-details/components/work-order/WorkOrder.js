import React, { useState, useEffect } from "react";
import { makeStyles, withStyles, } from "@material-ui/core/styles";
import { Fab, Icon, Button } from "@material-ui/core";
import FuseAnimate from "@fuse/core/FuseAnimate";
import FuseLoading from "@fuse/core/FuseLoading";
import { useDispatch, useSelector } from "react-redux";
import ReactTable from "react-table-6";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import WorkOrderDialog from "./WorkOrderDialog";
import { Backdrop } from "@material-ui/core";
import {
  downloadWO,
  openNewDialog,
  openEditDialog,
  detailWorkOrder,
  viewWO
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

function WorkOrder(props) {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const workOrders = useSelector(({ projects }) => projects.workOrders.workOrderList);
  const projectId = useSelector(({ projects }) => projects.details._id);
  const loading = useSelector(({ projects }) => projects.loading);
  const [access, setAccess] = useState();
  const team = useSelector(({ projects }) => projects.details.team);
  const role = useSelector(({ auth }) => auth.user);
  const projectName = useSelector(({ projects }) => projects.details.title);
  const [wo, setWO] = useState([]);
  const [viewOpen, setViewOpen] = useState(false);

  useEffect(() => {
    team.forEach((t) => {
      if ((t._id === role.data.id && t.role === "owner") || role.role === 'admin') {
        setAccess(true)
      } else if (t._id === role.data.id && t.role !== "owner") {
        const member = t.tab_access.filter((i) => i === "Work Order");
        if (member[0] === "Work Order") {
          setAccess(true)
        }
      }
    })
  }, [access, role.data.id, role.role, team]);


  if (!workOrders) {
    return <FuseLoading />;
  }

  const downloadWOReport = (workOrderDetails) => {
    let workId = workOrderDetails.id;
    let orderNo = workOrderDetails.orderNo;

    dispatch(downloadWO({ projectId, projectName, workId, orderNo, })).then((response) => {
    });
  }

  const viewWOReport = (workOrderDetails) => {
    let workId = workOrderDetails.id;
    let orderNo = workOrderDetails.orderNo;
    dispatch(viewWO({ projectId, projectName, workId, orderNo })).then((response) => {
      setWO(response.payload);
      setViewOpen(true);
    });
  }

  const openDialog = (data) => {
    let workId = data.id;
    dispatch(detailWorkOrder({ projectId, workId })).then((response) => {
      dispatch(openEditDialog(data));
    });
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
          <Typography className="text-16 font-bold">Work Order</Typography>
          {access ?
            <Button color="primary" onClick={() => dispatch(openNewDialog())} variant="contained" className="mb-8" style={{ padding: '3px 16px' }} nowrap="true">Add WO</Button>
            : null}
        </div>
        <FuseAnimate animation="transition.slideUpIn" delay={100}>
          <ReactTable
            className={classes.root}
            getTrProps={(state, rowInfo, column) => {
              return {
                className: "-striped -highlight items-center justify-center",
              };
            }}
            data={workOrders}
            defaultFilterMethod={(filter, row) => filterCaseInsensitive(filter, row)}
            columns={[
              {
                Header: "Order No",
                style: { 'white-space': 'unset' },
                filterable: true,
                accessor: "orderNo",
                Cell: ({ row }) => (
                  <a
                    className="cursor-pointer text-wrap"
                    onClick={access ? () => {
                      openDialog(row._original)
                    } : () => dispatchWarningMessage(dispatch, "You don't have access to view or update work order.")}
                  >
                    {row.orderNo}
                  </a>
                ),
                className: "font-bold",
              },
              {
                Header: "Order Date",
                accessor: "orderDate",
                filterable: true,
                style: { 'white-space': 'unset' },
              },
              {
                Header: "Quotation Date",
                accessor: "quotationDate",
                filterable: true,
                className: "justify-center",
              },
              {
                Header: "Contractor",
                accessor: "contractor",
                filterable: true,
                style: { 'white-space': 'unset' },
              },
              {
                Header: 'Download WO / View WO',
                style: { 'white-space': 'unset' },
                id: 'download_wo',
                accessor: "downloadWO",
                Cell: ({ row }) => (
                  <>
                    <a
                      className="cursor-pointer"
                      onClick={access ? () => {
                        downloadWOReport(row._original)
                      } : () => dispatchWarningMessage(dispatch, "You don't have access to download Work Order.")}
                    >
                      Download
                    </a>
                    <span> / </span>
                    <a
                      className="cursor-pointer"
                      onClick={access ? () => {
                        viewWOReport(row._original)
                      } : () => dispatchWarningMessage(dispatch, "You don't have access to view WO.")}
                    >
                      View
                    </a>
                  </>
                ),
                className: 'font-bold',
              }
            ]}
            defaultPageSize={10}
            noDataText="No work Order Found"
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
            disabled={access === true ? false : true}
            onClick={() => {
              dispatch(openNewDialog())
            }}
          >
            <Icon>add</Icon>
          </Fab>
        </FuseAnimate>

      </Paper>

      <WorkOrderDialog />

      <Dialog
        fullWidth maxWidth="md"
        open={viewOpen}
      >
        <DialogTitle id="alert-dialog-title">{wo.order !== undefined ? wo.order[0].orderNo : null}</DialogTitle>
        <DialogContent className="items-center justify-center">
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableBody>
                <>
                  <TableRow key={1}>
                    <TableCell component="th" className="font-bold" style={{ textAlign: "center", fontSize: "100%" }} variant="h6" scope="row" width="100%">
                      {wo.organization !== undefined ? wo.organization.name : null}
                    </TableCell>
                  </TableRow>
                  <TableRow key={2}>
                    <TableCell component="th" className="font-bold" style={{ textAlign: "center", fontSize: "100%" }} variant="h6" scope="row" width="100%">
                      {wo.organization !== undefined ? wo.organization.address : null}
                    </TableCell>
                  </TableRow>
                  <TableRow key={3}>
                    <TableCell component="th" className="font-bold" style={{ textAlign: "center", fontSize: "100%" }} variant="h6" scope="row" width="100%">
                      {wo.project !== undefined ? wo.project.title : null}
                    </TableCell>
                  </TableRow>
                  <TableRow key={2}>
                    <TableCell component="th" className="font-bold" style={{ textAlign: "center", fontSize: "100%" }} variant="h6" scope="row" width="100%">
                      WORK ORDER
                    </TableCell>
                  </TableRow>
                  <TableRow key={2}>
                    <TableCell component="th" style={{ textAlign: "left", fontSize: "100%" }} variant="h6" scope="row" width="100%">
                    <strong>SUBJECT</strong> : {wo.fetchedWorkOrder && wo.fetchedWorkOrder.length > 0 ? wo.fetchedWorkOrder[0].subject : null}
                    </TableCell>
                  </TableRow>


                </>
              </TableBody>
            </Table>
          </TableContainer>
          <div class="grid grid-cols-2 divide-x divide-gray-400">
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableBody>
                  <>
                    <TableRow key={1}>
                      <TableCell component="th" style={{ textAlign: "center", fontSize: "100%" }} variant="h6" scope="row" width="100%">
                        TO - {wo.Vendor !== undefined && wo.Vendor !== null ? wo.Vendor.name : null}
                      </TableCell>
                    </TableRow>
                    <TableRow key={2}>
                      <TableCell component="th" multiline rows={2} style={{ fontSize: "100%" }} variant="h6" scope="row" width="100%">
                        {wo.Vendor !== undefined && wo.Vendor !== null ? wo.Vendor.address : null}
                      </TableCell>
                    </TableRow>
                    <TableRow key={3}>
                      <TableCell component="th" style={{ fontSize: "100%" }} variant="h6" scope="row" width="100%">
                        GSTIN - {wo.Vendor !== undefined && wo.Vendor !== null ? wo.Vendor.gstin : null}
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
                      <TableCell component="th" style={{ fontSize: "100%" }} variant="h6" scope="row" width="100%">
                        ORDER NO - {wo.order !== undefined ? wo.order[0].orderNo : null}
                      </TableCell>
                    </TableRow>
                    <TableRow key={2}>
                      <TableCell component="th" style={{ fontSize: "100%" }} variant="h6" scope="row" width="100%">
                        ORDER DATE - {wo.order !== undefined ? wo.order[0].orderDate : null}
                      </TableCell>
                    </TableRow>
                    <TableRow key={3}>
                      <TableCell component="th" style={{ fontSize: "100%" }} variant="h6" scope="row" width="100%">
                        QUOTATION - {wo.order !== undefined ? wo.order[0].quotation : null}
                      </TableCell>
                    </TableRow>
                    <TableRow key={4}>
                      <TableCell component="th" style={{ fontSize: "100%" }} variant="h6" scope="row" width="100%">
                        QUOTATION DATE - {wo.order !== undefined ? wo.order[0].quotationDate : null}
                      </TableCell>
                    </TableRow>
                  </>
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          {wo.order !== undefined ?
            <TableContainer style={{ marginTop: "20px", marginBottom: '25px', border: '1px solid black', borderBottom: 'none' }} component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell width="15%">SR No.</StyledTableCell>
                    <StyledTableCell width="50%">Work</StyledTableCell>
                    <StyledTableCell width="10%">Unit</StyledTableCell>
                    <StyledTableCell width="10%">Quantity</StyledTableCell>
                    <StyledTableCell width="10%">RATE</StyledTableCell>
                    <StyledTableCell width="20%">AMOUNT</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {wo.order[0].orderData.map((od, id) => (
                    <StyledTableRow key={1}>
                      <StyledTableCell component="th" width="15%" scope="row"> {id + 1} </StyledTableCell>
                      <StyledTableCell width="50%" align="left"> {od.work} </StyledTableCell>
                      <StyledTableCell width="10%" align="left"> {od.unit} </StyledTableCell>
                      <StyledTableCell width="10%" align="left"> {od.quantity} </StyledTableCell>
                      <StyledTableCell width="10%" align="left"> {od.rate} </StyledTableCell>
                      <StyledTableCell width="20%" align="left"> {od.amount} </StyledTableCell>
                    </StyledTableRow>
                  ))}
                  <StyledTableRow key={1}>
                    <StyledTableCell component="th" width="15%" scope="row"> </StyledTableCell>
                    <StyledTableCell width="50%" align="left"> </StyledTableCell>
                    <StyledTableCell width="10%" align="left"> </StyledTableCell>
                    <StyledTableCell width="10%" align="left"> Total </StyledTableCell>
                    <StyledTableCell width="10%" align="left"> </StyledTableCell>
                    <StyledTableCell width="20%" align="left"> {wo.total !== undefined ? wo.total : null}</StyledTableCell>
                  </StyledTableRow>
                </TableBody>
              </Table>
            </TableContainer>
            : null}

          <TableContainer style={{ border: '1px solid black', borderBottom: 'none', marginBottom: '25px' }} component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableBody>
                <TableRow key={1}>
                  <TableCell component="th" className="font-bold" style={{ fontSize: "100%" }} variant="h6" scope="row" width="100%">
                    Scope of Work :
                  </TableCell>
                </TableRow>
                {wo.fetchedWorkOrder && wo.fetchedWorkOrder[0].scopeOfWork && wo.fetchedWorkOrder[0].scopeOfWork.map((item, index) => (
                  <TableRow key={index + 2}>
                    <TableCell component="th" style={{ fontSize: "100%" }} variant="h6" scope="row" width="100%">
                      {`${index + 1}.) ${item.description}`}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>


          <TableContainer style={{ border: '1px solid black', borderBottom: 'none', marginBottom: '25px' }} component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableBody>
                <TableRow key={1}>
                  <TableCell component="th" className="font-bold" style={{ fontSize: "100%" }} variant="h6" scope="row" width="100%">
                    Terms & Conditions :
                  </TableCell>
                </TableRow>
                {wo.fetchedWorkOrder && wo.fetchedWorkOrder[0].termsAndConditions && wo.fetchedWorkOrder[0].termsAndConditions.map((item, index) => (
                  <TableRow key={index + 2}>
                    <TableCell component="th" style={{ fontSize: "100%" }} variant="h6" scope="row" width="100%">
                      {`${index + 1}.) ${item.description}`}
                    </TableCell>
                  </TableRow>
                ))}
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

export default WorkOrder;