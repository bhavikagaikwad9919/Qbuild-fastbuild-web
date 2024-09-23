import React, { useState, useEffect } from "react";
import FuseAnimate from "@fuse/core/FuseAnimate";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import OrgSitesDialog from "./OrgSitesDialog";
import { openEditDialog } from "app/main/organization/store/organizationSlice";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import history from "@history";
import { Typography } from "@material-ui/core";

function OrgSites(props) {
  const dispatch = useDispatch();
  const sites = useSelector( ({ organizations }) => organizations.sites);
  const details = useSelector(({ organizations }) => organizations.organization);
  const userId = useSelector(({ auth }) => auth.user.data.id);
  const [access, setAccess] = useState(false);
  const members = useSelector( ({ organizations }) => organizations.members);
  const user = useSelector(({ auth }) => auth.user);
  const selectedRoutes = useSelector(({ organizations }) => organizations.routes);

  let orgType = '';
  if(details === undefined || details === null){
    orgType = '';
  }else{
    orgType = details.orgType === undefined || details.orgType === null ? '' : details.orgType
  }

  useEffect(() => {
    members.forEach((t)=>{  
      if((userId === details.createdBy) || user.role === 'admin')
      {
        setAccess(true)
      }else if(t._id === user.data.id && t.role !== "owner")
      {
        const member = t.access.filter((i)=>i === selectedRoutes);
        if(member.length > 0)
        {
          setAccess(true)
        }
      }
   })
  }, [access, members]);

  function filterCaseInsensitive(filter, row) {
    const id = filter.pivotId || filter.id;
    return (
      row[id] !== undefined ?
        String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase())
      :
        false
    );
  }


  return (
    <>
      <FuseAnimate animation="transition.slideUpIn">
        <ReactTable
          className={clsx("-striped -highlight sm:rounded-16 overflow-hidden ")}
          data={sites}
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
                  onClick={ access && orgType === 'SSA' ?() =>
                    history.push({
                      pathname: `/site/${details._id}/${row._original._id}`,
                    }) : access ? () => dispatch(openEditDialog(row._original)):null
                  }
                >
                  {row._original.name}
                </Typography>
              ),
            },
            {
              Header: "CTS No",
              accessor: "ctsNo"
            },
            {
              Header: "Address",
              accessor: "address",
            }
          ]}
          defaultPageSize={10}
          noDataText="Sites Not found"
        />
      </FuseAnimate>
      <OrgSitesDialog />
    </>
  );
}

export default OrgSites;
