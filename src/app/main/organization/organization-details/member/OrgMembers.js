import React, { useState, useEffect } from "react";
import FuseAnimate from "@fuse/core/FuseAnimate";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import OrgMembersDialog from "./OrgMembersDialog";
import ReactTable from "react-table-6";
import { Typography } from "@material-ui/core";
import { openEditDialog } from "app/main/organization/store/organizationSlice";
import "react-table-6/react-table.css";

function OrgMembers(props) {
  const dispatch = useDispatch();
  const members = useSelector( ({ organizations }) => organizations.members);
	const details = useSelector(({ organizations }) => organizations.organization);
	const userId = useSelector(({ auth }) => auth.user.data.id);
  const user = useSelector(({ auth }) => auth.user);
  const [access, setAccess] = useState(false);    
  const [hide, setHide] = useState(false)

  useEffect(() => {
    members.forEach((t)=>{  
      if((userId === details.createdBy) || user.role === 'admin')
      {
        setAccess(true)
      }else if(t._id === user.data.id && t.role !== "owner")
      {
        const member = t.access.filter((i)=>i === "Members");
        if(member.length > 0)
        {
          setAccess(true)
        }
      }

      if(t._id === user.data.id && t.designation === "CIDCO Official"){
        setHide(true)
      }
   })
  }, [access, members]);

  function filterCaseInsensitive(filter, row) {
    const id = filter.pivotId || filter.id;
    if(id ==='contact'){
      return (
        row[id] !== undefined ?
          String(row[id].toLowerCase()).includes(filter.value.toLowerCase())
        :
          false
      );
    }else{
      return (
        row[id] !== undefined ?
          String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase())
        :
          false
      );
    }
   
  }

  return (
    <>
      <FuseAnimate animation="transition.slideUpIn">
        <ReactTable
          className={clsx("-striped -highlight sm:rounded-16 overflow-hidden ")}
          data={members}
          filterable
          defaultFilterMethod={(filter, row) => filterCaseInsensitive(filter, row) }
          columns={[
            {
              Header: "Name",
              className: "font-bold",
              accessor: "name",
              Cell: ({ row }) => (
                <Typography
                  className="font-bold hover:underline cursor-pointer"
                  color="secondary"
                  onClick={ access && hide === false ? () => dispatch(openEditDialog(row._original)): null}
                >
                  {row._original.name}
                </Typography>
              ),
            },
            {
              Header: "Designation",
              accessor: "designation",
            },
            {
              Header: "Email",
              accessor: "email",
            },
            {
              Header: "Contact",
              accessor: "contact",
            },
          ]}
          defaultPageSize={10}
          noDataText="Members Not found"
        />
      </FuseAnimate>
      <OrgMembersDialog />
    </>
  );
}

export default OrgMembers;
