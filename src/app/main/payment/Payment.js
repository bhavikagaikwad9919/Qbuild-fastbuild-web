import React, { useState,useEffect, useRef } from "react";
import { Typography } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { getallpayment } from "./store/paymentSlice";
import { showMessage } from "app/store/fuse/messageSlice";
import axios from "axios";
import { darken } from "@material-ui/core/styles/colorManipulator";
import { makeStyles } from "@material-ui/styles";
import constants from "app/main/config/constants";
import moment from "moment";
import PaymentList from "./PaymentList";
import PaymentHeader from "./PaymentHeader";
import FusePageCarded from "@fuse/core/FusePageCarded";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";


const useStyles = makeStyles((theme) => ({
  root: {
    background:
      "radial-gradient(" +
      darken(theme.palette.primary.dark, 0.5) +
      " 0%, " +
      theme.palette.primary.dark +
      " 80%)",
    color: theme.palette.primary.contrastText,
  },
}));

let payment={
  amount:'0',
}

function Payment() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const role = useSelector(({ auth }) => auth.user.role);
  const userId = useSelector(({ auth }) => auth.user.data.id);
  const user = useSelector(({ auth }) => auth.user.data);
  const [values, setValues] = useState(payment);
  const [details, setDetails]= useState([]);
  const [tabValue, setTabValue] = useState("Details");
  let today = moment(new Date()).format("YYYY-MM-DD");
  const now=new Date();
  const pageLayout = useRef(null);
  const expiry=now.getMonth()==11? new Date(now.getFullYear()+1,0,1):new Date(now.getFullYear(),now.getMonth()+1,1);

  useEffect(() => {
    dispatch(getallpayment());
  }, [dispatch]);

  function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
}

useEffect(() => {
  fetchPayment();
}, []);

async function fetchPayment() {
  setLoading(true);
  const result = await axios.post(constants.BASE_URL + "/payment/getpayment",{
     userId:userId
   });
   if(result.data.code==200)
   {
    setDetails(result.data.data)
    setLoading(false);
   }
 }


const handleChange = (prop) => (event) => {
  setValues({ ...values, [prop]: event.target.value });
};

function isFormValid() {
  return values.amount > 0;
}

async function handleSubmit() {
 setLoading(true);

  const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
  );

  if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
  }

  const result = await axios.post(constants.BASE_URL + "/payment/orders",{
    pay:values.amount
  });

  if (!result) {
      alert("Server error. Are you online?");
      return;
  }

  const { amount, id: order_id, currency } = result.data.message;

  const options = {
      key: "rzp_live_ZC9wepDygFqlhu", // Enter the Key ID generated from the Dashboard
      amount: amount.toString(),
      currency: currency,
      name: "QBuild",
      description: "Payment",
     // image: { logo },
      order_id: order_id,
      handler: async function (response) {
          const data = {
              amount: amount/100,
              orderCreationId: order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              userId:userId,
              userName:user.displayName,
              paymentDate:today,
          };

          if(response)
          {
            setLoading(true);
            const result = await axios.post(constants.BASE_URL + "/payment/success", data);
            if(result.data.code == 200)
           { 
            dispatch(
              showMessage({
                message: "Payment Successfully Completed.",
                variant: "success",
                autoHideDuration: null,
              })
            );
            fetchPayment();
          }
          }
      },
      prefill: {
          name: "",
          email: "",
          contact: "",
      },
      theme: {
          color: "#61dafb",
      },
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
  setValues({ ...values, amount: '0' });
  setLoading(false);
}

function handleChangeTab(event, value) {
  setTabValue(value);
}

function change(value)
{
  setTabValue(value);
}

  
  return (
 (role==='admin'?
 <React.Fragment>
 <FusePageCarded
   classes={{
     content: "flex flex-col",
     leftSidebar: "w-256 border-0",
     header: "min-h-0 h-0 sm:h-0 sm:min-h-0",
   }}
   //header={<PaymentHeader />}
   contentToolbar={
     <>
       <Tabs
         value={tabValue}
         indicatorColor="primary"
         textColor="primary"
         variant="scrollable"
         scrollButtons="auto"
         classes={{ root: "w-full h-64" }}
       >
         <Tab
           className="h-64 normal-case"
           label={
             <>
               <div>
                 <Typography variant="subtitle">
                  Payee Details
                 </Typography>
                 {/* <Chip
                   className="ml-12"
                   label={entities.ownedProjects.data.length}
                   size="small"
                   color="primary"
                 /> */}
               </div>
             </>
           }
           value="Payee Details"
         />
       </Tabs>
     </>
   }
   content={<PaymentList tab={tabValue} />}
   sidebarInner
   ref={pageLayout}
   innerScroll
 />
 </React.Fragment>
  :
  <React.Fragment>
    <FusePageCarded
      classes={{
       // content: "p-0 sm:p-0",
        //leftSidebar: "w-256 border-0",
        header: "min-h-0 h-0 sm:h-0 sm:min-h-0",
      }}
      //header={<PaymentHeader />}
      contentToolbar={
        <>
          <Tabs
            value={tabValue}
            onChange={handleChangeTab}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            classes={{ root: "w-full h-64" }}
          >
            <Tab
              className="h-64 normal-case"
              label={
                <>
                  <div>
                    <Typography variant="subtitle">
                     Details
                    </Typography>
                    {/* <Chip
                      className="ml-12"
                      label={entities.ownedProjects.data.length}
                      size="small"
                      color="primary"
                    /> */}
                  </div>
                </>
              }
              value="Details"
            />
            <Tab
              className="h-64 normal-case"
              label={
                <div>
                  <Typography variant="subtitle">
                    Make a Payment
                  </Typography>
                  {/* <Chip
                    className="ml-12"
                    label={entities.associatedProjects.data.length}
                    size="small"
                    color="primary"
                  /> */}
                </div>
              }
              value="Make a Payment"
            />
          </Tabs>
        </>
      }
      content={<PaymentList tab={tabValue}
                onChangeTab={change} />}
      //sidebarInner
      ref={pageLayout}
    //  innerScroll
    />
  </React.Fragment>
 ))}


export default Payment;
