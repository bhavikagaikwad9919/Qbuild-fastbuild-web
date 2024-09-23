import FusePageCarded from "@fuse/core/FusePageCarded";

import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
//import { useParams } from "react-router-dom";
import NotificationHeader from "./NotificationHeader";
import NotificationList from "./notify/NotificationList";
//import withReducer from "app/store/withReducer";
import { getNotification, getNotificationForAdmin, unreadCount } from "./store/notificationSlice";

function Notification(props) {
  const dispatch = useDispatch();
  const userId = useSelector(({ auth }) => auth.user.data.id);
  const role = useSelector(({ auth }) => auth.user.role);

  let page = 1, limit = 10;
  useEffect(() => {
    if(role === 'admin'){
      dispatch(getNotificationForAdmin({userId, page, limit}));
    }else{
      dispatch(getNotification(userId));
      dispatch(unreadCount(userId));
    }
    
  }, [dispatch, userId]);

  const pageLayout = useRef(null);
  return (
    <FusePageCarded
      classes={{
        root: "w-full",
        content: "flex flex-col",
        header: "items-center min-h-72 h-72 sm:h-136 sm:min-h-136",
      }}
      header={<NotificationHeader />}
      //   contentToolbar={routeParams.mailId ? <MailToolbar /> : <MailsToolbar />}
      content={<NotificationList />}
      //   leftSidebarHeader={<MailAppSidebarHeader />}
      //   leftSidebarContent={<MailAppSidebarContent />}
      ref={pageLayout}
      innerScroll
    />
  );
}

export default Notification;
