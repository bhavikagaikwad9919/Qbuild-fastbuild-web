import FuseAnimate from "@fuse/core/FuseAnimate";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { Icon, Typography } from "@material-ui/core";
import React from "react";

function ContactUs() {
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
      //           <Typography variant="h6">
      //             Contact Us
      //           </Typography>
      //         </FuseAnimate>
      //       </div>
      //     </div>
      //   </div>
      // }
      content={
        <>
          <div className="p-10">
          <Typography variant="h5"  style={{'font-size': '2.0rem', 'font-weight': '600', 'paddingBottom': '10px'}}> Contact Us</Typography>
            <FuseAnimate animation="transition.expandIn" delay={300}>
              <div className="flex flex-1 flex-row gap-10">
                <Typography>Email :</Typography>
                <a className="font-bold" href="mailto:support@qbuild.app">
                  support@qbuild.app
                </a>
              </div>
            </FuseAnimate>
          </div>
        </>
      }
    />
  );
}

export default ContactUs;
