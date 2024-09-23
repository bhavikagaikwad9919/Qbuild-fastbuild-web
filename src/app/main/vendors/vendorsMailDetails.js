import FuseAnimate from "@fuse/core/FuseAnimate";
import { Icon, Typography } from "@material-ui/core";
import React, { useState,useEffect }  from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch} from "react-redux";
import clsx from "clsx";
import axios from "axios";
import FuseLoading from "@fuse/core/FuseLoading";
import constants from "app/main/config/constants";
import FusePageCarded from "@fuse/core/FusePageCarded";
import ReactTable from "react-table-6";
import Button from '@material-ui/core/Button';
import { showMessage } from "app/store/fuse/messageSlice";
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
    content: {
      "& canvas": {
        maxHeight: "100%",
      },
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
    centerText: {
      textAlign: "center",
    },
    div: {
      height: "fit-content",
      textAlign: "center",
    },
    img:{
      marginLeft: "auto",
      marginRight: "auto",
    }
  }));

function VendorsMailDetails(props) {
    const dispatch = useDispatch();
    const classes = useStyles();  
    const [open, setOpen] = useState(true);
    const [details, setDetails]= useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchVendorMailDetails();
    }, []);
      
    async function fetchVendorMailDetails() {
      await axios.get(constants.BASE_URL + `/vendormail/maliDetails`).then((response) => {
        if(response.data.code===200)
        {
         setDetails(response.data.data);
         setOpen(false)
        }else{
         setOpen(false)
        }
      });      
    }

    const getReport = async () =>{
      setLoading(true);
      await axios.get(constants.BASE_URL + `/vendormail/downloadReport`,{ responseType: "arraybuffer" }).then((response) => {
        if (response.status === 200) {   
          var arr = new Uint8Array(response.data);
          var str = String.fromCharCode.apply(String, arr);
          if (/[\u0080-\uffff]/.test(str)) {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
              "download",
              `Vendor Mail Report.xlsx`
            );
            document.body.appendChild(link);
            link.click();
            setLoading(false);
            dispatch(showMessage({
              message: "Report Downloaded",
              variant: "success",
            }));
          } else {
            str = JSON.parse(str);
            setLoading(false);
            dispatchWarningMessage(dispatch, str.message);
          }
        } else {
          setLoading(false);
          dispatch(
            showMessage({
              message: "Oops!! Network Issue.",
              variant: "error",
            })
          );
        }
      }); 
    }

    if (open===true) {
        return <FuseLoading />;
    }

  return (
  <>
   <FusePageCarded
     classes={{
     content: "flex flex-col",
     leftSidebar: "w-256 border-0",
     header: "min-h-72 h-72 sm:h-136 sm:min-h-136",
     }}
      header={
        <>
        <div className="flex flex-1 items-center justify-between p-8 sm:p-24">
          <div className="flex flex-shrink items-center">
            <div className="flex flex-col items-start w-full ml-20">
              <FuseAnimate animation='transition.slideRightIn' delay={300}>
                 <Typography
                   className='normal-case flex items-center sm:mb-12'
                   component={Link}
                   role='button'
                   variant="h6"
                   onClick={() => {
                     props.close();
                    }}
                   color='inherit'
                  >
                  <Icon className='mr-4 text-20'>arrow_back</Icon>
                     Vendors Mail Details
                  </Typography>
             </FuseAnimate>
            </div>
          </div>
        </div>
        <div className="flex items-center px-8 h-full overflow-x-auto">
              <Button variant="contained"onClick={() => getReport()} className="mb-8 mr-10" style={{ padding: '3px 16px' }}>Download Report</Button>
            </div>
        </>
      }
      content={
        <>
          <Backdrop className={classes.backdrop} open={loading}>
               <CircularProgress color="inherit" />
          </Backdrop>
           <FuseAnimate animation="transition.slideUpIn">
             <ReactTable
                 className={clsx(
                  classes.root,
                  "-striped -highlight sm:rounded-16 overflow-hidden px-6"
                  )}
                 data={details}
                 columns={[
                {
                  Header: "Mailed Date",
                  className: "font-bold",
                  filterable: true,
                  accessor: "createdAt", 
                },
                {
                  Header: "User Name",
                  className: "align-center",
                  accessor: "userName",
                  filterable: true,
                },
                {
                   Header: "Vendor Name",
                   className: "align-center",
                   accessor: "vendorName",
                   filterable: true,
                },
                {
                    Header: "Vendor Category",
                    className: "align-center",
                    accessor: "vendorCategory",
                    filterable: true,
                },
               ]}
              defaultPageSize={20}
              noDataText="No details found"
             />
           </FuseAnimate>
       </>
      }
    />
  </>
  );
}

export default VendorsMailDetails;
