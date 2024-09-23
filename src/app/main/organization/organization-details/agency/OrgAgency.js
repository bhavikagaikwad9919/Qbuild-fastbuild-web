import React, { useState, useEffect } from "react";
import FuseAnimate from "@fuse/core/FuseAnimate";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import OrgAgencyDialog from "./OrgAgencyDialog";
import ReactTable from "react-table-6";
import { openEditDialog, detailAgency } from "app/main/organization/store/organizationSlice";
import "react-table-6/react-table.css";

function OrgAgency(props) {
  const dispatch = useDispatch();
  const agency = useSelector( ({ organizations }) => organizations.agency);
  const members = useSelector( ({ organizations }) => organizations.members);
  const user = useSelector(({ auth }) => auth.user);
  const [hide, setHide] = useState(false);

  useEffect(() => {
		members.forEach((t)=>{  
			if(t._id === user.data.id && t.designation === "CIDCO Official"){
				setHide(true)
			}
		})
    }, [hide, members]);

  const openDialog = async (data) => {
    await dispatch(detailAgency(data._id));
    dispatch(openEditDialog(data));
   }

  return (
    <>
      <FuseAnimate animation="transition.slideUpIn">
        <ReactTable
          className={clsx("-striped -highlight sm:rounded-16 overflow-hidden ")}
          data={agency}
          filterable
          columns={[
            {
              Header: "Name",
              className: "font-bold",
              accessor: "name",
              Cell: ({ row }) => (
                <a 
                  className="cursor-pointer"
                  onClick={hide === false ? () => openDialog(row._original) : null}
                >
                  {row.name}
                </a>
              ),
            },
            {
              Header: "City",
              accessor: "city",
            },
            {
              Header: "Contact",
              accessor: "contact",
            },
            {
              Header: "Type",
              accessor: "agencyType",
            },
          ]}
          defaultPageSize={10}
          noDataText="No Agency found"
        />
      </FuseAnimate>
      <OrgAgencyDialog />
    </>
  );
}

export default OrgAgency;
