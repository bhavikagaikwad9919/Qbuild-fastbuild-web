import React, { useEffect, useRef } from "react";
import UsersList from "./UsersList";
import FusePageSimple from "@fuse/core/FusePageSimple";
import UsersHeader from "./UsersHeader";
import { getUsers } from "./store/usersSlice";
import { useDispatch } from "react-redux";

function Users(props) {
  const pageLayout = useRef(null);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  return (
    <React.Fragment>
      <FusePageSimple
        classes={{
          // contentWrapper: 'p-0 sm:p-24 pb-80 sm:pb-80 h-full',
          content: "flex flex-col",
          leftSidebar: "w-256 border-0",
          header: "min-h-72 h-72 sm:h-136 sm:min-h-136",
        }}
        header={<UsersHeader />}
        content={<UsersList />}
        sidebarInner
        ref={pageLayout}
        innerScroll
      />
    </React.Fragment>
  );
}

export default Users;
