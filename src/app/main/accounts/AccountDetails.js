import React, { useRef, useEffect } from "react";
import FusePageSimple from "@fuse/core/FusePageSimple";
import FuseLoading from "@fuse/core/FuseLoading";
import { useDispatch, useSelector } from "react-redux";
// import { getProject } from "../store/projectsSlice";
import AccountSidebarContent from "./AccountSidebarContent";
import AccountDetailsHeader from "./AccountDetailsHeader";
import Password from "./components/Password";
import Refund from "../refundPolicy/refundPolicy";
import ContactUs from "../contact-us/ContactUs";
import Invite from "../invite/Invite";
import Payment from "../payment/Payment";
import PrivacyPolicy from "../privacy-policy/privacyPolicy";

function AccountDetails(props) {
  const pageLayout = useRef(null);
  const dispatch = useDispatch();
  // useEffect(() => {

  //   });
  // }, []);
  // const details = useSelector(({ projects }) => projects.details);
  const routes = useSelector(({ auth }) => auth.user.route);

  // if (!details) {
  //   return <FuseLoading />;
  // }
  return (
    <React.Fragment>
      <FusePageSimple
        classes={{
          contentWrapper: "pl-0 pr-0 ",
          content: "flex flex-col h-full",
          leftSidebar: "w-256 border-0",
          header: "min-h-72 h-72 sm:h-136 sm:min-h-136",
        }}
        header={<AccountDetailsHeader pageLayout={pageLayout} />}
        content={(() => {
          switch (routes) {
            case "Password":
              return <Password />;
            
            case "Refund":
              return <Refund />; 
             
            case "ContactUs":
            return <ContactUs />;

            case "Invite":
              return <Invite />;

            case "PrivacyPolicy":
              return <PrivacyPolicy />; 

            case "Payment":
              return <Payment />;  
            default:
              return  <Password />;
          }
        })()}
        leftSidebarContent={<AccountSidebarContent pageLayout={pageLayout} />}
        sidebarInner
        ref={pageLayout}
        innerScroll
      />
    </React.Fragment>
  );
}

export default AccountDetails;
