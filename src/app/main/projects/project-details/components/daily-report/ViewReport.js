import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
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
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import { downloadPdfDailyReport } from 'app/main/projects/store/projectsSlice';
import {
  approveReport,
  getDetailReport,
  openEditDialog,
} from "app/main/projects/store/projectsSlice";

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
  // head: {
  //   backgroundColor: theme.palette.common.black,
  //   color: theme.palette.common.white,
  // },
  body: {
    fontSize: 14,
  },
  root: {
    borderBottom: 'none'
  }
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    // "&:nth-of-type(odd)": {
    //   backgroundColor: theme.palette.action.hover,
    // },
  },
}))(TableRow);

function ViewReport(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const projectName = useSelector(({ projects }) => projects.details.title);
  const projectId = useSelector(({ projects }) => projects.details._id);
  const loading = useSelector(({ projects }) => projects.loading);
  const userId = useSelector(({ auth }) => auth.user.data.id)
  const [open, setOpen] = useState(props.open)
  const [status, setStatus] = useState("")
  const team = useSelector(({ projects }) => projects.details.team);
  const [access, setAccess] = useState();
  const user = useSelector(({ auth }) => auth.user);
  const [parent, setParent] = useState('');
  const projectDialog = useSelector(({ projects }) => projects.projectDialog);

  let dailyData = props.data;

  useEffect(() => {
    if (props.open) {
      setOpen(true);
    }
    if (dailyData.data) {
      setStatus(dailyData.data.status)
      setParent(props.from)

    }
  }, [props.open, dailyData]);

  useEffect(() => {
    team.map((t) => {
      if ((t._id === user.data.id && (t.role === "owner" || t.role === 'Purchase Officer')) || user.role === 'admin') {
        setAccess(true)
      } else if (t._id === user.data.id && t.role !== "owner") {
        setAccess(t.tab_access.includes("Approve / Revert Daily Data"));
      }
    })
  }, [access]);

  const handleClose = () => {
    setOpen(false);
    props.close();
  };


  const downloadAsPDF = () => {
    if (dailyData.data !== undefined) {
      dispatch(
        downloadPdfDailyReport({
          projectId,
          reportId: dailyData.data.reportId,
          projectName,
          date: dailyData.data.reportedDate,
          userId
        })
      );
    }
  }

  // let existingAttachments, orgType = '';
  // if(details === undefined || details === null){
  //   orgType = '';
  // }else{
  //   orgType = details.orgType === undefined || details.orgType === null ? '' : details.orgType
  // }

  // if (detailReport) {
  //   existingAttachments = JSON.parse(JSON.stringify(detailReport.attachments));
  //   existingAttachments.forEach((item) => {
  //     if (item._id) {
  //       let id = attachment.find((att) => att._id === item._id);
  //       if (id) {
  //         existingAttachmentsData.push(item);
  //       } else {
  //         item.delete = true;
  //         existingAttachmentsData.push(item);
  //       }
  //     }
  //   });
  // }

  // function closeComposeDialog() {
  //   projectDialog.Dialogtype === "edit"
  //     ? dispatch(closeEditDialog())
  //     : dispatch(closeNewDialog());
  //   dispatch(clearStates());
  //   setFiles([]);
  //   setSelectedDate(new Date());
  //   setUpdate(false);
  // }



  return (
    <>
      <Dialog maxWidth="md" open={open}>
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color='inherit' />
        </Backdrop>
        {dailyData.data !== undefined ?
          <DialogTitle id="alert-dialog-title" style={{ textAlign: 'center', border: 'solid 2px', marginRight: '25px', marginLeft: '20px', marginTop: '10px' }}>Daily Progress Report For {projectName} - {dailyData.data.reportedDate}</DialogTitle>
          :
          <DialogTitle id="alert-dialog-title" style={{ textAlign: 'center', border: 'solid 2px', marginRight: '25px', marginLeft: '20px', marginTop: '10px' }}>Daily Progress Report For {projectName}</DialogTitle>
        }
        <DialogContent className="items-center justify-center" >
          <div>
            <div style={{ border: "solid 2px", borderBottom: 'none' }}>
              <Typography
                style={{ textAlign: "center", borderBottom: 'solid 2px' }}
                variant="h6"
                id="tableTitle"
                component="div"
              >
                Labor At Site
              </Typography>
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="Labor Table">
                  <TableHead>
                    <TableRow style={{ borderBottom: 'groove' }}>
                      <StyledTableCell width="25%" align="left">Agency</StyledTableCell>
                      <StyledTableCell width="20%" align="left">Role</StyledTableCell>
                      <StyledTableCell width="15%" align="left">Labor Count</StyledTableCell>
                      <StyledTableCell width="15%" align="left">Hours</StyledTableCell>
                      <StyledTableCell width="50%" align="left">Description</StyledTableCell>
                    </TableRow>
                  </TableHead>
                </Table>
              </TableContainer>
              {dailyData.data !== undefined ? (
                dailyData.labour.length > 0 ? (
                  dailyData.labour.map((lb, id) => (
                    <>
                      <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="Labor Table">
                          <TableBody>
                            <StyledTableRow style={{ borderBottom: 'ridge' }} key={lb.index}>
                              <StyledTableCell width="25%" align="left" component="th" scope="row">
                                {lb.agency}
                              </StyledTableCell>
                              <StyledTableCell width="20%" align="left">
                                {lb.role}
                              </StyledTableCell>
                              <StyledTableCell width="15%" align="left">
                                {lb.labourCount}
                              </StyledTableCell>
                              <StyledTableCell width="15%" align="left">
                                {lb.hours}
                              </StyledTableCell>
                              <StyledTableCell width="50%" align="left">
                                {lb.description}
                              </StyledTableCell>
                            </StyledTableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </>
                  ))
                ) :
                  <TableContainer className="pageBreakInside-avoid" component={Paper}>
                    <Table className={classes.table} aria-label="Labor Table">
                      <TableBody>
                        <StyledTableRow style={{ borderBottom: 'ridge' }} key={1}>
                          <Typography style={{ textAlign: "center" }} variant="h6" id="tableTitle" component="div">
                            NIL
                          </Typography>
                        </StyledTableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
              )
                : null}
            </div>
            <div style={{ border: "solid 2px", borderBottom: 'none' }}>
              <Typography
                style={{ textAlign: "center", borderBottom: 'solid 2px' }}
                variant="h6"
                id="tableTitle"
                component="div"
              >
                Equipment At Site
              </Typography>
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="Equipment Table">
                  <TableHead>
                    <TableRow style={{ borderBottom: 'groove' }}>
                      <StyledTableCell width="25%" align="left">Agency</StyledTableCell>
                      <StyledTableCell width="20%" align="left">Machinery Type</StyledTableCell>
                      <StyledTableCell width="15%" align="left">Count X Hours</StyledTableCell>
                      <StyledTableCell width="15%" align="left">Output</StyledTableCell>
                      <StyledTableCell width="50%" align="left">Description</StyledTableCell>
                    </TableRow>
                  </TableHead>
                </Table>
              </TableContainer>
              {dailyData.data !== undefined ? (
                dailyData.equipment.length > 0 ? (
                  dailyData.equipment.map((eq, id) => (
                    <>
                      <TableContainer className="pageBreakInside-avoid" component={Paper}>
                        <Table className={classes.table} aria-label="Equipment Table">
                          <TableBody >
                            <StyledTableRow style={{ borderBottom: 'ridge' }} key={eq.index}>
                              <StyledTableCell width="25%" align="left" component="th" scope="row">
                                {eq.agency}
                              </StyledTableCell>
                              <StyledTableCell width="20%" align="left">
                                {eq.machinery_type}
                              </StyledTableCell>
                              <StyledTableCell width="15%" align="left">
                                {eq.Count + " X " + eq.hours}
                              </StyledTableCell>
                              <StyledTableCell width="15%" align="left">
                                {eq.output}
                              </StyledTableCell>
                              <StyledTableCell width="50%" align="left">
                                {eq.description}
                              </StyledTableCell>
                            </StyledTableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </>
                  ))
                ) :
                  <TableContainer className="pageBreakInside-avoid" component={Paper}>
                    <Table className={classes.table} aria-label="Equipment Table">
                      <TableBody >
                        <StyledTableRow style={{ borderBottom: 'ridge' }} key={1}>
                          <Typography style={{ textAlign: "center" }} variant="h6" id="tableTitle" component="div">
                            NIL
                          </Typography>
                        </StyledTableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
              )
                : null}
            </div>

            <div style={{ border: "solid 2px", borderBottom: 'none' }}>
              <Typography
                style={{ textAlign: "center", borderBottom: 'solid 2px' }}
                variant="h6"
                id="tableTitle"
                component="div"
              >
                Inventory At Site
              </Typography>
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="Inventory Table">
                  <TableHead>
                    <TableRow style={{ borderBottom: 'groove' }}>
                      <StyledTableCell width="25%" align="left">Inventory Item/Unit</StyledTableCell>
                      <StyledTableCell width="20%" align="left">Opening Balance</StyledTableCell>
                      <StyledTableCell width="15%" align="left">Received Quantity</StyledTableCell>
                      <StyledTableCell width="15%" align="left">Consumed Quantity</StyledTableCell>
                      <StyledTableCell width="50%" align="left">Closing Balance</StyledTableCell>
                    </TableRow>
                  </TableHead>
                </Table>
              </TableContainer>
              {dailyData.data !== undefined ? (
                dailyData.balanceReport.length > 0 ? (
                  dailyData.balanceReport.map((inv, id) => (
                    <>
                      <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="Inventory Table">
                          <TableBody >
                            <StyledTableRow style={{ borderBottom: 'ridge' }} key={inv.index}>
                              <StyledTableCell width="25%" align="left" component="th" scope="row">
                                {inv.item}
                              </StyledTableCell>
                              <StyledTableCell width="20%" align="left">
                              {Number.isInteger(inv.open) ? inv.open : Number(inv.open).toFixed(2)}
                              </StyledTableCell>
                              <StyledTableCell width="15%" align="left">
                                {inv.received}
                              </StyledTableCell>
                              <StyledTableCell width="15%" align="left">
                                {Number.isInteger(inv.consumed) ? inv.consumed : Number(inv.consumed).toFixed(2)}
                              </StyledTableCell>
                              <StyledTableCell width="50%" align="left">
                                {inv.close}
                              </StyledTableCell>
                            </StyledTableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </>
                  ))
                ) :
                  <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="Inventory Table">
                      <TableBody >
                        <StyledTableRow style={{ borderBottom: 'ridge' }} key={1}>
                          <Typography style={{ textAlign: "center" }} variant="h6" id="tableTitle">
                            NIL
                          </Typography>
                        </StyledTableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
              )
                : null}
            </div>
            <div style={{ border: "solid 2px", borderBottom: 'none' }}>
              <Typography
                style={{ textAlign: "center", borderBottom: 'solid 2px' }}
                variant="h6"
                id="tableTitle"
                component="div"
              >
                Hindrance
              </Typography>
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="Hindrance Table">
                  <TableHead>
                    <TableRow style={{ borderBottom: 'groove' }}>
                      <StyledTableCell width="25%" align="left">Type</StyledTableCell>
                      <StyledTableCell width="50%" align="left">Description</StyledTableCell>
                    </TableRow>
                  </TableHead>
                </Table>
              </TableContainer>
              {dailyData.data !== undefined ? (
                dailyData.hindrance.length > 0 ? (
                  dailyData.hindrance.map((hin, id) => (
                    <>
                      <TableContainer className="pageBreakInside-avoid" component={Paper}>
                        <Table className={classes.table} aria-label="Hindrance Table">
                          <TableBody >
                            <StyledTableRow style={{ borderBottom: 'ridge' }} key={hin.index}>
                              <StyledTableCell width="25%" align="left" component="th" scope="row">
                                {hin.selectedtype}
                              </StyledTableCell>
                              <StyledTableCell width="50%" align="left">
                                {hin.description}
                              </StyledTableCell>
                            </StyledTableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </>
                  ))
                ) :
                  <TableContainer className="pageBreakInside-avoid" component={Paper}>
                    <Table className={classes.table} aria-label="Hindrance Table">
                      <TableBody >
                        <StyledTableRow style={{ borderBottom: 'ridge' }} key={1}>
                          <Typography style={{ textAlign: "center" }} variant="h6" id="tableTitle" component="div">
                            NIL
                          </Typography>
                        </StyledTableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
              )
                : null}
            </div>

            <div style={{ border: "solid 2px", borderBottom: 'none' }}>
              <Typography
                style={{ textAlign: "center", borderBottom: 'solid 2px' }}
                variant="h6"
                id="tableTitle"
                component="div"
              >
                Site Visitor
              </Typography>
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="SiteVisitorTable">
                  <TableHead>
                    <TableRow style={{ borderBottom: 'groove' }}>
                      <StyledTableCell width="25%" align="left">Name</StyledTableCell>
                      <StyledTableCell width="25%" align="left">Designation</StyledTableCell>
                      <StyledTableCell width="50%" align="left">Purpose</StyledTableCell>
                    </TableRow>
                  </TableHead>
                </Table>
              </TableContainer>
              {dailyData.data !== undefined ? (
                dailyData.sitevisitors.length > 0 ? (
                  dailyData.sitevisitors.map((sv, id) => (
                    <>
                      <TableContainer className="pageBreakInside-avoid" component={Paper}>
                        <Table className={classes.table} aria-label="SiteVisitorTable">
                          <TableBody >
                            <StyledTableRow style={{ borderBottom: 'ridge' }} key={sv.index}>
                              <StyledTableCell width="25%" align="left" component="th" scope="row">
                                {sv.name}
                              </StyledTableCell>
                              <StyledTableCell width="25%" align="left" component="th" scope="row">
                                {sv.designation}
                              </StyledTableCell>
                              <StyledTableCell width="50%" align="left">
                                {sv.purpose}
                              </StyledTableCell>
                            </StyledTableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </>
                  ))
                ) :
                  <TableContainer className="pageBreakInside-avoid" component={Paper}>
                    <Table className={classes.table} aria-label="SiteVisitorTable">
                      <TableBody >
                        <StyledTableRow style={{ borderBottom: 'ridge' }} key={1}>
                          <Typography style={{ textAlign: "center" }} variant="h6" id="tableTitle" component="div">
                            NIL
                          </Typography>
                        </StyledTableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
              )
                : null}
            </div>

            <div style={{ border: "solid 2px", borderBottom: 'none' }}>
              <Typography
                style={{ textAlign: "center", borderBottom: 'solid 2px' }}
                variant="h6"
                id="tableTitle"
                component="div"
              >
                Staff
              </Typography>
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="StaffTable">
                  <TableHead>
                    <TableRow style={{ borderBottom: 'groove' }}>
                      <StyledTableCell width="25%" align="left">Name</StyledTableCell>
                      <StyledTableCell width="25%" align="left">Designation</StyledTableCell>
                      <StyledTableCell width="50%" align="left">Status</StyledTableCell>
                    </TableRow>
                  </TableHead>
                </Table>
              </TableContainer>
              {dailyData.data !== undefined ? (
                dailyData.staffs.length > 0 ? (
                  dailyData.staffs.map((sv, id) => (
                    <>
                      <TableContainer className="pageBreakInside-avoid" component={Paper}>
                        <Table className={classes.table} aria-label="StaffTable">
                          <TableBody >
                            <StyledTableRow style={{ borderBottom: 'ridge' }} key={sv.index}>
                              <StyledTableCell width="25%" align="left" component="th" scope="row">
                                {sv.name}
                              </StyledTableCell>
                              <StyledTableCell width="25%" align="left" component="th" scope="row">
                                {sv.designation}
                              </StyledTableCell>
                              <StyledTableCell width="50%" align="left">
                                {sv.status}
                              </StyledTableCell>
                            </StyledTableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </>
                  ))
                ) :
                  <TableContainer className="pageBreakInside-avoid" component={Paper}>
                    <Table className={classes.table} aria-label="StaffTable">
                      <TableBody >
                        <StyledTableRow style={{ borderBottom: 'ridge' }} key={1}>
                          <Typography style={{ textAlign: "center" }} variant="h6" id="tableTitle" component="div">
                            NIL
                          </Typography>
                        </StyledTableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
              )
                : null}
            </div>

            <div style={{ border: "solid 2px", borderBottom: 'none' }}>
              <Typography
                style={{ textAlign: "center", borderBottom: 'solid 2px' }}
                variant="h6"
                id="tableTitle"
                component="div"
              >
                Notes
              </Typography>
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="Notes Table">
                  <TableHead>
                    <TableRow style={{ borderBottom: 'groove' }}>
                      <StyledTableCell width="25%" align="left">Title</StyledTableCell>
                      <StyledTableCell width="50%" align="left">Description</StyledTableCell>
                    </TableRow>
                  </TableHead>
                </Table>
              </TableContainer>
              {dailyData.data !== undefined ? (
                dailyData.notes.length > 0 ? (
                  dailyData.notes.map((nt, id) => (
                    <>
                      <TableContainer className="pageBreakInside-avoid" component={Paper}>
                        <Table className={classes.table} aria-label="Notes Table">
                          <TableBody >
                            <StyledTableRow style={{ borderBottom: 'ridge' }} key={nt.index}>
                              <StyledTableCell width="25%" align="left" component="th" scope="row">
                                {nt.title}
                              </StyledTableCell>
                              <StyledTableCell width="50%" align="left" component="th" scope="row">
                                {nt.description}
                              </StyledTableCell>
                            </StyledTableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </>
                  ))
                ) :
                  <TableContainer className="pageBreakInside-avoid" component={Paper}>
                    <Table className={classes.table} aria-label="Notes Table">
                      <TableBody >
                        <StyledTableRow style={{ borderBottom: 'ridge' }} key={1}>
                          <Typography style={{ textAlign: "center" }} variant="h6" id="tableTitle" component="div">
                            NIL
                          </Typography>
                        </StyledTableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
              )
                : null}
            </div>

            <div style={{ border: "solid 2px", borderBottom: 'none' }}>
              <Typography
                style={{ textAlign: "center", borderBottom: 'solid 2px' }}
                variant="h6"
                id="tableTitle"
                component="div"
              >
                Attachments
              </Typography>
              {/* <TableContainer component={Paper}>
             <Table className={classes.table} aria-label="Attachment Table">
               <TableHead>
                 <TableRow>
                   <StyledTableCell width="25%" align="left">Name</StyledTableCell>
                   <StyledTableCell width="50%" align="left">URL</StyledTableCell>
                 </TableRow>
               </TableHead>
             </Table>
           </TableContainer> */}
              {dailyData.data !== undefined ? (
                dailyData.attachments.length > 0 ? (
                  dailyData.attachments.map((att, id) => (
                    <>
                      <TableContainer className="pageBreakInside-avoid" component={Paper}>
                        <Table className={classes.table} aria-label="Attachment Table">
                          <TableBody >
                            <StyledTableRow style={{ borderBottom: 'ridge' }} key={att.index}>
                              <StyledTableCell width="100%" align="center" style={{ padding: '2px' }} component="th" scope="row">
                                {att.name}
                              </StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow key={att.index}>
                              {att.url.split('.').pop() === "jpeg" || att.url.split('.').pop() === "png" || att.url.split('.').pop() === "jpg" ?
                                <StyledTableCell width="100" align="center" textAlign='center' style={{ borderBottom: 'ridge' }} component="th" scope="row">
                                  <center> <img src={att.url} style={{ width: '400px', height: '300px' }} /></center>
                                </StyledTableCell>
                                : <StyledTableCell width="100" align="center" style={{ borderBottom: 'ridge' }} component="th" scope="row">
                                  {att.url}
                                </StyledTableCell>
                              }

                            </StyledTableRow>

                          </TableBody>
                        </Table>
                      </TableContainer>
                    </>
                  ))
                ) :
                  <TableContainer className="pageBreakInside-avoid" component={Paper}>
                    <Table className={classes.table} aria-label="Attachment Table">
                      <TableBody >
                        <StyledTableRow style={{ borderBottom: 'ridge' }} key={1}>
                          <Typography style={{ textAlign: "center" }} variant="h6" id="tableTitle" component="div">
                            NIL
                          </Typography>
                        </StyledTableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
              )
                : null}
            </div>

            <div style={{ border: "solid 2px" }}>
              <Typography
                style={{ textAlign: "center", borderBottom: 'solid 2px' }}
                variant="h6"
                id="tableTitle"
                component="div"
              >
                Work Progress
              </Typography>
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="Labor Table">
                  <TableHead>
                    <TableRow style={{ borderBottom: 'groove' }}>
                      <StyledTableCell width="25%" align="left">Item</StyledTableCell>
                      <StyledTableCell width="20%" align="left">Plan Qty</StyledTableCell>
                      <StyledTableCell width="15%" align="left">Executed Qty</StyledTableCell>
                      <StyledTableCell width="15%" align="left">Percentage</StyledTableCell>
                      <StyledTableCell width="15%" align="left">Till Executed </StyledTableCell>
                      <StyledTableCell width="50%" align="left">Description</StyledTableCell>
                    </TableRow>
                  </TableHead>
                </Table>
              </TableContainer>
              {dailyData.data !== undefined ? (
                dailyData.workProgress.length > 0 ? (
                  dailyData.workProgress.map((wp, id) => (
                    <>
                      <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="Work Progress Table">
                          <TableBody>
                            <StyledTableRow style={{ borderBottom: 'ridge' }} key={wp.index}>
                              <StyledTableCell width="25%" align="left" component="th" scope="row">
                                {wp.title}
                              </StyledTableCell>
                              <StyledTableCell width="20%" align="left">
                                {wp.planQty}
                              </StyledTableCell>
                              <StyledTableCell width="15%" align="left">
                                {wp.executedQty}
                              </StyledTableCell>
                              <StyledTableCell width="15%" align="left">
                                {wp.percentage}
                              </StyledTableCell>
                              <StyledTableCell width="15%" align="left">
                                {Number.isInteger(wp.tillexecuted) ? wp.tillexecuted : Number(wp.tillexecuted).toFixed(2)}
                              </StyledTableCell>
                              <StyledTableCell width="50%" align="left">
                                {wp.description}
                              </StyledTableCell>
                            </StyledTableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </>
                  ))
                ) :
                  <TableContainer className="pageBreakInside-avoid" component={Paper}>
                    <Table className={classes.table} aria-label="Work Progress Table">
                      <TableBody>
                        <StyledTableRow style={{ borderBottom: 'ridge' }} key={1}>
                          <Typography style={{ textAlign: "center" }} variant="h6" id="tableTitle" component="div">
                            NIL
                          </Typography>
                        </StyledTableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
              )
                : null}
            </div>

          </div>
        </DialogContent>
        <DialogActions>

          {(status === "Submitted" || status === 2) && access === true ? (
            <>

              <Button
                size="small"
                className="text-black my-6 mx-4"
                style={{ backgroundColor: "#32CD32" }}
                onClick={() =>
                  dispatch(
                    approveReport({
                      projectId,
                      reportId: dailyData.data.reportId,
                    })
                  ).then((response) => {
                    if (parent == "list") {
                      handleClose()

                    } else if (parent == "dialog") {
                      dispatch(getDetailReport({ projectId, reportId: dailyData.data.reportId })).then(
                        (response) => {
                          let row = {
                            "_id": response.payload._id,
                            "createdAt": response.payload.createdAt,
                            "submittedDate": response.payload.submittedDate,
                            "approvalDate": response.payload.approvalDate,
                            "status": response.payload.status === 0 ? 'Inactive' : response.payload.status === 1 ? 'New' : response.payload.status === 2 ? 'Submitted' : response.payload.status === 3 ? 'Approved' : response.payload.status === 4 ? 'Reverted' : null,
                          }
                          dispatch(openEditDialog(row));
                        }
                      );


                    }
                    handleClose()
                  })
                }
              >
                Approve
              </Button>
            </>
          ) : null}


          <Fab color="primary" aria-label="print">
            <Icon onClick={() => downloadAsPDF()}>
              <PictureAsPdfIcon />
            </Icon>
          </Fab>

          <Button
            onClick={handleClose}
            variant="contained"
            color="primary"
          >
            CLOSE
          </Button>
        </DialogActions>
      </Dialog>
    </>

  )
}

export default ViewReport;