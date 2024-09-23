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
import constants from "app/main/config/constants";
import VendorsDetails from "./vendorsDetails";
import VendorsMailDetails from "./vendorsMailDetails";
import FuseLoading from "@fuse/core/FuseLoading";
import Button from '@material-ui/core/Button';

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
    selectedProject: {
      background: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      borderRadius: "8px 0 0 0",
    },
    projectMenuButton: {
      background: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      borderRadius: "0 8px 0 0",
      marginLeft: 1,
    },
    div: {
      height: "150px",
    },
    img:{
      marginLeft: "auto",
      marginRight: "auto",
    }
  }));

function Vendors() {
    const classes = useStyles();
    const loading = useSelector(({ projects }) => projects.loading);
    const [open, setOpen] = useState(true);
    const [details, setDetails]= useState([]);
    const [show, setShow] = useState(false);
    const [showMailDetails, setShowMailDetails] = useState(false);
    const [category, setCategory] = useState({name:"",icon_url:""});
    const role = useSelector(({ auth }) => auth.user.role);

    useEffect(() => {
        fetchVendors();
      }, []);
      
    async function fetchVendors() {
        const response = await axios.get(constants.BASE_URL + "/data/getVendors");
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

    const handleClose = () => {
        setShow(false);
        setShowMailDetails(false);
        setCategory({name:"",icon_url:""});
    };

    const info =(vendor) => {
            setCategory({name:vendor.Category_name,icon_url:vendor.Icon_Url});
            setShow(true);
      }

  return show===false?
   (
    <FusePageSimple
      classes={{
        // contentWrapper: "p-0 sm:p-24 pb-80 sm:pb-80 h-full",
        header: "min-h-72 h-72 sm:h-136 sm:min-h-136",
      }}
      header={
        <>
          <div className="flex flex-1 items-center justify-between p-8 sm:p-24">
            <div className="flex flex-shrink items-center sm:w-224">
              <div className="flex items-center">
               <FuseAnimate animation="transition.expandIn" delay={300}>
                  <Icon className="text-32 ml-20 mr-12">person</Icon>
               </FuseAnimate>
               <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                  <Typography variant="h6" className="sm:flex">
                    Vendors
                  </Typography>
               </FuseAnimate>
              </div>
           </div>
          </div>
          {role === 'admin' ?
            <div className="flex items-center px-8 h-full overflow-x-auto">
              <Button onClick={()=> { setShowMailDetails(true)
                                      setShow(true)}}
                 variant="contained" className="mb-8 mr-10" style={{ padding: '3px 16px' }}>Vendor Mail Details</Button>
            </div>
          :null}
        </>
      }
      content={
        <>
        {details.length?
          <div className="flex flex-wrap w-full">
            <Backdrop className={classes.backdrop} open={open}>
              <CircularProgress color="inherit" />
            </Backdrop>
            {details.map((i)=>(
             <div  onClick={() => info(i)} className="widget cursor-pointer flex w-full sm:w-1/2 md:w-1/5 p-12 ">
              <Paper className="w-full rounded-8 shadow-none border-1">
              <div className="text-center py-8">
               <FuseAnimate className={clsx(classes.centerText, "text-60 leading-none")}
                 color="Primary"
                 animation="transition.expandIn" delay={300}>
                 <img  
                   className={clsx(classes.img)}
                   style={{ height: "15px", width: "15px"  }}
                   src={`${i.Icon_Url}`}
                   alt="icon"
                 />
               </FuseAnimate>
              </div>
              <div className="flex items-center py-8 border-t-1">
               <Link
                 onClick={() => info(i)}
                 className={clsx(classes.centerText, "text-15 items-center w-full")}
                 color="textSecondary"
               >
                  {i.Category_name}
               </Link>
              </div>
              </Paper>
             </div>
           ))}
          </div>
        :null}      
        </> }
     />
  ):showMailDetails ===false ?
  <VendorsDetails category={category}  close={handleClose}/>
  :<VendorsMailDetails  close={handleClose}/>;
}

export default Vendors;
