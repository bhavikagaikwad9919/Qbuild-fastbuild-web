import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Paper,
} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { withStyles } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";

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

function ViewSSaReport(props){
  const classes = useStyles();
  const projectName = useSelector(({ projects }) => projects.details.title);
  const vendors = useSelector(({ projects }) => projects.vendors);
  const [open, setOpen] = useState(props.open)

  let dailyData = props.data, vendorsName = [];

  vendors.vendorsList.forEach((item) => {
    if(item.agencyType === 'Sub-Contractor'){
      vendorsName.push({
       id: item._id,
       name: item.name,
      });
    }
  });

  useEffect(() => {
    if (props.open) {
      setOpen(true);
    }
  }, [props.open, dailyData]);

  const handleClose = () => {
    setOpen(false);
    props.close();
  };

  return (
    <>
      <Dialog maxWidth="md" open={open}>
        {dailyData.data !== undefined ?
          <DialogTitle id="alert-dialog-title">Daily Progress Report For {projectName} - {dailyData.data.reportedDate}</DialogTitle>
        : 
          <DialogTitle id="alert-dialog-title">Daily Progress Report For {projectName}</DialogTitle>
        }
        <DialogContent className="items-center justify-center">
          {vendorsName.length > 0 ?
            <Typography style={{ textAlign: "left" }} className="font-bold fontSize-12" variant="subtitle" id="tableTitle" component="div">
             Contractor - {vendorsName.length > 0 ? vendorsName[0].name : ''}
            </Typography>
          : 
            null
          }
          <div>
            <Typography
              style={{ textAlign: "center" }}
              variant="h6"
              id="tableTitle"
              component="div"
            >
              Labor At Site
            </Typography>
            <TableContainer component={Paper}>
             <Table className={classes.table} aria-label="Labor Table">
               <TableHead>
                 <TableRow>
                   <StyledTableCell width="40%" align="left">Role</StyledTableCell>
                   <StyledTableCell width="40%" align="left">Labor Count</StyledTableCell>
                 </TableRow>
               </TableHead>
             </Table>
            </TableContainer>
            {dailyData.data !== undefined ? (
            dailyData.labour.length > 0 ? (
              dailyData.labour.map((lb,id) => ( 
                <>
                  <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="Labor Table">
                      <TableBody>
                        <StyledTableRow  key={lb.index}>
                          <StyledTableCell width="40%" align="left">
                            {lb.role}
                          </StyledTableCell>
                          <StyledTableCell width="40%" align="left">
                            {lb.labourCount}
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
                    <StyledTableRow  key={1}>
                      <Typography style={{ textAlign: "center" }} variant="h6" id="tableTitle" component="div">
                        NIL
                      </Typography>
                    </StyledTableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            )
            :null}

            <Typography
              style={{ textAlign: "center" }}
              variant="h6"
              id="tableTitle"
              component="div"
              className="mt-20"
            >
              Equipment At Site
            </Typography>
            <TableContainer component={Paper}>
             <Table className={classes.table} aria-label="Equipment Table">
               <TableHead>
                 <TableRow>
                   <StyledTableCell width="40%" align="left">Machinery Type</StyledTableCell>
                   <StyledTableCell width="40%" align="left">Count</StyledTableCell>
                 </TableRow>
               </TableHead>
             </Table>
            </TableContainer>
            {dailyData.data !== undefined ? (
            dailyData.equipment.length > 0 ? (
              dailyData.equipment.map((eq,id) => ( 
                <>
                  <TableContainer className="pageBreakInside-avoid" component={Paper}>
                    <Table className={classes.table} aria-label="Equipment Table">
                      <TableBody >
                        <StyledTableRow  key={eq.index}>
                          <StyledTableCell width="40%" align="left">
                            {eq.machinery_type}
                          </StyledTableCell>
                          <StyledTableCell width="40%" align="left">
                            {eq.Count}
                          </StyledTableCell>
                        </StyledTableRow>
                       </TableBody>
                    </Table>
                  </TableContainer>
                </>  
              ))
            ) : 
              <TableContainer className="pageBreakInside-avoid"  component={Paper}>
                <Table className={classes.table} aria-label="Equipment Table">
                  <TableBody >
                    <StyledTableRow  key={1}>
                      <Typography style={{ textAlign: "center" }} variant="h6" id="tableTitle" component="div">
                        NIL
                      </Typography>
                    </StyledTableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            )
            :null}

           <Typography
             style={{ textAlign: "center" }}
             variant="h6"
             id="tableTitle"
             component="div"
             className="mt-20"
           >
              Concrete Consumption
           </Typography>
           <TableContainer component={Paper}>
             <Table className={classes.table} aria-label="Consumption Table">
               <TableHead>
                 <TableRow>
                   <StyledTableCell width="15%" align="left">Building</StyledTableCell>
                   <StyledTableCell width="15%" align="left">Grade - Quantity</StyledTableCell>
                   <StyledTableCell width="15%" align="left">Location / Floor</StyledTableCell>
                   <StyledTableCell width="15%" align="left">Element</StyledTableCell>
                   <StyledTableCell width="15%" align="left">Remarks</StyledTableCell>
                 </TableRow>
               </TableHead>
             </Table>
           </TableContainer>
           {dailyData.data !== undefined ? (
            dailyData.consumption.length > 0 ? (
              dailyData.consumption.map((inv,id) => ( 
                <>
                  <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="Consumption Table">
                      <TableBody >
                        <StyledTableRow  key={inv.index}>
                          <StyledTableCell width="15%" align="left" component="th" scope="row">
                            {inv.building}
                          </StyledTableCell>
                          <StyledTableCell width="15%" align="left" component="th" scope="row">
                            {inv.grade + ' - ' + inv.value}
                          </StyledTableCell>
                          <StyledTableCell width="15%" align="left">
                            {inv.location}
                          </StyledTableCell>
                          <StyledTableCell width="15%" align="left">
                            {inv.element}
                          </StyledTableCell>
                          <StyledTableCell width="15%" align="left">
                            {inv.remarks}
                          </StyledTableCell>
                        </StyledTableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>  
              ))
            ) : 
              <TableContainer  component={Paper}>
                <Table className={classes.table} aria-label="Consumption Table">
                  <TableBody >
                    <StyledTableRow  key={1}>
                      <Typography style={{ textAlign: "center" }} variant="h6" id="tableTitle" component="div">
                        NIL
                      </Typography>
                    </StyledTableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            )
           :null}

           <Typography
             style={{ textAlign: "center" }}
             variant="h6"
             id="tableTitle"
             component="div"
             className="mt-20"
           >
              Inventory At Site
           </Typography>
           <TableContainer component={Paper}>
             <Table className={classes.table} aria-label="Inventory Table">
               <TableHead>
                 <TableRow>
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
              dailyData.balanceReport.map((inv,id) => ( 
                <>
                  <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="Inventory Table">
                      <TableBody >
                        <StyledTableRow  key={inv.index}>
                          <StyledTableCell width="25%" align="left" component="th" scope="row">
                            {inv.item}
                          </StyledTableCell>
                          <StyledTableCell width="20%" align="left">
                            {inv.open}
                          </StyledTableCell>
                          <StyledTableCell width="15%" align="left">
                            {inv.received}
                          </StyledTableCell>
                          <StyledTableCell width="15%" align="left">
                            {inv.consumed}
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
              <TableContainer  component={Paper}>
                <Table className={classes.table} aria-label="Inventory Table">
                  <TableBody >
                    <StyledTableRow  key={1}>
                      <Typography style={{ textAlign: "center" }} variant="h6" id="tableTitle" component="div">
                        NIL
                      </Typography>
                    </StyledTableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            )
           :null}
           
           {/* <Typography
              style={{ textAlign: "center" }}
              variant="h6"
              id="tableTitle"
              component="div"
              className="mt-20"
            >
              Hindrance
           </Typography>
           <TableContainer component={Paper}>
             <Table className={classes.table} aria-label="Hindrance Table">
               <TableHead>
                 <TableRow>
                   <StyledTableCell width="25%" align="left">Type</StyledTableCell>
                   <StyledTableCell width="50%" align="left">Description</StyledTableCell>
                 </TableRow>
               </TableHead>
             </Table>
           </TableContainer>
           {dailyData.data !== undefined ? (
            dailyData.hindrance.length > 0 ? (
              dailyData.hindrance.map((hin,id) => ( 
                <>
                  <TableContainer className="pageBreakInside-avoid" component={Paper}>
                    <Table className={classes.table} aria-label="Hindrance Table">
                      <TableBody >
                        <StyledTableRow  key={hin.index}>
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
              <TableContainer className="pageBreakInside-avoid"  component={Paper}>
                <Table className={classes.table} aria-label="Hindrance Table">
                  <TableBody >
                    <StyledTableRow  key={1}>
                      <Typography style={{ textAlign: "center" }} variant="h6" id="tableTitle" component="div">
                        NIL
                      </Typography>
                    </StyledTableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            )
           :null} */}

            {/* <Typography
              style={{ textAlign: "center" }}
              variant="h6"
              id="tableTitle"
              component="div"
              className="mt-20"
            >
              Site Visitor
            </Typography>
            <TableContainer component={Paper}>
             <Table className={classes.table} aria-label="SiteVisitorTable">
               <TableHead>
                 <TableRow>
                   <StyledTableCell width="25%" align="left">Name</StyledTableCell>
                   <StyledTableCell width="25%" align="left">Designation</StyledTableCell>
                   <StyledTableCell width="50%" align="left">Purpose</StyledTableCell>
                 </TableRow>
               </TableHead>
             </Table>
            </TableContainer>
            {dailyData.data !== undefined ? (
             dailyData.sitevisitors.length > 0 ? (
              dailyData.sitevisitors.map((sv,id) => ( 
                <>
                  <TableContainer className="pageBreakInside-avoid" component={Paper}>
                    <Table className={classes.table} aria-label="SiteVisitorTable">
                      <TableBody >
                        <StyledTableRow  key={sv.index}>
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
              <TableContainer className="pageBreakInside-avoid"  component={Paper}>
                <Table className={classes.table} aria-label="SiteVisitorTable">
                  <TableBody >
                    <StyledTableRow  key={1}>
                      <Typography style={{ textAlign: "center" }} variant="h6" id="tableTitle" component="div">
                        NIL
                      </Typography>
                    </StyledTableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            )
            :null} */}

            {/* <Typography
              style={{ textAlign: "center" }}
              variant="h6"
              id="tableTitle"
              component="div"
              className="mt-20"
            >
             Staff
            </Typography>
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="StaffTable">
                <TableHead>
                 <TableRow>
                   <StyledTableCell width="25%" align="left">Name</StyledTableCell>
                    <StyledTableCell width="25%" align="left">Designation</StyledTableCell>
                    <StyledTableCell width="50%" align="left">Status</StyledTableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </TableContainer>
            {dailyData.data !== undefined ? (
              dailyData.staffs.length > 0 ? (
                dailyData.staffs.map((sv,id) => ( 
                 <>
                   <TableContainer className="pageBreakInside-avoid" component={Paper}>
                     <Table className={classes.table} aria-label="StaffTable">
                        <TableBody >
                         <StyledTableRow  key={sv.index}>
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
               <TableContainer className="pageBreakInside-avoid"  component={Paper}>
                  <Table className={classes.table} aria-label="StaffTable">
                    <TableBody >
                      <StyledTableRow  key={1}>
                       <Typography style={{ textAlign: "center" }} variant="h6" id="tableTitle" component="div">
                         NIL
                       </Typography>
                     </StyledTableRow>
                    </TableBody>
                  </Table>
               </TableContainer>
            )
            :null} */}

            <Typography
              style={{ textAlign: "center" }}
              variant="h6"
              id="tableTitle"
              component="div"
              className="mt-20"
            >
              Work Progress
            </Typography>
            <TableContainer component={Paper}>
             <Table className={classes.table} aria-label="Notes Table">
               <TableHead>
                 <TableRow>
                   <StyledTableCell width="25%" align="left">Title</StyledTableCell>
                   <StyledTableCell width="50%" align="left">Description</StyledTableCell>
                 </TableRow>
               </TableHead>
             </Table>
            </TableContainer>
            {dailyData.data !== undefined ? (
            dailyData.notes.length > 0 ? (
              dailyData.notes.map((nt,id) => ( 
                <>
                  <TableContainer className="pageBreakInside-avoid" component={Paper}>
                    <Table className={classes.table} aria-label="Notes Table">
                      <TableBody >
                        <StyledTableRow  key={nt.index}>
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
              <TableContainer className="pageBreakInside-avoid"  component={Paper}>
                <Table className={classes.table} aria-label="Notes Table">
                  <TableBody >
                    <StyledTableRow  key={1}>
                      <Typography style={{ textAlign: "center" }} variant="h6" id="tableTitle" component="div">
                        NIL
                      </Typography>
                    </StyledTableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            )
            :null}

           {/* <Typography
              style={{ textAlign: "center" }}
              variant="h6"
              id="tableTitle"
              component="div"
              className="mt-20"
            >
              Attachments
           </Typography>
           <TableContainer component={Paper}>
             <Table className={classes.table} aria-label="Attachment Table">
               <TableHead>
                 <TableRow>
                   <StyledTableCell width="25%" align="left">Name</StyledTableCell>
                   <StyledTableCell width="100%" align="left">URL</StyledTableCell>
                 </TableRow>
               </TableHead>
             </Table>
           </TableContainer>
           {dailyData.data !== undefined ? (
            dailyData.attachments.length > 0 ? (
              dailyData.attachments.map((att,id) => ( 
                <>
                  <TableContainer className="pageBreakInside-avoid" component={Paper}>
                    <Table className={classes.table} aria-label="Attachment Table">
                      <TableBody >
                        <StyledTableRow  key={att.index}>
                          <StyledTableCell width="25%" align="left" component="th" scope="row">
                            {att.name}
                          </StyledTableCell>
                          <StyledTableCell width="25%" align="left" component="th" scope="row">
                            {att.url}
                          </StyledTableCell>
                        </StyledTableRow>
                       </TableBody>
                    </Table>
                  </TableContainer>
                </>  
              ))
            ) : 
              <TableContainer className="pageBreakInside-avoid"  component={Paper}>
                <Table className={classes.table} aria-label="Attachment Table">
                  <TableBody >
                    <StyledTableRow  key={1}>
                      <Typography style={{ textAlign: "center" }} variant="h6" id="tableTitle" component="div">
                        NIL
                      </Typography>
                    </StyledTableRow>
                  </TableBody>
                </Table>
              </TableContainer>
           )
           :null} */}

            {/* <Typography
              style={{ textAlign: "center" }}
              variant="h6"
              id="tableTitle"
              component="div"
              className="mt-20"
            >
              Work Progress
            </Typography>
            <TableContainer component={Paper}>
             <Table className={classes.table} aria-label="Labor Table">
               <TableHead>
                 <TableRow>
                   <StyledTableCell width="25%" align="left">Item</StyledTableCell>
                   <StyledTableCell width="20%" align="left">Plan Qty</StyledTableCell>
                   <StyledTableCell width="15%" align="left">Executed Qty</StyledTableCell>
                   <StyledTableCell width="15%" align="left">Percentage</StyledTableCell>
                   <StyledTableCell width="50%" align="left">Description</StyledTableCell>
                 </TableRow>
               </TableHead>
             </Table>
            </TableContainer>
            {dailyData.data !== undefined ? (
            dailyData.workProgress.length > 0 ? (
              dailyData.workProgress.map((wp,id) => ( 
                <>
                  <TableContainer   component={Paper}>
                    <Table className={classes.table} aria-label="Work Progress Table">
                      <TableBody>
                        <StyledTableRow  key={wp.index}>
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
              <TableContainer className="pageBreakInside-avoid"   component={Paper}>
                <Table className={classes.table} aria-label="Work Progress Table">
                  <TableBody>
                    <StyledTableRow  key={1}>
                      <Typography style={{ textAlign: "center" }} variant="h6" id="tableTitle" component="div">
                        NIL
                      </Typography>
                    </StyledTableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            )
            :null} */}

          </div> 
        </DialogContent>
        <DialogActions>
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

export default ViewSSaReport;