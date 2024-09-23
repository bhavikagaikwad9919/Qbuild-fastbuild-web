import FuseAnimate from "@fuse/core/FuseAnimate";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { Icon, Typography } from "@material-ui/core";
import React, { useState,useEffect }  from "react";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Link } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import axios from "axios";
import FuseLoading from "@fuse/core/FuseLoading";
import constants from "app/main/config/constants";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import { showMessage } from "app/store/fuse/messageSlice";

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

function VendorsDetails(props) {
    const classes = useStyles();  
    const dispatch = useDispatch();
    const userId = useSelector(({ auth }) => auth.user.data.id);
    const [open, setOpen] = useState(true);
    const [mailOpen, setMailOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [details, setDetails]= useState([]);
    const [vendorName, setVendorName]= useState("");
    const [vendor, setVendor]= useState([]);
    const user = useSelector(({ auth }) => auth.user.data);

    useEffect(() => {
        fetchVendors();
      }, []);
      
      async function fetchVendors() {
        const response = await axios.post(constants.BASE_URL + `/data/getVendorDetails/${userId}`,{
            category:props.category.name
        });
         if(response.data.code===200)
         {
          setDetails(response.data.data);
          setOpen(false)
         }else{
          setOpen(false)
         }  
       }

       if (open===true) {
        return <FuseLoading />;
      }

    const openMail = (vendor) =>{
       setVendorName(vendor.Name);
       setVendor(vendor);
       setMailOpen(true);
    }

    const close = () =>{
      setMailOpen(false);
    }

    const sendMail = async () =>{
      setLoading(true);
      await axios.post(constants.BASE_URL + `/vendormail/sendMail`,{
        vendor:vendor,
        user:user
      }).then((response) => {
        if (response.data.code === 200) {
          setMailOpen(false);
          setLoading(false);
          dispatch(
            showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
        } else {
          setMailOpen(false);
          setLoading(false);
          dispatch(
            showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
      }); 
    }
  
  return (
  <>
    <FusePageSimple
      classes={{
        // contentWrapper: "p-0 sm:p-24 pb-80 sm:pb-80 h-full",
        header: "min-h-72 h-72 sm:h-136 sm:min-h-136",
      }}
      header={
        <div className="flex flex-1 items-center justify-between p-8 sm:p-24">
          <div className="flex flex-shrink items-center">
            <div className="flex flex-col items-start w-full ml-20">
              {/* <FuseAnimate animation="transition.expandIn" delay={300}>
                <Icon onClick={() => {props.close();}}
                      className="text-32 ml-20 mr-12">arrow_back</Icon>
              </FuseAnimate> */}
              <FuseAnimate animation='transition.slideRightIn' delay={300}>
            <Typography
              className='normal-case flex items-center sm:mb-12'
              component={Link}
              role='button'
              
              onClick={() => {
                props.close();
              }}
              color='inherit'
            >
              <Icon className='mr-4 text-20'>arrow_back</Icon>
             Vendors
            </Typography>
          </FuseAnimate>
              <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                <Typography variant="h6">
                {props.category.name}
                </Typography>
              </FuseAnimate>
            </div>
          </div>
        </div>
      }
      content={
        <>
        {details.length?
          <div className="flex flex-wrap w-full">
            <Backdrop className={classes.backdrop} open={open}>
             <CircularProgress color="inherit" />
            </Backdrop>
             {details.map((i)=>(
              <div className={clsx(classes.div,"widget flex w-full  md:w-1/2 p-12")}>
               <Paper 
                 onClick={i.Type === 'Paying' ? () => openMail(i) : null} 
                 className={i.Type === 'Paying' ? clsx(classes.div, "w-full rounded-8 pb-10 shadow-none border-1 cursor-pointer"): clsx(classes.div, "w-full rounded-8 pb-10 shadow-none border-1")}
               >
               <img
                 className={clsx(
                 classes.img 
                 )}
                 style={{ height: "60px",paddingTop:"5px", width: "100px"}}
                 src={i.Logo[0] === undefined ? `${props.category.icon_url}`:`${i.Logo[0].url}`}
                 alt="icon"
               />
                 <Typography className="ml-12 mt-5 pb-12" variant="h6">{i.Name}</Typography>
                 <Typography className="ml-10 pr-10 pt-2 text-15  w-full" color="Primary"> {i.Location} </Typography>
                 <Typography className='ml-12 mt-1 pb-6' variant='subtitle1'>{i.Contact_No}</Typography>
                 {/* <Typography>Email us :</Typography> */}
                 <Typography
                   className="font-bold hover:underline"
                   color="secondary"
                 >
                   {i.Email === undefined ? null :i.Email}
                 </Typography>
               </Paper>
              </div>
             ))}
        </div>
       :null}  
       </>
      }
    />
    <Dialog open={mailOpen}>
      <Backdrop className={classes.backdrop} open={loading}>
       <CircularProgress color="inherit" />
      </Backdrop>
      <DialogTitle id="alert-dialog-slide-title" className={"w-auto"}>
        <Typography className="pt-2" variant="h6" color="Primary">  Do you want to Send Mail to  {vendorName} ? </Typography>
        <Typography className="pt-2 text-15 " color="Primary">(Note- Your details like name, email, and contact no will be email to {vendorName} ) </Typography>
      </DialogTitle>
      <DialogActions>
        <Button
          onClick={() => {
            close();
         }}
         color="primary"
        >
         No
        </Button>
        <Button
         onClick={() => {
          sendMail();
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

export default VendorsDetails;
