import FuseAnimate from "@fuse/core/FuseAnimate";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { Icon, Typography } from "@material-ui/core";
import React from "react";

function refundPolicy() {
  return (
    <FusePageSimple
      // classes={{
      //   // contentWrapper: "p-0 sm:p-24 pb-80 sm:pb-80 h-full",
      //   header: "min-h-72 h-72 sm:h-136 sm:min-h-136",
      // }}
      // header={
      //   <div className="flex flex-1 items-center justify-between p-8 sm:p-24">
      //     <div className="flex flex-shrink items-center sm:w-224">
      //       <div className="flex items-center">
      //         <FuseAnimate animation="transition.expandIn" delay={300}>
      //           <Icon className="text-32 mr-12">message</Icon>
      //         </FuseAnimate>
      //         <FuseAnimate animation="transition.slideLeftIn" delay={300}>
      //           <Typography variant="h6" className="sm:flex">
      //             Refund Policy
      //           </Typography>
      //         </FuseAnimate>
      //       </div>
      //     </div>
      //   </div>
      // }
      content={
        <>
          <div className="p-10">
          <Typography variant="h5"  style={{'font-size': '2.0rem', 'font-weight': '600', 'paddingBottom': '20px'}}> Refund Policy</Typography>
            <FuseAnimate animation="transition.expandIn" delay={300}>
            <div className="flex-col relative overflow-hidden px-8">
             
            <div>
            <div className="flex flex-col gap-10 mt-10">
              <Typography  color="textPrimary">
              Ediquo Technologies Private Limited (Domain name qbuild.app) and any other linked pages, features,
              content or application services (including but without limitation to any mobile application services) offered from time to time by Ediquo Technologies Private Limited state following Refund Policy:-
             </Typography>

              <Typography  color="textPrimary">
                Any person logging on to or using the Website (even when such person does not avail of any services provided in the Website or app shall be presumed to have read these policies (which includes the Terms and Conditions and Privacy Policy, 
                separately provided on the Website and in app) and unconditionally accepted the terms and conditions set out here in and this constitutes a binding and enforceable agreement between the User and Us.
             </Typography>

              <Typography  color="textPrimary">
                To protect your security and privacy, your bank can’t provide Us with information about why your transaction was declined. Because of this, you need to contact your bank directly to solve most payment issues; even if you have successfully used the payment method.
              </Typography>

            </div>
        </div>
            </div>
            </FuseAnimate>



            <FuseAnimate animation="transition.expandIn" delay={300}>
            <div className="flex-col relative overflow-hidden px-8 mt-20">
              <Typography  variant="h6">Please Contact your bank about payment security policies.</Typography>
            <div>
            <div className="flex flex-col gap-10 mt-10">
              <Typography  color="textPrimary">
              Your bank might flag any unexpected activity on your account.
              This includes first-time payment, 
              regardless of the amount of funds available or your credit limit. 
              Your bank might require your verbal authorization to proceed with a transaction.
              </Typography>  
            </div>
           </div>
            </div>
            </FuseAnimate>

            <FuseAnimate animation="transition.expandIn" delay={300}>
             <div className="flex-col relative overflow-hidden px-8 mt-20">
               <Typography  variant="h6">Contact your bank about daily withdrawal or purchase limits</Typography>
              <div>
               <div className="flex flex-col gap-10 mt-10">
                <Typography  color="textPrimary">
                Most banks have limits on how much money can be charged or accessed in a single day.
                If you exceed this daily amount, your bank might block your account from any further activity regardless of available funds in the account.
                Your bank might require you to request a higher purchase limit to complete the transaction.
                </Typography>  
               </div>
             </div>
            </div>
            </FuseAnimate>



            <FuseAnimate animation="transition.expandIn" delay={300}>
             <div className="flex-col relative overflow-hidden px-8 mt-20">
               <Typography  variant="h6">Contact your bank about payment authorizations and reserved funds.</Typography>
              <div>
               <div className="flex flex-col gap-10 mt-10">
                <Typography  color="textPrimary">
                 When you make a transaction using our application, we use RazorPay to contact your card’s issuing bank to confirm that your debit card or credit card has a valid number and has not been reported as lost or stolen.
                 This is communicated by means of a full authorization for the amount of the In case of a failed transaction the change and funds would be reserved against your account for the authorization. 
                 Some banks might hold these authorizations for 7 to 10 business days.
                 If your payment is declined because of lack of available funds, contact your bank to confirm whether the reserved funds are other authorizations, verify the amount of time that they hold authorizations,
                 and request that they remove any extra authorization to free up funds in your account.
                </Typography>  
               </div>
             </div>
            </div>
            </FuseAnimate>
            
            <FuseAnimate animation="transition.expandIn" delay={300}>
             <div className="flex-col relative overflow-hidden px-8 mt-20">
             <Typography  variant="h6">We do not entertain any refund/cancellation, post completion of transaction</Typography>
               <Typography  variant="h6">In case of any other query you can contact us at contact@qbuild.app</Typography>
           
            </div>
            </FuseAnimate>
   
          </div>
        </>
      }
    />
  );
}

export default refundPolicy;
