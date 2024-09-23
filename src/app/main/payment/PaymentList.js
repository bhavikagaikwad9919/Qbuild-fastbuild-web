import React, { useState,useEffect, useRef } from "react";
import FuseAnimate from "@fuse/core/FuseAnimate";
import FuseLoading from "@fuse/core/FuseLoading";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import axios from "axios";
import constants from "app/main/config/constants";
import moment from "moment";
import {
  Button,
  TextField,
  Card,
  CardContent,
  IconButton,
  Typography,
} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import MenuItem from "@material-ui/core/MenuItem";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import {
  downloadTaskPdfReport,
} from "app/main/projects/store/projectsSlice";
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";

const useStyles = makeStyles({
  root: {
    maxHeight: "76vh",
  },
});
 
let payment={
  amount:'0',
}

function PaymentList(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  //const payment = useSelector(({ payment }) => payment.entities);
  const [details, setDetails]= useState([]);
  const userId = useSelector(({ auth }) => auth.user.data.id);
  const user = useSelector(({ auth }) => auth.user.data);
  const projects = useSelector(({ projects }) => projects.entities);
  let today = moment(new Date()).format("YYYY-MM-DD");
  const [tabValue, setTabValue] = useState("Details");
  const now=new Date();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState(payment);
  const pageLayout = useRef(null);
  const expiry=now.getMonth()==11? new Date(now.getFullYear()+1,0,1):new Date(now.getFullYear(),now.getMonth()+1,1);
  const [open, setOpen] = useState(true);
  const role = useSelector(({ auth }) => auth.user.role);

  useEffect(() => {
    fetchPayment();
  }, []);
 
  async function fetchPayment() {
    
    if(role === 'admin'){
      const result = await axios.post(constants.BASE_URL + "/payment/getallpayment",{
        userId:userId
      });
      console.log(result)
      if(result.data.code===200)
      {
        setDetails(result.data.data)
      }
    }else{
      const result = await axios.post(constants.BASE_URL + "/payment/getpayment",{
        userId:userId
      });
      console.log(result)
      if(result.data.code===200)
      {
        setDetails(result.data.data)
      }
    }
   
   }

   const handleClose = () => {
    props.onChangeTab("Details");
    setValues(payment);
   };

   const invoice = async (paymentDetails) =>{
    const response = await axios.post(constants.BASE_URL + "/payment/getinvoiceReport",{
      user:user,payment:paymentDetails
    });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Payment Report-${user.displayName}-${today}.pdf`);
      document.body.appendChild(link);
      link.click();
   }  

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
            setLoading(false);
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

  if (!details) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <FuseLoading />;
      </div>
    );
  }
  function ChangeTab(event, value) {
    setTabValue(value);
  }


  return (
    (props.tab==='Details'?
    <FuseAnimate animation="transition.slideUpIn">
      <ReactTable
        className={clsx(
          classes.root,
          "-striped -highlight sm:rounded-16 overflow-hidden px-6"
        )}
        data={details}
        columns={[
          {
            Header: "Name",
            className: "font-bold",
            filterable: true,
            accessor: "userName",
           
          },
          {
            Header: "Payment Date",
            className: "align-center",
            accessor: "paymentDate",
            filterable: true,
          },
          {
            Header: "Amount",
            className: "align-center",
            accessor: "amount",
            filterable: true,
         },
        //  {
        //   Header: 'Download Bill',
        //   filterable: true,
        //   id:'download_report',
        //   accessor: () => (
        //     <Typography
        //       className={'bg-blue  -700 text-white inline p-4 rounded truncate'}
        //     >
        //       Download Bill
        //     </Typography>
        //   ),
        //   Cell: ({ row }) => (
        //     <a
        //       className='cursor-pointer'
        //       onClick={() => invoice(row._original)}
        //     >
        //      Download
        //     </a>
        //   ),
        //   className: 'font-bold',
        // }
        ]}
        defaultPageSize={20}
        noDataText="No payment found"
      />
    </FuseAnimate>
  :
  // <Dialog
  // open={open}
  // onClose={handleClose}
  // aria-labelledby="alert-dialog-title"
  // aria-describedby="alert-dialog-description"
  // >
  //   <DialogTitle id="alert-dialog-title">Payment</DialogTitle>
  //    <DialogContent>
  //     <div
  //       className={clsx(
  //        classes.root,
  //        "flex flex-col flex-auto flex-shrink-0 items-center justify-center p-22"
  //       )}
  //     >
    <div className="flex flex-col items-center justify-center w-full mt-20">
      <FuseAnimate animation="transition.expandIn">
        <Card className="w-full max-w-384 mt-50">
          <CardContent className="flex flex-col items-center justify-center p-22 mb-24">
            {loading ? (
              <CircularProgress />
            ) : (
              <React.Fragment>
              <img
                className="w-128 m-20"
                src="assets/images/logos/qbuild-black.svg"
                alt="logo"
              />
            {details.length>0?
              <>
                 <Typography variant="h6" className="mt-5 mb-2">
                  Pay Now
                 </Typography>
                  <TextField
                  variant="outlined"
                  className="w-3/4 mb-12 my-10"
                  label="Amount"
                  type="number"
                  onChange={handleChange("amount")}
                />
                <Button
                  onClick={() => handleSubmit()}
                  variant="contained"
                  color="primary"
                  className="w-224 mx-autojustify-center my-12"
                  aria-label="Reset"
                  disabled={!isFormValid()}
                >
                 Proceed To Pay
                </Button>
             
                
                <Typography variant="h6" className="mt-12 mb-2">
                 Last Payment of {details[0].amount} Rs.
                </Typography>
  
                <Typography variant="subtitle1" className="mb-16">
                Done on {details[0].paymentDate}.
                </Typography>
                </>
                 :
                 <>
                  <Typography variant="h6" className="mt-5 mb-2">
                  Pay Now
                 </Typography>
                  <TextField
                  variant="outlined"
                  className="w-3/4 mb-12 my-10"
                  label="Amount"
                  type="number"
                  onChange={handleChange("amount")}
                />
                <Button
                  onClick={() => handleSubmit()}
                  variant="contained"
                  color="primary"
                  className="w-224 mx-autojustify-center my-12"
                  aria-label="Reset"
                  disabled={!isFormValid()}
                >
                 Proceed To Pay
                </Button>
             
                 </>}
          </React.Fragment>
            )}
          </CardContent>
        </Card>
      </FuseAnimate>
    </div>
  // </div>
  
  // </DialogContent>
  // <DialogActions>
  //   <Button onClick={handleClose} color="primary">
  //     CANCEL
  //   </Button>
  
  // </DialogActions>
  // </Dialog>
))
}

export default PaymentList;
